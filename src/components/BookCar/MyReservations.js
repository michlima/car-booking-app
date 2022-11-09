import React from 'react'
import ReservationComponent from './ReservationComponent'
import { useNavigate } from 'react-router-dom'
import {MdOutlineArrowBackIos} from 'react-icons/md'

const mainCls = 'duration-200 overflow-auto pb-20 fixed bottom-0 w-screen h-full flex justify-enter items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'
const MyReservations = (props) => {
    const navigate = useNavigate()
    

    const refreshData = () => {
        props.getData()
        navigate('/')
    }

    return(
        <div className={mainCls}>
            <div className='absolute top-0 bg-gray-800 w-screen h-20 flex items-center justify-center'>
                <a className='text-2xl text-white'>My Reservations</a>
                <button onClick={refreshData} className='absolute flex items-center justify-center top-1 left-3 w-12 h-12 mt-2 text-white '><MdOutlineArrowBackIos size={20}/> </button>
            </div>
            <div className='mt-10 w-screen h-full pt-16'>
                {props.myReservations.map((reservation) => {
                    return(
                        <ReservationComponent
                            schedule={reservation.data} 
                            object={reservation}
                            userid={props.userid}
                            userInfo={props.userInfo}
                            canView={true}
                            data={[]}
                            onReturn='/my-reservations'
                            />
                    )
                })}
            </div>
        </div>
    )
}

export default MyReservations