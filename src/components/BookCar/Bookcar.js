import React, { useRef, useState } from 'react'
import Calendar from './Calendar'
import {FaCarAlt, FaCheck} from 'react-icons/fa'
import {GoLocation} from 'react-icons/go'
import {IoIosAdd} from 'react-icons/io'

const Bookcar = (props) => {
    const month = useRef(new Date().getMonth())
    const year = useRef(new Date().getFullYear())
    let nextMonths = []
    for(let i = 0; i < 12; i++){
        nextMonths.push({month: month.current, year: year.current})
        if(month.current < 11){
            month.current+=1
        } else{
            month.current = 0
            year.current +=1
        }
    }
    const [months, setMonths] = useState(nextMonths)
    const [modalShowing, setModalShowing] = useState(false)
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
        setModalShowing(true)
    }
    console.log(props.schedule)

    return(
        <div className='flex items-center bg-white flex-col w-screen p-2 pb-20'>
            <div className='flex items-center w-screen bg-white snap-x scroll-smooth p-2 gap-5 overflow-auto scrollbar snap-mandatory'>
                {months.map((e,index) => {
                    return(
                        <div className=' snap-center'>
                            <Calendar month={e.month} year={e.year} setDate={(value) => changeData(value)}/>
                        </div>
                    )
                })}
            </div>
            {props.schedule ? 
                <div className='grid grid-cols-2 gap-5 w-screen flex items-center justify-center mt-2'>
                    {props.schedule.map((object, index) => {
                        let schedule = object.data
                        console.log(schedule)
                        if(schedule.month == data.month && schedule.day == data.day){
                            return(
                                <button key={index} className=' flex flex-col bg-primary-2 m-4 text-white rounded-lg flex items-center'>
                                    <div className='bg-gray-800 w-full flex flex-col text-1xl rounded-t-lg p-2 '>
                                        <span className='mr-2 text-1xl font-bold'>{schedule.driver}</span>
                                        {`${schedule.startHour}:${schedule.startMinute} - ${schedule.endHour}:${schedule.endMinute}`}
                                    </div> 
                                    <p className=' m-2 flex items-center justify-center font-semibold'><GoLocation/>{schedule.destination}</p>
                                    <p className=' m-2 flex items-center justify-center font-semibold'><FaCarAlt/>{schedule.car}</p>
                                </button> 
                            )
                        }
                    })}
                    
                </div>
                :
                <div/>
            }
            <button className='fixed right-10 bottom-10 text-gray-800 bg-primary-2 rounded-full'>
                <IoIosAdd size={50}/>
            </button>
        </div>
    )
}

export default Bookcar