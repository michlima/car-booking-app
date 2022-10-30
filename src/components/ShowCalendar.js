import React, { useRef, useState } from 'react'
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md' 
import {GoLocation} from 'react-icons/go'
import {FaCarAlt, FaRegTimesCircle, FaCheck} from 'react-icons/fa'
import { writeKms } from '../backend/utils'
import { db } from '../backend/firebase'
import { getDoc, doc } from 'firebase/firestore'

const modalOpen = 'duration-200 fixed bottom-0 w-screen h-[37rem] flex justify-enter items-center flex-col bg-gray-800 w-12/12 h-12/12 rounded-lg p-2'
const modalClosed = 'duration-200 w-0 h-0 '

const ShowCalendar = (props) => {

    const [modalCls, setModalCls] = useState(modalClosed)
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
        setModalCls(modalOpen)
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
            <div/> }
                <div className={modalCls}>
                    { modalCls == modalClosed ?
                    <div/>
                    :
                    <div className='w-screen flex justify-enter items-center flex-col'>
                        <button className='bg-gray-800 w-6 h-6 rounded-full text-white ml-52' onClick={() => setModalCls(modalClosed)}><FaRegTimesCircle size={20}/></button>
                        <p className='text-2xl text-white'>Milage</p>

                        {kmsFetched.start ?
                        <div className=' text-white text-2xl'>
                            Start - {kmsFetched.start}
                        </div>
                        :
                        <input  
                            className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                            type='number'
                            placeholder='start ...'
                            name='start'
                            value={kms.start}
                            onChange={handleChange}
                            autoComplete="off"
                            />
                        }

                        {kmsFetched.end ?
                            <div className=' text-white text-2xl'>
                                End - {kmsFetched.end}
                            </div>
                            :
                            <input  
                            className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                            placeholder='end ...'
                            type='number'
                            name='end'
                            value={kms.end}
                            onChange={handleChange}
                            autoComplete="off"
                            />
                        }
                        <div className='text-white'>
                            <p className='font-semibold'>Reason</p>
                            <p className='italic'>{reason}</p>
                        </div>
                        
                        {
                            kmsFetched.start && kmsFetched.end
                            ?
                            <div/>
                            :
                            <button onClick={postKms} className='w-screen w- h-2 flex items-center justify-center mt-12' >
                                <p className=' duration-200 w-16 h-16 bg-red-400 flex items-center hover:text-3xl hover:w-12 hover:h-12 hover:text-white justify-center rounded-full'> <FaCheck/></p>
                            </button>
                        }
                        
                    </div>
                    }
                </div>
                
            
            
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