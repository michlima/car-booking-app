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
    const [month, setMonth]    = useState(new Date().getMonth())
    const [date, setDate]       = useState({
        day: new Date().getDay(),
        month: getMonth(month),
        year: new Date().getFullYear(),
    })

    const [selectedDate, setSelectedDate] = useState({
        day: -1,
        month: -1,
        year: -1,
    })

    useEffect(() => {
            let days = new Date(date.year, (month + 1), 0).getDate();
            let dayOW = new Date(date.year,month,0).getDay()
            setDays(makeDays(days, dayOW))
    },[month])
    

    const changeMonth = (increment) => {
        let newMonth = month
        if(increment){
            newMonth = newMonth + 1
            if(newMonth > 11){
                newMonth = 0
                let newYear = date.year + 1 
                setDate(prevState => ({
                    ...prevState,
                    year: newYear
                }));
            }
        }
        else {
            newMonth = newMonth -1
            if(newMonth < 0){
                newMonth = 11
                let newYear = date.year - 1 
                setDate(prevState => ({
                    ...prevState,
                    year: newYear
                }));
            }
        }

        let name = getMonth(newMonth)
        setDate(prevState => ({
            ...prevState,
            month: name
        }));


        setMonth(newMonth)
    }

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
    }



    let i = 0

    return (
        <div className=' text-white flex flex-col w-72  items-center h-72'>
            <div className='mb-2 w-full flex flex-row items-center'>
                <div className=' w-4/6 py-2 flex flex-row items-center justify-center rounded-lg bg-gray-800'>
                    <button  onClick={() => changeMonth(false)}>
                        <MdKeyboardArrowLeft/>
                    </button>
                    <div className='mx-max w-4/6'>
                        {date.month}
                    </div>
                    <button onClick={() => changeMonth(true)}>
                        <MdKeyboardArrowRight/>
                    </button>
                </div>
                <div className='ml-2 w-2/6 p-2 rounded-lg bg-gray-800'>
                    {date.year}
                </div> 
            </div>
            <div className='grid grid-cols-7 w-full h-96 rounded-lg bg-gray-800 p-2'>
                
                {weekDays.map((e) => {
                    return <div className='text-white p-1 '>{e}</div>
                })}
                {daysArray ? daysArray.map((e, index) => {
                    let cls = 'text-white p-1 rounded-full hover:bg-red-400'
                    if(i == 5 || i == 6){
                        if(i == 6)
                            i = -1
                        cls = 'text-gray-500 p-1 rounded-full hover:bg-red-400'
                    }
                    i+=1
                    if(e == ''){
                        return <div />
                    }
                    if(e == selectedDate.day && date.month == selectedDate.month && date.year == selectedDate.year) {
                        return <button className=' text-white p-1 rounded-full bg-red-400'>{e}</button> 
                    }
                    return <button onClick={() => selectDate(e)} className={cls}>{e}</button>
                })
                : 'loading..'
            }
            </div>
        </div>
    )
}

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