import './App.css';
import Bookcar from './components/Bookcar'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ShowCalendar from './components/ShowCalendar';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../backend/firebase'
import { bookTime } from '../backend/utils'
import Navigation from './components/Navigations';



function App() {
  const init = useRef()

  const getData = async () => {
    let data = []
    console.log('fetched Data')
    const querySnapshot = await getDocs(collection(db, "schedule"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newData = {id: doc.id, data: doc.data()}
        data.push(newData)
    });
    schedule.current = data
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

  return (
    <Router>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Bookcar bookTimeF={(data) => bookTimeF(data)}/>}/>
        <Route path='/calendar' element ={<ShowCalendar schedule={schedule.current}/>}/>
      </Routes>
    </Router>
  );
}

export default App;
