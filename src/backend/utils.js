import { collection, query, where,doc, setDoc ,getDocs, addDoc } from "firebase/firestore"; 


import { db } from "./firebase";

const bookTime = async (data) => {
   
    try {
        const docRef = await addDoc(collection(db, 'schedule',), {
          driver      : data.driver,
          destination : data.destination,
          reason      : data.reason,
          startHour   : data.startHour,
          startMinute : data.startMinute,
          endHour     : data.endHour,
          endMinute   : data.endMinute,
          month       : data.month,
          day         : data.day,
          year        : data.year,
          car         : data.car
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
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



export {bookTime, getReservations, writeKms}