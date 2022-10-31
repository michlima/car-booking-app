import React, { useRef, useState } from 'react'
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md' 
import {GoLocation} from 'react-icons/go'
import {FaCarAlt, FaRegTimesCircle, FaCheck} from 'react-icons/fa'
import { writeKms } from '../../backend/utils'
import { db } from '../../backend/firebase'
import { getDoc, doc } from 'firebase/firestore'
import Modal from './Modal'


const ShowCalendar = (props) => {

    const [modalShowing, setModalShowing] = useState(false)
    const [kms,setKms] = useState({
        start: '',
        end: '',
    })
    const [kmsFetched,setKmsFetched] = useState({end:false, start:false})
    const [focusBooking,setFocusBooking] = useState()
    const [reason, setReason] = useState()
    const [year, setYear] = useState(new Date().getFullYear())
    const [month, setMonth] = useState(new Date().getMonth())
    const [date, setDate]       = useState({
        day: new Date().getDate(),
        month: getMonth(month),
        year: new Date().getFullYear(),
    })



    const times = []
    for(let i = 0; i < 24; i++){
        for(let j = 0; j < 60; j+=5) {
            if(j < 10)
                times.push(i + ':0' + j)
            else 
                times.push(i + ':' + j)
        }
    }

    let days = []
    var dd = new Date(year, month, 1);
    let counter = 0
    while (dd.getMonth() === month) {
        counter +=1
        days.push(counter);
        dd.setDate(dd.getDate() + 1);
    } 
    
    const changeMonth = (increment) => {
        let newMonth = month
        if(increment){
            newMonth = newMonth + 1
            if(newMonth > 11){
                newMonth = 0
                let newYear = date.year + 1 
                setDate(prevState => ({
                    ...prevState,
                    year: newYear
                }));
            }
        }
        else {
            newMonth = newMonth -1
            if(newMonth < 0){
                newMonth = 11
                let newYear = date.year - 1 
                setDate(prevState => ({
                    ...prevState,
                    year: newYear
                }));
            }
        }

        let name = getMonth(newMonth)
        console.log(newMonth)
        setDate(prevState => ({
            ...prevState,
            month: name
        }));
        setMonth(newMonth)
    }

    const selectDay = (day) => {
        setDate(prevState => ({
            ...prevState,
            day: day
        }))
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setKms({
          ...kms,
          [name]: event.target.value,
        });
    };

    const postKms = () => {
        writeKms(kms, focusBooking)
        setKmsFetched({end:kms.end, start:kms.start})
    }

    const openModal = (id) => {
        setFocusBooking(id)
        getkms(id)
        setModalShowing(true)
        getReason(id)
        setKms({start: '', end: ''})

    }

    const getkms = async (id) => {
        const docRef = doc(db, "kms", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setKmsFetched(docSnap.data())
        } else {
            setKmsFetched({end:false, start:false})
        }
    }

    const getReason = (id) => {
        props.schedule.map((object) => {
            if(object.id == id){
                setReason(object.data.reason)
                return 
            }
        })
    }





    return(
        
        <div className=' flex items-center flex-col px-2 '>
            <div className=' w-4/6 py-2 flex flex-row text-white m-2 items-center justify-center rounded-lg bg-gray-800'>
                    <button  className='w-12' onClick={() => changeMonth(false)}>
                        <MdKeyboardArrowLeft size={35}/>
                    </button>
                    <div className='mx-max flex justify-center w-4/6'>
                        {date.month}
                    </div>
                    <button onClick={() => changeMonth(true)}>
                        <MdKeyboardArrowRight size={35}/>
                    </button>
                </div>
                <div className='w-full mx-2 bg-gray-800 text-white flex flex-row overflow-auto scrollbar h-16 rounded-lg snap-mandatory '>
                {days.map((day, index) => {
                    if(day == date.day){
                        return <div key={index} className=' duration-200 mt-4 duration-200 m-1 bg-red-400  px-3 snap-center'>{day}</div>
                    }
                    return ( 
                            <button ke={index} onClick={() => selectDay(day)} className='duration-200 m-1 px-3 snap-center'>{day}</button>
                    
                    )
                })}
            </div>
            {props.schedule ? 
                <div className='grid grid-cols-2 gap-5 w-screen flex items-center justify-center mt-2'>
                    {props.schedule.map((object, index) => {
                        let schedule = object.data
                        console.log(schedule)
                        if(schedule.month == date.month && schedule.day == date.day)
                        return(
                            <button  onClick={() =>  openModal(object.id)} key={index} className=' flex flex-col bg-red-400 m-4 text-white rounded-lg flex items-center'>
                                <div className='bg-gray-800 w-full flex flex-col text-1xl rounded-t-lg p-2 '>
                                    <span className='mr-2 text-1xl font-bold'>{schedule.driver}</span>
                                    {`${schedule.startHour}:${schedule.startMinute} - ${schedule.endHour}:${schedule.endMinute}`}
                                </div> 
                                <p className=' m-2 flex items-center justify-center font-semibold'><GoLocation/>{schedule.destination}</p>
                                <p className=' m-2 flex items-center justify-center font-semibold'><FaCarAlt/>{schedule.car}</p>
                            </button> 
                        )
                    })}
                    
                </div>
                :
                <div/>
            }
            <Modal 
            isShowing={modalShowing} 
            closeModal={() => setModalShowing(false)} 
            kmsFetched={kmsFetched} 
            kms={kms} 
            handleChange={handleChange} 
            reason={reason}
            postKms={postKms}/>
            <button onClick={() => console.log(props)}>click me</button>
        </div>
    )
}

const getMonth = (month) => {
    switch (month) {
        case 0:
            return 'January'
        case 1:
            return 'February'
        case 2:
            return 'March'
        case 3:
            return 'April'
        case 4:
            return 'May'
        case 5:
            return 'June'
        case 6:
            return 'July'
        case 7:
            return 'August'
        case 8:
            return 'September'
        case 9:
            return 'October'
        case 10:
            return 'November'
        default:
            return 'December'
    }
}

export default ShowCalendar