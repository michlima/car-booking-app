import React, {useState, useEffect} from 'react';
import Bookcar from './components/BookCar/Bookcar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowCalendar from './components/Schedule/ShowCalendar';
import {useAuthState} from 'react-firebase-hooks/auth'
import { auth } from './backend/firebase';
import { bookTime } from './backend/utils'
import Navigation from './components/Navigations';
import Authentication from './components/Authentication/Authentication';
import EmailAthentication from './components/Authentication/EmailAthentication';
import CompleteRegistration from './components/Authentication/CompleteRegistration';
import EmailConfirmation from './components/Authentication/EmailConfirmation';
import AccountCreatedConfirmation from './components/Authentication/AccountCreatedConfirmation';
import { getDocs, collection } from 'firebase/firestore';
import { db } from './backend/firebase';
import {GiCarWheel} from 'react-icons/gi'




function App() {

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
          <Route path='/authenticate-email'           element={<EmailAthentication/>}/>
          <Route path='/email-sent-confirmation'      element={<EmailConfirmation/>}/>
          <Route path='/complete-registration'        element={<CompleteRegistration/>}/>
          <Route path='/registration-completed'       element={<Authentication/>}/>
          <Route path='/account-created-confirmation' element={<AccountCreatedConfirmation/>}/>
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
        <Route path='/calendar' element ={<ShowCalendar schedule={schedule}/>}/>
      </Routes>
      <button onClick={() => console.log(schedule)}></button>
    </Router>
  );
}

export default App;
