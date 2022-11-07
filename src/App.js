import React, {useState, useEffect} from 'react';
import Bookcar from './components/BookCar/Bookcar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth, db } from './backend/firebase';
import { bookTime } from './backend/utils';
import Navigation from './components/Navigations';
import Authentication from './components/Authentication/Authentication';
import CompleteRegistration from './components/Authentication/CompleteRegistration';
import { getDocs, collection } from 'firebase/firestore';
import {GiCarWheel} from 'react-icons/gi'
import FocusReservation from './components/BookCar/FocusReservation';




function App() {

  const [reservationData, setReservationData] = useState({
    id: null,
    data : {
        driver: null,
        reason: null,
        destination: null,
        startHour: null,
        startMinute: null,
        endHour: null,
        endMinute: null
    }
})

  const [user] = useAuthState(auth)
  const init = React.useRef(true)
  const [schedule, setSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const getData = async () => {
    console.log('fetching schedule')
    let data = []
    console.log('fetched Data')
    const querySnapshot = await getDocs(collection(db, "schedule"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newData = {id: doc.id, data: doc.data()}
        data.push(newData)
    });
    setSchedule(data)
    console.log(data)
  }

  const load = async () => {
    await sleep(2000).then(() => {
      setIsLoading(false)
    })
  }
  
  useEffect(() => {
    if(isLoading){
      load()
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

  console.log(user)
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
  console.log(user)



  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Bookcar schedule={schedule} userid={user.uid} bookTimeF={(data) => bookTimeF(data)}/>}/>
        <Route path='focus-reservation'             element={<FocusReservation getData={getData} reservation={reservationData}/>}/>
      </Routes>
      <button onClick={() => console.log(schedule)}></button>
    </Router>
  );
}

export default App;
