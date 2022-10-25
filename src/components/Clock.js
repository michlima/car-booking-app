import React, { useState } from 'react'

const Clock = (props)=> {
    const [hour, setHour] = useState('00')
    const [minute, setMinute] = useState('00')
    let hours = []
    let minutes = []
    for(let i =0; i < 12; i++){
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
        const newHour = [
            {name: 'hour', value:hour},
            {name: 'minute', value:minute}
        ]
        props.setDate(newHour)
    }
    const changeMinute = (minute) => {
        setMinute(minute)
        const newMinute = [
            {name: 'hour', value:hour},
            {name: 'minute', value:minute}
        ]
        props.setDate(newMinute)
    }

    return(
        <div>
            <div className=' ml-2 py-2 bg-gray-800 text-white flex flex-col overflow-auto scrollbar h-32 rounded-lg snap-mandatory '>
            {hours.map((e) => {
                    if(e == hour){
                        return <div className='duration-200 scale-125 bg-red-400 px-3 my-1 snap-center'>{e}</div>
                    }
                    return(
                        <button onClick={() => changeHour(e)} className='duration-200 hover:scale-125 hover:bg-red-400 px-3 my-1 snap-center'>{e}</button>
                    )
                })}
            </div>
            <div className='mt-2 ml-2 py-2 bg-gray-800 text-white flex flex-col overflow-auto scrollbar h-[9.5rem] rounded-lg snap-mandatory '>
            {minutes.map((e) => {
                 if(e == minute)
                    return <div className='duration-200 scale-125 bg-red-400 px-3 my-1 snap-center'>{e}</div>
                
                return(
                    <button onClick={() => changeMinute(e)} className='duration-200 hover:scale-125 hover:bg-red-400 px-3 my-1 snap-center'>{e}</button>
                )
            })}
        </div>
     </div>
    )
}

export default Clock