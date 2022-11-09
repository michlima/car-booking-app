import React, {useState, useEffect} from 'react';
import Bookcar from './components/BookCar/Bookcar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth, db } from './backend/firebase';
import { bookTime } from './backend/utils';
import Navigation from './components/Navigations';
import Authentication from './components/Authentication/Authentication';
import CompleteRegistration from './components/Authentication/CompleteRegistration';
import { getDocs, collection, getDoc, doc, query, where } from 'firebase/firestore';
import {GiCarWheel} from 'react-icons/gi'
import FocusReservation from './components/BookCar/FocusReservation';
import MyReservations from './components/BookCar/MyReservations';




function App() {
  const [user] = useAuthState(auth)
  const [userInfo, setUserInfo] = useState({
    firstName: ''
  })
  const init = React.useRef(true)
  const [schedule, setSchedule]     = useState(null)
  const [isLoading, setIsLoading]   = useState(true)
  const [myReservations, setMyReservations] = useState()

  const getData = async () => {
    getMyReservations()
    console.log('fetching schedule')
    let data = []
    console.log('fetched Data')
    const querySnapshot = await getDocs(collection(db, "schedule"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newData = {id: doc.id, data: doc.data()}
        data.push(newData)
    }); 
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setUserInfo(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    setSchedule(data)
  }

  const getMyReservations = async () => {
    let reservations = []
    console.log(user.uid)
    const q = query(collection(db, "schedule"), where("reserverID", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      const newData = {id: doc.id, data: doc.data()}
      reservations.push(newData)
    });
    setMyReservations(reservations)

  }

  const load = async () => {
    await sleep(2000).then(() => {
      setIsLoading(false)
    })
  }
  
  useEffect(() => {
    if(isLoading){
      load()
      window.localStorage.setItem('day',-1)
      window.localStorage.setItem('month',-1)
      window.localStorage.setItem('year',-1)
    }
  },[])

  if(isLoading){
    return (
      <div className='flex flex-col items-center justify-center w-screen h-screen'>
        <div className='animate-bounce'>
          <GiCarWheel className='animate-spin' size={100}/>
        </div>
      </div>
    )
  }

  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  if(!user){
    return (
      <Router>
        <Routes>
          <Route path='/'                             element={<Authentication />}/>
          <Route path='/complete-registration'        element={<CompleteRegistration/>}/>
        </Routes>
      </Router>
    )
  }

  
  if(init.current){
    getData()
    init.current = false
  }
 

  const bookTimeF = async (data) => {
    console.log(data)
    await bookTime(data)
    getData()
  }

  const removeFromSchedule = (id) => {
    let arr = schedule
    let index
    console.log(id)
    for(let i = 0; i < schedule.length; i++){
      if (schedule[i].id == id){
        index = i
        console.log(i)
        break
      }
        
    }
    arr.splice(index,1)
    setSchedule(arr)
  }



  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Bookcar schedule={schedule} userid={user.uid} userInfo={userInfo} bookTimeF={(data) => bookTimeF(data)}/>}/>
        <Route path='/focus-reservation'             element={<FocusReservation userid={user.uid} getData={getData} removeFromSchedule={(id) => removeFromSchedule(id)} />}/>
        <Route path='/my-reservations'             element={<MyReservations myReservations={myReservations} userid={user.uid} userInfo={userInfo} getData={getData}/>}/>
      </Routes>
      <button onClick={() => console.log(schedule)}></button>

      <a className='text-[0.7rem] text-gray-400 w-screen flex justify-center font-italix'>beta version- 2.0.2</a>
    </Router>
  );
}

export default App;
