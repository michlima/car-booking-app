import React from 'react'
import { Link } from 'react-router-dom'
import {FaCarAlt, FaSignOutAlt} from 'react-icons/fa'
import {BsFillCalendar2DayFill} from 'react-icons/bs'
import { auth } from '../backend/firebase'



const Navigation = (props) => {
    let buttoncls = ' border-b-4 border-primary-2 duration-200 translate-y-4 mx-4 w-16 bg-gray-800 text-white h-16 rounded-full flex items-center justify-center'

    const signOut = () => {
        auth.signOut()
    }
    

    return(
        <div className='fixed top-0 duration-200 w-full flex items-center justify-center h-12 mb-10 bg-gray-800'>
            <Link to='/' className={buttoncls} >
                <FaCarAlt size={30}/>
            </Link>
            <button className={buttoncls}   onClick={signOut}><FaSignOutAlt size={30}/></button>
        </div>
    )
}

export default Navigation