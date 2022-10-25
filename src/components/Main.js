import React, { useState } from 'react'
import Calendar from './Calendar'
import Form from './Form'
import Clock from './Clock'
const Main = () => {

    const [showCalendar, setShowCalendar]   = useState(false)
    const [date, setDate]                   = useState({
        day: '01',
        month: 'January',
        year: '2022',
        hour: '00',
        minute: '00',
    })
    const [test, setTest] = useState('true')
    const changeDate = (value) => {
        console.log(value)
        value.map((e) => {
            setDate(prevState => ({
                ...prevState,
                [e.name]: e.value
            }))
        })
       
        console.log(date)
    }

    let bookCarTextCls = showCalendar ? 
        'duration-200 w-0 h-0'
        :
        'duration-200 w-24 bg-emerald-500 h-12 hover:w-32 rounded-r-lg'


    return(
        <div className='flex flex-row'>
            <button className={bookCarTextCls} onClick={() => setShowCalendar(!showCalendar)}>{showCalendar ? '': 'Book a Car'}</button>
            {showCalendar ? 
                <div className='flex items-center flex-col'>
                    <button onClick={() => setShowCalendar(!showCalendar)}>x</button>
                    <div className='flex flex-row'>
                        <Calendar setDate={(value) => changeDate(value)}/>
                        <Clock setDate={(value) => changeDate(value)}/>
                    </div>
                    <Form setDate={() => changeDate()}/>
                    <p className='text-3xl'>
                {date.hour}:{date.minute} {date.month} {date.day} {date.year}</p>
                </div>
            : ''}
           
        </div>
    )
}

export default Main