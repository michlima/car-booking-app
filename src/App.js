import React, {useState, useEffect} from 'react';
import Bookcar from './components/BookCar/Bookcar'; 
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth, db } from './backend/firebase';
import { bookTime } from './backend/utils';
import Navigation from './components/Navigations';
import Authentication from './components/Authentication/Authentication';
import CompleteRegistration from './components/Authentication/CompleteRegistration';
import { getDocs, collection, getDoc, doc } from 'firebase/firestore';
import {GiCarWheel} from 'react-icons/gi'
import FocusReservation from './components/BookCar/FocusReservation';
import MyReservations from './components/BookCar/MyReservations';
import {AiOutlineLoading} from 'react-icons/ai'




function App() {
  const [user, loading] = useAuthState(auth)
  const [userInfo, setUserInfo] = useState({
    firstName: 'null'
  })
  const init = React.useRef(true)
  const [schedule, setSchedule]     = useState(null)
  const [myReservations, setMyReservations] = useState()

  const getData = async () => {
    let data = []
    const querySnapshot = await getDocs(collection(db, "schedule"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newData = {id: doc.id, data: doc.data()}
        data.push(newData)
    })
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    if(!window.localStorage.getItem('driver')){
      window.localStorage.setItem('driver','')
    }
    
    getMyReservations(data)
    setSchedule(data)
  }

  const getMyReservations = async (reservations) => {
    let myReservastions = []
    if(userInfo.admin){
      reservations.map((reservation) => {
        if(!reservation.data.paid && reservation.data.personalTrip){
          myReservastions.push(reservation)
        }
      })
    } else {
      reservations.map((reservation) => {
        if(reservation.data.reserverID == user.uid && !reservation.data.paid && reservation.data.personalTrip){
          myReservastions.push(reservation)
        }
      })
    }   
    setMyReservations(myReservastions)
  }
  
  useEffect(() => {
      window.localStorage.setItem('day',-1)
      window.localStorage.setItem('month',-1)
      window.localStorage.setItem('year',-1)
  },[])

  if(loading){
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
    await bookTime(data)
    getData()
  }

  const removeFromSchedule = (id) => {
    let arr = schedule
    let index
    for(let i = 0; i < schedule.length; i++){
      if (schedule[i].id == id){
        index = i
        break
      }
        
    }
    arr.splice(index,1)
    setSchedule(arr)
  }

  if(userInfo.firstName == 'null'){
    return (
      <div>
        <div className='w-screen h-screen bg-white flex items-center justify-center'>
          <div className><AiOutlineLoading className='animate-spin text-primary-2' size={40}/></div>
        </div>
      </div>
    )
  }




  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Bookcar schedule={schedule} userid={user.uid} userInfo={userInfo} bookTimeF={(data) => bookTimeF(data)}/>}/>
        <Route path='/focus-reservation'             element={<FocusReservation userInfo={userInfo} userid={user.uid} getData={getData} removeFromSchedule={(id) => removeFromSchedule(id)} />}/>
        <Route path='/my-reservations'             element={<MyReservations myReservations={myReservations} userid={user.uid} userInfo={userInfo} getData={getData}/>}/>
        <Route
            path="/redirect"
            element={ <Navigate to="/" /> }
        />
      </Routes>
      <a className='text-[0.7rem] text-gray-400 w-screen flex justify-center font-italix'>beta version- 2.0.3</a>
    </Router>
  );
}

export default App;
