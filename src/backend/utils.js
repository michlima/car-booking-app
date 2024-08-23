import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "./firebase";
import { ENCRYPTION_KEY } from "./config";
import aes from "crypto-js/aes";
import CryptoJS from "crypto-js";

const accountRequestCreate = async (data) => {
  var encryptedPassword = aes.encrypt(data.password, ENCRYPTION_KEY).toString();
  try {
    addDoc(collection(db, "user-account-request"), {
      email: data.email,
      password: encryptedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age,
    });
  } catch (error) {
    return false;
  }
  return true;
};

const accountRequestAccept = async (userInfo) => {
  let decryptedPassword = aes.decrypt(userInfo.password, ENCRYPTION_KEY);
  let decryptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);
  console.log(userInfo);
  console.log(decryptedString);
  try {
    await createUserWithEmailAndPassword(auth, userInfo.email, decryptedString)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // register userinformation in database
        registerData(
          user.uid,
          userInfo.email,
          userInfo.firstName,
          userInfo.lastName,
          userInfo.age,
        );
        console.log(user);
        return true;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        console.log(errorCode);
        // ..
      });
  } catch (error) {
    return false;
  }
  return true;
};

const accountRequestDelete = async (docId) => {
  const docRef = doc(db, "user-account-request", docId);
  try {
    deleteDoc(docRef);
  } catch (error) {
    return false;
  }
  return true;
};

const accountResquetsGet = async () => {
  let data = [];
  const querySnapshot = await getDocs(collection(db, "user-account-request"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.data());
    data.push({ data: doc.data(), id: doc.id });
  });
  return data;
};

const bookLongTime = async (data) => {
  let docRef = addDoc(
    collection(db, "user-reservations", data.id, "my-reservations"),
    {
      paid: !data.personalTrip,
      reserverID: data.id,
      reserverName: data.reserverName,
      driver: data.driver,
      destination: data.destination,
      reason: data.reason,
      personalTrip: data.personalTrip,
      car: data.car,
      startDate: data.startDate,
      endDate: data.endDate,
      cost: data.cost,
      type: "Multi day trip",
      timestamp: new Date(),
      longTrip: data.longTrip,
    },
  );
  return docRef;
};

const bookTime = async (data, startDate, endDate) => {
  const date = `${data.startDate.getFullYear()}-${getMonthStringLC(
    data.startDate.getMonth(),
  )}`;
  let start;
  let end;
  console.log(startDate);
  console.log(endDate);
  if (startDate > endDate) {
    start = endDate;
    end = startDate;
  } else {
    start = startDate;
    end = endDate;
  }
  console.log(start);
  console.log(end);
  try {
    const docRef = await addDoc(
      collection(db, "data-timeframe", date, "reservations"),
      {
        paid: false,
        reserverID: data.id,
        reserverName: data.reserverName,
        driver: data.driver,
        destination: data.destination,
        reason: data.reason,
        personalTrip: data.personalTrip,
        car: data.car,
        startDate: start,
        endDate: end,
        cost: data.cost,
        longTrip: data.longTrip,
        timestamp: new Date(),
      },
    );
    await setDoc(
      doc(db, "user-reservations", data.id, "my-reservations", docRef.id),
      {
        paid: false,
        reserverID: data.id,
        reserverName: data.reserverName,
        driver: data.driver,
        destination: data.destination,
        reason: data.reason,
        personalTrip: data.personalTrip,
        car: data.car,
        startDate: start,
        endDate: end,
        cost: data.cost,
        longTrip: data.longTrip,
        timestamp: new Date(),
      },
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getMonthReservations = async (date) => {
  let data = [];
  const querySnapshot = await getDocs(
    query(
      collection(db, "data-timeframe", date, "reservations"),
      orderBy("startDate"),
    ),
  );
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data());
    data.push(doc.data());
  });
  console.log(data);
  return data;
};

const makeSuper = async (id, isSuper) => {
  const docRef = doc(db, "users", id);
  await updateDoc(docRef, {
    isSuper: !isSuper,
  });
};

const createUserInfo = () => {};

const writeKms = async (cardDate, data, id, userID) => {
  const date = `${cardDate.getFullYear()}-${getMonthStringLC(
    cardDate.getMonth(),
  )}`;

  console.log(db);
  console.log(data);
  console.log(cardDate);
  console.log(id);
  console.log(userID);
  console.log(date);
  const docRef = doc(db, "data-timeframe", date, "reservations", id);
  let i = await updateDoc(docRef, data);
  const docRef2 = doc(db, "user-reservations", userID, "my-reservations", id);
  let r = await updateDoc(docRef2, data);
  console.log(i);
  console.log(r);
};

const updateCarInfo = async (id, data) => {
  const docRef = doc(db, "carlist", id);
  await updateDoc(docRef, data);
};

const writePayments = async (id, kms, car) => {
  console.log(kms);
  let pay;
  if (car == "Truck") {
    pay = ((kms.end - kms.start) * 0.5).toFixed(2);
  } else {
    pay = ((kms.end - kms.start) * 0.3).toFixed(2);
  }
  const washingtonRef = doc(db, "kms", id);
  console.log(kms);
  console.log(id);

  console.log("writing payment");
  try {
    await updateDoc(washingtonRef, {
      price: pay,
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getReservations = async () => {
  let data = [];
  const querySnapshot = await getDocs(collection(db, "schedule"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data());
    data.push(doc.data);
  });
  return data;
};

const signIn = (credentials) => {
  signInWithEmailAndPassword(auth, credentials.email, credentials.password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};

const register = async (email, userInfo) => {
  await createUserWithEmailAndPassword(auth, email, userInfo.password)
    .then((userCredential) => {
      const user = userCredential.user;
      // register userinformation in database
      registerData(
        user.uid,
        email,
        userInfo.firstName,
        userInfo.lastName,
        userInfo.age,
      );
      return true;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
  return false;
};

const editTime = async (data, times, userID) => {
  let start = new Date(data.data.startDate.seconds * 1000);
  const date = `${start.getFullYear()}-${getMonthStringLC(start.getMonth())}`;

  const docRef = doc(db, "data-timeframe", date, "reservations", data.id);
  const docRef2 = doc(
    db,
    "user-reservations",
    userID,
    "my-reservations",
    data.id,
  );
  await updateDoc(docRef, {
    startDate: times.startDate,
    endDate: times.endDate,
  });
  await updateDoc(docRef2, {
    startDate: times.startDate,
    endDate: times.endDate,
  });
};

const updatePayment = async (data, userID) => {
  let start = new Date(data.data.startDate.seconds * 1000);
  const date = `${start.getFullYear()}-${getMonthStringLC(start.getMonth())}`;
  const docRef = doc(db, "data-timeframe", date, "reservations", data.id);
  const docRef2 = doc(
    db,
    "user-reservations",
    userID,
    "my-reservations",
    data.id,
  );
  await updateDoc(docRef, {
    paid: true,
  });
  await updateDoc(docRef2, {
    paid: true,
  });
};

const deleteBooking = async (id, data, userID) => {
  let start = new Date(data.data.startDate.seconds * 1000);
  const date = `${start.getFullYear()}-${getMonthStringLC(start.getMonth())}`;
  const docRef = doc(db, "data-timeframe", date, "reservations", data.id);
  const docRef2 = doc(
    db,
    "user-reservations",
    userID,
    "my-reservations",
    data.id,
  );

  await deleteDoc(docRef);
  await deleteDoc(docRef2);
};

const payTrip = async (id) => {
  console.log(id);
  const schedule = doc(db, "schedule", id);
  await updateDoc(schedule, {
    paid: true,
  });
};

const editData = async (id, reserverID, data, date) => {
  const ddate = `${date.getFullYear()}-${getMonthStringLC(date.getMonth())}`;
  const schedule = doc(db, "data-timeframe", ddate, "reservations", id);
  const schedule2 = doc(
    db,
    "user-reservations",
    reserverID,
    "my-reservations",
    id,
  );
  console.log(id);
  console.log(reserverID);
  console.log(data);
  console.log(date);
  if (data.editDri) {
    await updateDoc(schedule, {
      driver: data.driver,
    });
    await updateDoc(schedule2, {
      driver: data.driver,
    });
  }

  if (data.editDes) {
    await updateDoc(schedule, {
      destination: data.destination,
    });
    await updateDoc(schedule2, {
      destination: data.destination,
    });
  }

  if (data.editSD) {
    await updateDoc(schedule, {
      startDate: data.startDate,
    });
    await updateDoc(schedule2, {
      startDate: data.startDate,
    });
  }

  if (data.editED) {
    await updateDoc(schedule, {
      endDate: data.endDate,
    });
    await updateDoc(schedule2, {
      endDate: data.endDate,
    });
  }
};

const registerData = async (uid, email, fName, lName, age) => {
  const dataUid = {
    email: email,
    firstName: fName,
    lastName: lName,
    age: age,
  };
  const querySnapshot = await getDocs(collection(db, "users"));
  let newUser = true;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    if (doc.id == uid) {
      newUser = false;
      console.log(doc.id);
      console.log(uid);
    }
  });
  if (newUser) {
    console.log("newUser");
    try {
      await setDoc(doc(db, "users", uid), dataUid);
    } catch (e) {
      console.error("Error adding document: ", e);
      return false;
    }
    return true;
  }
  return false;
};

const costPerKM = 0.3;

const usersGet = async () => {
  let users = [];
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    const newData = { id: doc.id, data: doc.data() };
    users.push(newData);
  });
  return users;
};

const addNewCar = async (carInfo) => {
  console.log("adding car from utils");
  console.log(carInfo);
  try {
    await setDoc(doc(db, "carlist", carInfo.id), carInfo);
  } catch (error) {
    console.log(error);
    return false;
  }
  console.log("added");
  return true;
};

const carDelete = async (id) => {
  const docRef = doc(db, "carlist", id);
  try {
    deleteDoc(docRef);
  } catch (error) {
    return false;
  }
  return true;
};

const getMonthString = (month) => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    default:
      return "December";
  }
};

const getMonthStringShort = (month) => {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    default:
      return "Dec";
  }
};

const getMonthStringLC = (month) => {
  switch (month) {
    case 0:
      return "january";
    case 1:
      return "february";
    case 2:
      return "march";
    case 3:
      return "april";
    case 4:
      return "may";
    case 5:
      return "june";
    case 6:
      return "july";
    case 7:
      return "august";
    case 8:
      return "september";
    case 9:
      return "october";
    case 10:
      return "november";
    default:
      return "december";
  }
};

export {
  editData,
  bookTime,
  getReservations,
  writeKms,
  signIn,
  register,
  registerData,
  editTime,
  deleteBooking,
  payTrip,
  costPerKM,
  updateCarInfo,
  getMonthStringShort,
  writePayments,
  getMonthString,
  getMonthStringLC,
  bookLongTime,
  updatePayment,
  makeSuper,
  getMonthReservations,
  // admin => users info
  usersGet,
  addNewCar,
  carDelete,
  // account requests
  accountRequestAccept,
  accountRequestCreate,
  accountResquetsGet,
  accountRequestDelete,
};
