import React from 'react'
import { Link } from 'react-router-dom'
import {FaCarAlt} from 'react-icons/fa'
import {BsFillCalendar2DayFill} from 'react-icons/bs'



const Navigation = () => {
    let buttoncls = 'duration-200 mx-4 w-16 bg-gray-800 text-white h-16 rounded-full flex items-center justify-center'

    return(
        <div className='duration-200 w-full flex items-center justify-center h-40 bg-white rounded-b-lg'>
            <Link to='/' className={buttoncls} >
                <FaCarAlt size={40}/>
            </Link>
            <Link to='calendar' className={buttoncls}>
                <BsFillCalendar2DayFill size={40}/>
            </Link>
        </div>
    )
}

export default Navigation