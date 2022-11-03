import React, {useState, useEffect} from 'react'
import { db } from '../../backend/firebase'
import { getDoc, doc } from 'firebase/firestore'
import {GoLocation} from 'react-icons/go'
import {CgArrowsExchange} from 'react-icons/cg'
import {BiTime, BiTimeFive} from 'react-icons/bi'
import {GiPathDistance} from 'react-icons/gi'
import {RiSendPlane2Fill} from 'react-icons/ri'
import Input from '../Input'
import { writeKms } from '../../backend/utils'

const modalOpen = 'duration-200 overflow-auto pb-20 fixed bottom-0 w-screen h-screen translate-y-10 flex justify-enter items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 rounded-t-[3rem] select-none'
const modalClosed = 'duration-200 w-0 h-0 fixed bottom-0 right-0'


const FocusReservation = (props) => {
    let modalCls = props.isShowing ? modalOpen : modalClosed
    const [scrollPosition, setScrollPosition] = useState(0);
    const [kmsFetched, setKmsFetched] = useState({
        start: false,
        end: false
    })
    const [fillKms, setFillKms] = useState({
        start: '',
        end: ''
    })

    const [fetched, setFetched] = useState()
    

    const slideModalOut = (position) => {
        if(0 > window.pageYOffset){
            props.closeModal()
        }
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
    useEffect(() => {
        if(props.reservation){
            getkms(props.reservation.id)
        }
        
    }, [props.reservation])

    const handleScroll = () => {
        slideModalOut(scrollPosition)
        const position = window.pageYOffset;
        setScrollPosition(position); 
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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
        writeKms(fillKms, props.reservation.id)

    } 
    



    return(
        <div className={modalCls} >
            <button className='absolute top-1 bg-white w-24 h-8 rounded-full mt-2 h-1 text-white '> </button>
            { modalCls == modalClosed ?
                <div/>
                :
                <div className='w-screen '>
                    <div className='w-screen bg-gray-800  rounded-t-[1rem] flex justify-enter items-center  pb-4 flex-col'>
                        <a className='text-2xl text-white mt-5'>{props.reservation.data.driver}</a>
                    </div>
                    <div className='bg-gray-800 w-11/12 rounded-lg m-3 text-white text-sm flex flex-row items-center justify-center'>
                        <div className='flex flex-col items-center justify-center'>
                            <a className='mx-1 mt-1 flex items-center justify-center font-semibold'><GoLocation className='m-2'/>Harfe</a>
                        </div>
                        <CgArrowsExchange className='text-white mx-5 ' size={40}/>
                        <div className='flex flex-col items-center justify-center'>
                            <a className=' mx-1 mt-1 flex items-center justify-center font-semibold'><GoLocation className='m-2'/>{props.reservation.data.destination ? props.reservation.data.destination :'??????'}</a>
                        </div>
                    </div>
                    <div className='bg-gray-800 p-5 w-11/12 rounded-lg m-3 text-white flex flex-col items-center justify-center'>
                        <a className='m-2 flex flex-col items-center'>
                            Reason:<span className=' font-bold'>{props.reservation.data.reason}</span>
                        </a>
                        <div className='flex flex-row items-center justify-center'>
                            <div className='flex flex-col items-center justify-center'>
                                <a className='mx-2 mt-1 text-3xl flex items-center justify-center font-semibold'>Start</a>
                                <a className=' mx-2 mt-1 flex items-center justify-center font-semibold'>{props.reservation.data.startHour}:{props.reservation.data.startMinute}</a>                            
                            </div>
                            <CgArrowsExchange className='text-white mx-10' size={40}/>
                            <div className='flex flex-col items-center justify-center'>
                                <a className=' mx-2 mt-1 text-3xl flex items-center justify-center font-semibold'>End</a>
                                <a className=' mx-2 mt-1 flex items-center justify-center font-semibold'>{props.reservation.data.endHour}:{props.reservation.data.endMinute}</a>
                            </div>
                        </div>
                        <BiTime size={40}/>
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
                        {kmsFetched.start 
                        ?
                            <></>
                        :
                            <div className='flex flex-row w-full items-center justify-center'>
                                <Input label='start' placeholder='start kms...'  handleInput={(name, value) => handleInput(name, value)}/>
                                <button  onClick={() => confirmKms('start', fillKms.start)}className='flex -translate-y-2 ml-2'><RiSendPlane2Fill size={30}/></button>
                            </div>
                        }
                        {kmsFetched.end 
                        ?
                            <></>
                        :
                            <div className='flex flex-row w-full items-center justify-center'>
                                <Input label='end' placeholder='end kms...'  handleInput={(name, value) => handleInput(name, value)}/>
                                <button onClick={() => confirmKms('end', fillKms.end)} className=' flex -translate-y-2 ml-2'><RiSendPlane2Fill size={30}/></button>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default FocusReservation