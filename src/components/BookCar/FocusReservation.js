import React, {useState, useEffect} from 'react'
import { db } from '../../backend/firebase'
import { getDoc, doc } from 'firebase/firestore'
import {GoLocation} from 'react-icons/go'
import {CgArrowsExchange} from 'react-icons/cg'
import {BiTime} from 'react-icons/bi'
import {GiPathDistance} from 'react-icons/gi'
import {AiFillEdit} from 'react-icons/ai'
import {RiSendPlane2Fill, RiCloseCircleLine} from 'react-icons/ri'
import {MdOutlineArrowBackIos} from 'react-icons/md'
import Input from '../Input'
import { writeKms, editTime} from '../../backend/utils'
import Clock from './Clock'
import { deleteBooking } from '../../backend/utils'
import { useNavigate, useLocation } from 'react-router-dom'
import {AiOutlineLoading} from 'react-icons/ai'



const mainCls = 'duration-200 overflow-auto pb-20 fixed bottom-0 w-screen h-full flex justify-enter items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'



const hours = ['12']
for(let i = 0; i < 24;i++){
    if(i == 11){
        hours.push('00')
        continue
    }
    hours.push(`${i + 1}`)
}


const FocusReservation = (props) => {
    const navigate = useNavigate()
    const location = useLocation()
    
    const reservationId = location.state.reservationData.id
    const reservedBy = location.state.reservationData.data.reservationId ? location.state.reservationData.data.reservationId :  location.state.reservationData.data.reserverID
    const data = location.state.reservationData.data
   
    
    const [kmsFetched, setKmsFetched] = useState({
        start: 'loading',
        end: false
    })
    const [fillKms, setFillKms] = useState({
        start: '',
        end: ''
    })
    
    const canEdit = (props.userid == reservedBy)
    const [editting, setEditing] = useState({
        kmsStart: false,
        kmsEnd: false,
        timeStart: false,
        timeEnd: false,
    })
     
    const [time, setTime] = useState({
        startHour: data.startHour,
        startMinute: data.startMinute,
        endHour: data.endHour,
        endMinute: data.endMinute,
    })
    const [value, setvalue] = useState()



    const [selectingHour, setSelectingHour] = useState(true)
    const [am, setIsAm] = useState(true)
    const [startSelect, setStartSelect] = useState(false)
    const [endSelect, setEndSelect] = useState(false)

            
    const getkms = async (id) => {
        const docRef = doc(db, "kms", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setKmsFetched(docSnap.data())
        } else {
            setKmsFetched({end:false, start:false})
        }
    }
    useEffect(() => {
        getkms(reservationId)
    }, [])

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
            }else {
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
        props.getData()
        await deleteBooking(reservationId)
        navigate(location.state.onReturn)
        
    }


    
    if(kmsFetched.start == 'loading') {
        return (
            <div className={mainCls}>
                <div className=' absolute top-0 w-screen bg-gray-800 flex justify-enter items-center  pb-4 flex-col'>
                    <a className='text-2xl text-white mt-5'>{data.driver}</a>
                </div>
                <div>
                    <AiOutlineLoading className='animate-spin'/>
                </div>
            </div>
        )
    }

    

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


    return(
        <div className={mainCls} >
            <button onClick={refreshData} className='absolute flex items-center justify-center top-1 left-3 w-12 h-12 mt-2 text-white '><MdOutlineArrowBackIos size={20}/> </button>
                <div className='w-screen '>
                    <div className='w-screen bg-gray-800   flex justify-enter items-center  pb-4 flex-col'>
                        <a className='text-2xl text-white mt-5'>{data.driver}</a>
                        <a className='text-sm text-white mt-5'>reserved by: {data.reserverName}</a>
                    </div>
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
                                    {canEdit
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
                                    {canEdit
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
                {canEdit && !kmsFetched.start && !kmsFetched.end
                ?
                    <button onClick={deleteItem} className='duration-200 bg-white hover:bg-red-500 hover:text-white hover:scale-125 px-6 py-2 text-2xl rounded-lg '  >Delete</button>
                :
                    <></>
                }
                {kmsFetched.start && kmsFetched.end
                ?
                <button onClick={() => navigate(location.state.onReturn)} className='duration-200 bg-white hover:bg-green-500 hover:text-white hover:scale-125 px-6 py-2 text-2xl rounded-lg '  >Go Back</button>
                :
                <></>
                }
        </div>
    )
}

export default FocusReservation