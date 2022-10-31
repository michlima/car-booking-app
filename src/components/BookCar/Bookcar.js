import React, { useRef, useState } from 'react'
import Calendar from './Calendar'
import Form from './Form'
import Clock from './Clock'
import {FaCheck} from 'react-icons/fa'

const Bookcar = (props) => {
    const [data, setData] = useState({
        userId: props.userId, 
        driver: '',
        day: '--',
        month: '------',
        year: '2022',
        startHour: '--',
        startMinute: '--',
        endMinute: '--',
        endMinute: '--',
        reason: '???',
        destination: '',
        car: ''
    })
   

    const changeData = (value) => {
        value.map((e) => {
            setData(prevState => ({
                ...prevState,
                [e.name]: e.value
            }))
        })
    }




    return(
        <div className='bg-black'>
            <div className='flex items-center bg-white rounded-tr-[2rem] flex-col w-screen p-2'>
                <div className='flex flex-row justify-center w-screen'>
                    <Calendar setDate={(value) => changeData(value)}/>
                    <Clock setDate={(value) => changeData(value)}/>
                </div>
                <Form setData={(value) => changeData(value)}/>
                <p className='text-2xl'>
                    {data.startHour}:{data.startMinute} - {data.endHour}:{data.endMinute} {data.month} {data.day} {data.year}
                </p>
                <button onClick={() => props.bookTimeF(data)} className='duration-200 w-16 h-16  bg-primary-2 mb-10 flex items-center hover:text-3xl hover:w-12 hover:h-12 hover:text-white justify-center rounded-full'>
                    <FaCheck/>
                </button>
            </div>
        </div>
    )
}

export default Bookcar