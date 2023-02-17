import { collection, query, where,doc, setDoc ,getDoc,getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signOut} from "firebase/auth";



import { db } from "./firebase";

const bookTime = async (data) => {
  console.log(data)
    try {
        const docRef = await addDoc(collection(db, 'schedule',), {
          paid          : !data.personalTrip,
          reserverID    : data.id,
          reserverName  : data.reserverName,
          driver        : data.driver,
          destination   : data.destination,
          reason        : data.reason,
          personalTrip  : data.personalTrip,
          startHour     : data.startHour,
          startMinute   : data.startMinute,
          endHour       : data.endHour,
          endMinute     : data.endMinute,
          month         : data.month,
          day           : data.day,
          year          : data.year,
          car           : data.car
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

const createUserInfo = () => {

}

const writeKms = async (data, id) => {
  console.log(data)
  console.log('writing kms')
  try {
    await setDoc(doc(db, "kms", id), data)
    
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}


const writePayments = async (id, kms, car) => {
  console.log(kms)
  let pay 
  if(car == 'Truck') {
    pay = ((kms.end - kms.start) * 0.50).toFixed(2)
  } else {
    pay = ((kms.end - kms.start) * 0.30).toFixed(2)
  }
  const washingtonRef = doc(db, "kms", id);
  console.log(kms)
  console.log(id)
  
  console.log('writing payment')
  try {
    await updateDoc(washingtonRef, {
      price: pay
    });
    
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const getReservations = async () => {
  let data = []
  const querySnapshot = await getDocs(collection(db, "schedule"));
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    console.log(doc.data())
    data.push(doc.data)
  });
  return data
}

const signIn = (credentials) => {
  signInWithEmailAndPassword(auth, credentials.email, credentials.password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

const register = (email, userInfo) => {
  createUserWithEmailAndPassword(auth, email, userInfo.password)
  .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      registerData(user.uid, email,userInfo.firstName, userInfo.lastName, userInfo.age)
      console.log(user)
      // ...
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
  });
}

const registerGoodgleUser = (fName, lName, age) => {
  const dataUid = {
    firstName: fName,
    lastName: lName,
    age: age
  }
}

const editTime = async (id, name, value) => {
  const schedule = doc(db, 'schedule', id)
  await updateDoc(schedule, {
    [name]: value,
  });
}

const deleteBooking = async (id) => {
  await deleteDoc(doc(db, "schedule", id));
  await deleteDoc(doc(db, "kms", id));
}

const payTrip = async (id) => {
  console.log(id)
  const schedule = doc(db, 'schedule', id)
  await updateDoc(schedule,{
    'paid': true
  })
}

const registerData = async (uid,email, fName, lName, age) => {
  const dataUid = {
    email: email,
    firstName: fName,
    lastName: lName,
    age: age,
  }
  const querySnapshot = await getDocs(collection(db, "users"));
  let newUser = true
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    if(doc.id == uid){
      newUser = false
      console.log(doc.id)
    console.log(uid)
    }
    
  });
  if(newUser){
    console.log('newUser')
    try {
      await setDoc(doc(db, "users", uid), dataUid);
    } catch (e) {
      console.error("Error adding document: ", e);
      return false
    }
    return true
  }
  return false
}

const costPerKM = 0.30


export {bookTime, getReservations, writeKms, signIn, register, registerData, editTime, deleteBooking, payTrip, costPerKM, writePayments}