import React, { useEffect, useState } from 'react'
import { getDoc, doc, increment } from 'firebase/firestore'
import { db } from '../../backend/firebase'
import { Link } from 'react-router-dom'
import {GiSteeringWheel} from 'react-icons/gi'
import {BiUser} from 'react-icons/bi'
import { costPerKM } from '../../backend/utils'

const ViewCost = (props) => {
    let [cls, setCls] = useState()
    const [kmsFetched, setKmsFetched] = useState({
        end:'loading', 
        start:false
    })

    useEffect(() => {
        getKms()
    },[])

    

    useEffect(() => {
        switch (props.reservation.data.car) {
            case 'Truck':
                setCls('relative flex flex-row w-full items-center justify-center h-full bg-white rounded-full bg-white')
                break;
            case 'Blue Van':
                setCls('relative flex flex-row w-full items-center justify-center h-full bg-white rounded-full bg-blue-500')
                break;
            case 'SOH':
                setCls('relative flex flex-row w-full items-center justify-center h-full bg-white rounded-full bg-gray-400')
                break;
            default:
                break;
        }
    })
   
    const getKms = async () => {
            const docRef = doc(db, "kms", props.reservation.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setKmsFetched(docSnap.data())
            } else {
                setKmsFetched({end:false, start:false})
            }
        
    }

    if(kmsFetched.end == 'loading'){
        return(
            <div className='flex flex-col px-1 w-screen items-center justify-center rounded-l-full m-3'>
                <div className='relative flex flex-row w-full items-center justify-center h-full bg-white rounded-full'>
                        <div className='flex flex-col items-center justify-center text-1xl w-16 h-16 p-4 bg-white shadow-lg rounded-full'>
                            <a className='animate-pulse bg-gray-200 w-12 h-4 rounded-full  text-2xl m-1'></a>
                            <a className='animate-pulse bg-gray-200 w-8 h-4 rounded-full  text-2xl'></a>
                        </div>
                    <div className='flex flex-col w-full items-center justify-center'>
                        <a className='animate-pulse bg-gray-200 w-40 h-4 rounded-full  text-2xl m-1'></a>
                        <a className='animate-pulse bg-gray-200 w-24 h-4 rounded-full  text-2xl m-1'></a>
                    </div>
                    <div className='absolute  bg-white right-0 flex flex-row items-center justify-center shadow-lg rounded-full w-16 h-16'>
                        <a className='animate-pulse bg-gray-200 w-12 h-4 rounded-full  text-2xl m-1'></a>

                    </div>
                </div>
                <div className='flex bg-gray-800 py-3 flex-col items-center justify-center rounded-b-full text-white w-10/12'>
                    <a className='animate-pulse bg-gray-200 w-36 h-4 rounded-full  text-2xl m-1'></a>
                    <a className='animate-pulse bg-gray-200 w-36 h-4 rounded-full  text-2xl m-1'></a>
                </div>
            </div>
        )
    }

    return (
        <Link to='/focus-reservation' state={{ reservationData: props.reservation, userInfo: props.userInfo, onReturn:props.onReturn}} className='flex flex-col px-1 w-screen items-center justify-center rounded-l-full m-3'>
            <div className={cls}>
                {kmsFetched.start && kmsFetched.end
                ?
                    <>
                        <div className='absolute left-0 flex flex-col items-center justify-center text-1xl w-16 h-16 p-4 bg-white shadow-lg rounded-full'>
                            <a className='text-2xl'>{kmsFetched.end - kmsFetched.start}</a>
                            <a className='text-xs'>km</a>
                        </div>

                        <div className='flex flex-col  w-full h-16 pr-16 pl-16 items-center justify-center'>
                            <a className='font-semibold text-center'>Harfe - {props.schedule.destination}</a>
                            <a className='italic '>{props.schedule.day} {props.schedule.month} {props.schedule.year}</a>
                        </div>
                        <div className='absolute  bg-white right-0 flex flex-row items-center justify-center shadow-lg rounded-full w-16 h-16'>
                            <a className='text-green-500 text-2xl'>€</a>
                            <a className='text-[1.2rem]'>{kmsFetched.price}</a>
                        </div>
                    </>
                :
                    <>
                        <div className='absolute left-0 text-[1.2rem] flex flex-col items-center justify-center text-1xl w-16 h-16 p-4 bg-primary-2 shadow-lg rounded-full'>
                            ?
                        </div>
                        <div className='flex flex-col  w-full h-16 pr-16 pl-16 items-center justify-center'>
                            <a className='font-semibold'>Harfe - {props.schedule.destination}</a>
                            <a className='italic '>{props.schedule.day} {props.schedule.month} {props.schedule.year}</a>
                        </div>
                        <div className='absolute  bg-white right-0 flex flex-row items-center justify-center shadow-lg rounded-full w-16 h-16'>
                        <a className=' flex items-center justify-center rounded-full bg-primary-2 text-[1.2rem] w-16 h-16'>?</a>
                        </div>
                    </>
                }
            </div>
            <div className='flex bg-gray-800 py-3 flex-col items-center justify-center rounded-b-full text-white w-10/12'>
                <a className='flex flex-row items-center justify-center gap-3'><GiSteeringWheel size={25} className='text-primary-2'/>{props.schedule.driver}</a>
                <a className='flex flex-row items-center justify-center gap-3'><BiUser          size={25} className='text-primary-2'/>{props.schedule.reserverName}</a>
            </div>
            {kmsFetched.start && kmsFetched.end
            ?
                <></>
            :
                <a className=' italic text-primary-2 bg-white px-4 rounded-full'>Please fill in the kilometers</a>
            }      
        </Link>
    )
}

export default ViewCost