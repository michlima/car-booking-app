import React, {useState, useEffect, useRef} from 'react'
import { db } from '../../backend/firebase'
import { getDoc, doc } from 'firebase/firestore'
import {GoLocation} from 'react-icons/go'
import {CgArrowsExchange} from 'react-icons/cg'
import {BiTime} from 'react-icons/bi'
import {GiPathDistance} from 'react-icons/gi'
import {AiFillEdit, AiOutlineLoading} from 'react-icons/ai'
import {RiSendPlane2Fill} from 'react-icons/ri'
import { MdOutlineArrowBackIos} from 'react-icons/md'
import Input from '../Input'
import { writeKms, editTime, payTrip, deleteBooking, writePayments} from '../../backend/utils'
import Clock from './Clock'
import { useNavigate, useLocation } from 'react-router-dom'
import { costPerKM } from '../../backend/utils'



const mainCls = 'duration-200 relative overflow-auto pb-20 fixed bottom-0 w-screen h-full flex justify-center items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'



const hours = ['12']
for(let i = 0; i < 24;i++){
    if(i == 11){
        hours.push('00')
        continue
    }
    hours.push(`${i + 1}`)
}


const FocusReservation = (props) => {
    const month = new Date().getMonth()
    const year = new Date().getFullYear()
    const day = new Date().getDate()
    

    const navigate = useNavigate()
    const location = useLocation()
    const [gotPayment, setGotPayment] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [kmsFetched, setKmsFetched] = useState({
        end: false
    })
    const [fillKms, setFillKms] = useState({
        start: '',
        end: ''
    })
    
    const [editting, setEditing] = useState({
        kmsStart: false,
        kmsEnd: false,
        timeStart: false,
        timeEnd: false,
    })


    const [time, setTime] = useState({})

    const [selectingHour, setSelectingHour] = useState(true)
    const [am, setIsAm] = useState(true)

    useEffect(() => {
        if(location.state){
            getkms(location.state.reservationData.id)
        }
    }, [])

    useEffect(() => {
        if(kmsFetched.start && kmsFetched.end && !kmsFetched.price){
            writePayments(reservationId, kmsFetched, location.state.reservationData.data.car)
            getkms(location.state.reservationData.id)
        }
    }, [kmsFetched])
  
    
    if(location.state === null){
        sleep(5000).then(() => {
            setErrorMessage(true)
        })
        return(
            <div className={mainCls}>
                <div className><AiOutlineLoading className='animate-spin text-primary-2' size={40}/></div>
                {errorMessage
                ?
                    <>
                        <a>There seems to be a problem.</a>
                        <button onClick={() => navigate('/')} className='duration-200 bg-white hover:bg-primary-2 m-2 hover:text-white hover:scale-125 px-6 py-2 text-2xl rounded-lg '>Return to main page</button>
                    </>
                : 
                    <></>
                }
                
            </div>
        )    
    } 
    const reservationId = location.state.reservationData.id
    const reservedBy = location.state.reservationData.data.reservationId ? location.state.reservationData.data.reservationId :  location.state.reservationData.data.reserverID
    const data = location.state.reservationData.data
    const canEdit = (props.userid == reservedBy)
    const reservationMonth = getMonth(data.month)
            
    const getkms = async (id) => {
        if(id){
            const docRef = doc(db, "kms", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setKmsFetched(docSnap.data())
                setFillKms(docSnap.data())
            } else {
                setKmsFetched({end:false, start:false})
            }
        }
        
        setTime({
            startHour: data.startHour,
            startMinute: data.startMinute,
            endHour: data.endHour,
            endMinute: data.endMinute,
        })
    }
    

    const handleInput = (name, value) => {
        setFillKms(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const confirmKms = (name, value) => {
        setKmsFetched(prevState => ({
            ...prevState,
            [name]:value
        }))
        writeKms(fillKms, reservationId) 
    } 

    const handleClock = (type, value) => {
        if(type == 'startHour'){
            handleClockStart('startHour', value)
        }
        if(type == 'startMinute'){
            handleClockStart('startMinute', value)
        }
        if(type == 'endHour'){
            handleClockEnd('endHour', value)
        }
        if(type == 'endMinute'){
            handleClockEnd('endMinute', value)
        }
    }

    const handleClockEnd = (name,hour) => {
        let value = hour
        if(name == 'endHour'){
            setSelectingHour(false)
            if(Number(hour) < Number(time.startHour)){
                value = Number(value) + 12
            }
        } else {
            setEditing( prevValue =>({
                ... prevValue,
                'timeEnd' : false
            }))
            setSelectingHour(true)
            let selectedTime = {endHour: time.endHour, endMinute: hour}
        }
        
        if(!am && name == 'endHour'){
            if(value == 12){
                value = hours[hour]    
            }else {
                let i = +hour + 12
                value = hours[+hour + 12]
            }
        }

        setTime(prevState => ({
            ...prevState,
            [name] : value
        }))
        editTime(reservationId, name, value)

    }

    const handleClockStart = (name,hour) => {
        let value = hour

        if(!am && name == 'startHour'){
            if(value == 12){
                value = hours[hour]    
            } else {
                value = hours[+hour + 12]
            }
        }
        setTime(prevState => ({
            ...prevState,
            [name] : value
        }))

        if(name == 'startHour'){
            setSelectingHour(false)
        } else {
            setEditing( prevValue =>({
                ... prevValue,
                'timeStart' : false
            }))
            setSelectingHour(true)
        }
        editTime(reservationId, name, value)
    }
    
    const editThis = (name, value) => {
        setSelectingHour(true)
        if(name == 'timeStart'){
            if(editting.timeStart){
                setEditing( prevValue =>({
                    ... prevValue,
                    [name]: false,
                    'timeEnd' : false
                }))
            } else{
                setEditing( prevValue =>({
                    ... prevValue,
                    [name]: value,
                    'timeEnd' : false
                }))
            }
            
        }
        if(name == 'timeEnd'){
            if(editting.timeEnd){
                setEditing( prevValue =>({
                    ... prevValue,
                    [name]: false,
                    'timeStart' : false
                }))
            } else {
                setEditing( prevValue =>({
                    ... prevValue,
                    [name]: value,
                    'timeStart' : false
                }))
            }
            
        }
        
    }

    const refreshData = () => {
        props.getData()
        navigate(location.state.onReturn)
    }

    const deleteItem = async () => {
        props.removeFromSchedule(reservationId)
        
        await deleteBooking(reservationId)
        props.getData().then(() => {
            navigate(location.state.onReturn)
        }) 
    }
    const markAsPaid = async () => {
        payTrip(reservationId)
        props.getData().then(() => {
            navigate(location.state.onReturn)
        })
    }


    
    if(kmsFetched.start == 'loading') {
        return (
            <div className=''>
                <div className=' absolute top-0 w-screen bg-gray-800 flex justify-enter items-center  pb-4 flex-col'>
                    <a className='text-2xl text-white mt-5'>{data.driver}</a>
                </div>
                <div className='w-screen h-screen flex items-center justify-center'><AiOutlineLoading className='animate-spin text-primary-2' size={40}/></div>
            </div>
        )
    }

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    return(
        <div className={mainCls} >
            <div className='absolute top-0 w-screen bg-gray-800 flex justify-enter items-center pb-4 flex-col '>
                <button onClick={refreshData} className='absolute flex items-center justify-center top-1 left-3 w-12 h-12 mt-2 text-white '><MdOutlineArrowBackIos size={20}/> </button>
                <a className='text-2xl text-white mt-5'>Driver: {data.driver}</a>
                <a className='text-sm text-white mt-5'>reserved by: {data.reserverName}</a>
            </div>
                <div className='w-screen mt-28 flex flex-col items-center justify-center '>
                    <div className='bg-gray-800 w-11/12 rounded-lg m-3 text-white text-sm flex flex-row items-center justify-center'>
                        <div className='flex flex-col items-center justify-center'>
                            <a className='mx-1 mt-1 flex items-center justify-center font-semibold'><GoLocation className='m-2'/>Harfe</a>
                        </div>
                        <CgArrowsExchange className='text-white mx-5 ' size={40}/>
                        <div className='flex flex-col items-center justify-center'>
                            <a className=' mx-1 mt-1 flex items-center justify-center font-semibold'><GoLocation className='m-2'/>{data.destination ? data.destination :'??????'}</a>
                        </div>
                    </div>
                    <div className='bg-gray-800 p-5 w-11/12 rounded-lg m-3 text-white flex flex-col items-center justify-center'>
                        <a className='m-2 flex flex-col items-center'>
                            Reason:<span className=' font-bold'>{data.reason}</span>
                            {data.personalTrip ? <a className='text-sm text-primary-2 italic' >personal</a> : <></>}
                        </a>
                        <div className='flex flex-row items-center justify-center'>
                            <div className='flex flex-col items-center justify-center'>
                                <a className='mx-2 mt-1 flex items-center justify-center font-semibold'>Start</a>
                                <div className='flex flex-row items-center justify-center flex-col'>
                                    <a className=' mx-2 mt-1 text-3xl flex items-center justify-center font-semibold'>{time.startHour}:{time.startMinute}</a>                            
                                    {canEdit && day <= data.day && month <= reservationMonth &&  year <= data.year
                                    ?
                                        <button onClick={() => editThis('timeStart', true)}>
                                            <AiFillEdit size={20} className='text-primary-2'/>
                                        </button>
                                    :
                                        <></>
                                    }
                                </div>
                            </div>
                            <CgArrowsExchange className='text-white mx-10' size={40}/>
                            <div className='flex flex-col items-center justify-center'>
                                <a className=' mx-2 mt-1 flex items-center justify-center font-semibold'>End</a>
                                <div className='flex flex-row items-center justify-center flex-col'>
                                    <a className=' mx-2 mt-1 text-3xl flex items-center justify-center font-semibold'>{time.endHour}:{time.endMinute}</a>
                                    {canEdit && day <= data.day && month <= reservationMonth &&  year <= data.year
                                    ?
                                        <button onClick={() => editThis('timeEnd', true)}>
                                            <AiFillEdit size={20} className='text-primary-2'/>
                                        </button>
                                    :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                        {editting.timeEnd
                        ?
                            <Clock hours={hours} hour={selectingHour} am={am}setIsAm={() => setIsAm(!am)} handleClock={selectingHour ? ( value) => handleClock('endHour', value) :( value) => handleClock('endMinute', value) }/>  
                        :
                            <></>
                        }
                        {editting.timeStart
                        ?
                            <Clock hours={hours} hour={selectingHour} am={am}setIsAm={() => setIsAm(!am)} handleClock={selectingHour ? ( value) => handleClock('startHour', value) :( value) => handleClock('startMinute', value) }/>  
                        :
                            <></>
                        }
                        {editting.timeEnd || editting.timeStart
                        ?
                            <></>
                        :
                            <BiTime size={40}/>
                        }
                        
                    </div>
                    <div className='bg-gray-800 p-5 w-11/12 rounded-lg m-3 text-white flex flex-col items-center justify-center'>
                        {!kmsFetched.start && !kmsFetched.end
                        ?
                            <a className='text-red-400 text-3xl m-2 font-bold'>
                                !KMS!
                            </a>       
                        :
                            !kmsFetched.end
                            ?
                                <a className='text-primary-2 text-1xl m-2 font-bold'>
                                    !KMS!
                                </a>  
                            :
                            <></>
                        }
                        
                        <div className='flex flex-row items-center justify-center'>
                            <div className='flex flex-col items-center justify-center'>
                                <a className='mx-2 mt-1 flex items-center justify-center font-semibold'>Start</a>
                                {kmsFetched.start 
                                ? 
                                    <a className=' mx-2 mt-1 flex text-3xl items-center justify-center font-semibold'>{kmsFetched.start}</a>
                                :
                                    <a className=' mx-2 mt-1 flex text-3xl items-center justify-center font-semibold'>??????</a>
                                }
                            </div>
                            <CgArrowsExchange className='text-white mx-2' size={40}/>
                            <div className='flex flex-col items-center justify-center'>
                                <a className=' mx-2 mt-1  flex items-center justify-center font-semibold'>End</a>
                                {kmsFetched.end 
                                    ? 
                                        <a className=' mx-2 mt-1 flex text-3xl items-center justify-center font-semibold'>{kmsFetched.end}</a>
                                    :
                                        <a className=' mx-2 mt-1 flex text-3xl items-center justify-center font-semibold'>??????</a>
                                    }
                            </div>
                        </div>
                        <GiPathDistance className='m-2' size={40}/>
                        {canEdit
                        ?
                            <>
                                {!kmsFetched.start ||  editting.kmsStart 
                                    ?
                                        <div className='flex flex-row w-full items-center justify-center'>
                                            <Input label='start' placeholder='start kms...'  handleInput={(name, value) => handleInput(name, value)}/>
                                            <button  onClick={() => confirmKms('start', fillKms.start)}className='flex -translate-y-2 ml-2'><RiSendPlane2Fill size={30}/></button>
                                        </div>
                                    :
                                        <></>
                                        
                                }
                            
                                {!kmsFetched.end || editting.kmsEnd 
                                ?
                                    <div className='flex flex-row w-full items-center justify-center'>
                                        <Input label='end' placeholder='end kms...'  handleInput={(name, value) => handleInput(name, value)}/>
                                        <button onClick={() => confirmKms('end', fillKms.end)} className=' flex -translate-y-2 ml-2'><RiSendPlane2Fill size={30}/></button>
                                    </div>
                                :
                                    <></>
                                }
                            </>
                        :
                            <></>
                        }
                        
                    </div>
                </div>
                {data.personalTrip && kmsFetched.end && kmsFetched.start && data.reserverID == props.userid || props.userInfo.admin && kmsFetched.end && kmsFetched.start
                    ?
                        !data.paid
                        ?
                            <div className='bg-gray-800 p-5 w-11/12 rounded-lg m-3 text-white flex flex-col items-center justify-center'>
                                <a className='text-3xl font-semibold text-primary-2'>{kmsFetched.end - kmsFetched.start}kms</a>
                                <div className='flex flex-row m-2'>
                                    <a className='text-green-500 text-2xl'>€</a>
                                    <a className='text-2xl'>{kmsFetched.price}</a>
                                </div>
                                {props.userInfo.admin
                                    ?
                                        <button onClick={markAsPaid} className='duration-200 text-black bg-white hover:bg-green-500 hover:text-white px-6 py-2 text-2xl rounded-lg '>Mark as paid</button>
                                    :
                                        <></>
                                }
                        
                            </div>
                        :
                            <div className='bg-gray-800 p-5 w-11/12 rounded-lg m-3 text-white flex flex-col items-center justify-center'>
                                <div className='flex flex-row m-2'>
                                    <a className='text-green-500 text-2xl'>fully paid!</a>
                                </div>
                            </div>
                    :
                        <></>
                }
                {canEdit && !kmsFetched.start && !kmsFetched.end || props.userInfo.admin
                ?
                    <button onClick={deleteItem} className='duration-200 m-2 bg-white hover:bg-red-500 hover:text-white px-6 py-2 text-2xl rounded-lg '  >Delete</button>
                :
                <button onClick={() => refreshData()} className='duration-200 bg-white hover:bg-primary-2 hover:text-white  px-6 py-2 text-2xl rounded-lg '  >Go Back</button>
                }
        </div>
    )
}

const getMonth = (month) => {
    switch (month) {
        case 'January':
            return 0
        case 'February':
            return 1
        case 'March':
            return 2
        case 'April':
            return 3
        case 'May':
            return 4
        case 'June':
            return 5
        case 'July':
            return 6
        case 'August':
            return 7
        case 'September':
            return 8
        case 'October':
            return 9
        case 'November':
            return 10
        case 'December':
            return 11
        default:
            return 
    }
}

export default FocusReservation