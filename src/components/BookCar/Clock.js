import React, { useState } from 'react'
import {FiArrowRightCircle, FiArrowLeftCircle} from 'react-icons/fi'
import {HiOutlineArrowNarrowRight, HiOutlineArrowNarrowLeft} from 'react-icons/hi'

const Clock = (props)=> {
    const [hour, setHour] = useState('00')
    const [minute, setMinute] = useState('00')
    const [start, setStart] = useState(true)
    let hours = []
    let minutes = []
    for(let i =0; i < 24; i++){
        if(i < 9 )
            hours.push('0' + (i + 1))
        else
            hours.push('' + (i + 1))
    }
    for(let i =0; i < 60; i+=5){
        if(i < 10 )
        minutes.push('0' + i)
        else
        minutes.push('' + i)
    }

    const changeHour = (hour) => {
        setHour(hour)
        let newHour
        if(start) { 
            newHour = [
                {name: 'startHour', value:hour},
                {name: 'startMinute', value: minute}
            ]
        } else {
            newHour = [
                {name: 'endHour', value: hour},
                {name: 'endMinute', value: minute}
            ]
        }
        props.setDate(newHour)
    }
    const changeMinute = (minute) => {
        setMinute(minute)
        let newMinute
        if(start) { 
            newMinute = [
                {name: 'startHour', value: hour},
                {name: 'startMinute', value: minute}
            ]
        } else {
            newMinute = [
                {name: 'endHour', value:hour},
                {name: 'endMinute', value:minute}
            ]
        }
        props.setDate(newMinute)
    }
    const changeDirections = () => {
        setStart(!start)
        setHour('00')
        setMinute('00')
    }

    return(
        <div className='flex items-center justify-center flex-col -translate-y-[1.5rem]'>
            {start ? 
            <p className='text-green-800 text-2xl'>
                <HiOutlineArrowNarrowRight/> 
            </p>
            : 
            <p className='text-green-800 text-2xl'>
                <HiOutlineArrowNarrowLeft/>
            </p>
            }
            <div className=' ml-2 py-2 bg-gray-800 text-white flex flex-col overflow-auto scrollbar h-32 rounded-lg snap-mandatory '>
            {hours.map((e, index) => {
                    if(e == hour){
                        return <div key={index} className='duration-200  bg-primary-2 px-3 my-1 snap-center'>{e}</div>
                    }
                    return(
                        <button key={index} onClick={() => changeHour(e)} className='duration-200  hover:bg-primary-2 px-3 my-1 snap-center'>{e}</button>
                    )
                })}
            </div>
            <div className='mt-2 ml-2 py-2 bg-gray-800 text-white flex flex-col overflow-auto scrollbar h-[9.5rem] rounded-lg snap-mandatory '>
            {minutes.map((e, index) => {
                 if(e == minute)
                    return <div key={index} className='duration-200  bg-primary-2 px-3 my-1 snap-center'>{e}</div>
                
                return(
                    <button key={index} onClick={() => changeMinute(e)} className='duration-200  hover:bg-primary-2 px-3 my-1 snap-center'>{e}</button>
                )
            })}
        </div>
        <button onClick={changeDirections} className='duration-200 ml-2 flex item-center justify-center bg-gray-800 text-blue-400 w-8 rounded-lg h-8 mt-2 p-1 '>{start ? <FiArrowRightCircle size={20}/>: <FiArrowLeftCircle size={20}/>}</button>
     </div>
    )
}

export default Clock