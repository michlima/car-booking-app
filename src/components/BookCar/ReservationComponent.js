import React from 'react'
import {FaCarAlt} from 'react-icons/fa'
import {GoLocation} from 'react-icons/go'
import { Link } from 'react-router-dom'

const ReservationComponent = (props) => {
    const schedule = props.schedule
    const data = props.data
    let cls

    if(schedule.month == data.month && schedule.day == data.day && schedule.year == data.year){
        switch (schedule.car) {
            case 'Blue Van':
                cls = 'flex flex-col bg-blue-500 m-4 text-white rounded-lg w-10/12 shadow-lg'
                break;
            case 'Truck':
                cls = 'relative flex flex-col bg-white m-4 rounded-lg text-black w-10/12 shadow-lg'
                break;
            default:
                cls = 'relative flex flex-col bg-gray-400 m-4 text-white rounded-lg w-10/12 shadow-lg'
    
        }
    
    return(
        <Link to='/focus-reservation' state={{ reservationData: props.object, userInfo: props.userInfo}} className={cls}>
            <div className='bg-gray-800 w-full flex flex-col text-1xl rounded-t-lg p-2 items-center text-white'>
                <a className='mr-2 text-1xl font-bold'>{schedule.driver}</a>
                {/* <a className='mr-2 text-sm font-bold'>driver: {schedule.driver}</a> */}
                {`${schedule.startHour}:${schedule.startMinute} - ${schedule.endHour}:${schedule.endMinute}`}
            </div> 
            <p className=' mx-2 mt-1 flex items-center font-semibold'><GoLocation className='m-2'/>{schedule.destination}</p>
            <p className=' mx-2 my-1 flex items-center font-semibold '><FaCarAlt className='m-2'/>{schedule.car}</p>
        </Link> 
    )
    }
        
}

export default ReservationComponent