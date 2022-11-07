import { collection, query, where,doc, setDoc ,getDocs, addDoc, updateDoc } from "firebase/firestore"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signOut} from "firebase/auth";



import { db } from "./firebase";

const bookTime = async (data) => {
    try {
        const docRef = await addDoc(collection(db, 'schedule',), {
          reservationId : data.id,
          driver        : data.driver,
          destination   : data.destination,
          reason        : data.reason,
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
  try {
    await setDoc(doc(db, "kms", id), data)
    
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

const registerData = async (uid,email, fName, lName, age) => {
  const dataUid = {
    email: email,
    firstName: fName,
    lastName: lName,
    age: age,
  }
  console.log(dataUid)
  try {
    await setDoc(doc(db, "users", uid), dataUid);
  } catch (e) {
    console.error("Error adding document: ", e);
    return false
  }
  return true
}



export {bookTime, getReservations, writeKms, signIn, register, registerData, editTime}