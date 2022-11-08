import React, { useEffect, useState } from 'react'
import {MdKeyboardArrowLeft, MdKeyboardArrowRight} from 'react-icons/md' 
const weekDays = [
    'M',
    'T',
    'W',
    'T',
    'F',
    'S',
    'S',
]

const Calendar = (props) => {
    const [daysArray, setDays]       = useState(false)
    const [date, setDate]       = useState({
        day: new Date().getDate(),
        month: getMonth(props.month),
        year: props.year,
    })
    const sd = window.localStorage.getItem('day')

    const [selectedDate, setSelectedDate] = useState({
        day: window.localStorage.getItem('day'),
        month: window.localStorage.getItem('month'),
        year: window.localStorage.getItem('year'),
    })

    useEffect(() => {
            let days = new Date(date.year, (props.month + 1), 0).getDate();
            let dayOW = new Date(date.year,props.month,0).getDay()
            setDays(makeDays(days, dayOW))
    },[])
    
    const selectDate = (day) => {
        setSelectedDate({
            day: day,
            month:date.month,
            year: date.year,
        })
        const newDate = [
            {name: 'day', value: day},
            {name: 'month', value: date.month},
            {name: 'year', value: date.year},]
        props.setDate(newDate)
        if(day && date.month && date.year){
            window.localStorage.setItem('day',day)
            window.localStorage.setItem('month',date.month)
            window.localStorage.setItem('year',date.year)
        }
    }


    let i = 0

    return (
        <div className=' text-black flex  flex-col w-screen px-5 items-center h-96 rounded-tr-[2rem]'>
            <div className='mb-2 w-full flex flex-col items-center'>
                <a className='flex justify-center text-2xl text-black mx-max w-4/6'>
                    {date.month}
                </a>
                <a className=''>
                    {date.year}
                </a> 
            </div>
            <div className='grid grid-cols-7 rounded-lg w-full shadow h-[16rem] p-2'>
                {weekDays.map((e,index) => {
                    return <div key={index} className=' p-1 flex items-center justify-center'>{e}</div>
                })}
                {daysArray ? daysArray.map((e, index) => {
                    let cls = ' p-1 border-b-2 border-white '
                    if(i == 5 || i == 6){
                        if(i == 6)
                            i = -1
                        cls = 'text-gray-500 p-1 border-b-2 border-white'
                    }
                    
                    i+=1
                    if(e == ''){
                        return <div key={index}/>
                    }
                    if(e == selectedDate.day && date.month == selectedDate.month && date.year == selectedDate.year) {
                        return <button  onClick={() => selectDate(e)} key={index} className=' p-1 border-b-2 border-primary-2'>{e}</button> 
                    }
                    return <button  onClick={() => selectDate(e)} className={cls}>{e}</button>
                })
                : 'loading..'
            }
            </div>
        </div>
    )
}

// Fabricates days to fit in calendar
const makeDays = (days, dayOW) => {{
    let daysArr = []
    for(let i = 0; i < dayOW; i++){
        daysArr.push('')
    }
    for(let i = 0; i < days; i++){
        daysArr.push('' + (i + 1))
    }
    return daysArr
}}


const getMonth = (month) => {
    switch (month) {
        case 0:
            return 'January'
        case 1:
            return 'February'
        case 2:
            return 'March'
        case 3:
            return 'April'
        case 4:
            return 'May'
        case 5:
            return 'June'
        case 6:
            return 'July'
        case 7:
            return 'August'
        case 8:
            return 'September'
        case 9:
            return 'October'
        case 10:
            return 'November'
        default:
            return 'December'
    }
}

export default Calendar