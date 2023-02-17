import React, { useRef, useState } from 'react'
import ViewCost from './ViewCost'
import { useNavigate } from 'react-router-dom'
import {MdOutlineArrowBackIos, MdSearch} from 'react-icons/md'
import {AiOutlineLoading} from 'react-icons/ai'
import Input from '../Input'


const mainCls = 'duration-200 overflow-auto pb-20 absolute top-0 w-screen h-screen flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'

const MyReservations = (props) => {
    const max = useRef(0)
    const [driver, setDriver] = useState(window.localStorage.getItem('driver'))
    const navigate = useNavigate()
    if(!props.myReservations){
        return(
            <div className='w-screen h-screen flex items-center justify-center'><AiOutlineLoading className='animate-spin text-primary-2' size={40}/></div>
        )
    }
    

    const refreshData = () => {
        props.getData()
        navigate('/')
    }

    const incrementDebt = (debt) => {
        // setDebt( prev => prev + debt)
    }

    const handleInput = (e) => {
        setDriver(e.target.value)
        window.localStorage.setItem('driver',e.target.value)
    }

    return(
        <div className={mainCls}>
            <div className='absolute top-0 bg-gray-800 w-screen h-20 flex items-center justify-center'>
                <a className='text-2xl text-white'>My Reservations</a>
                <button onClick={refreshData} className='absolute flex items-center justify-center top-1 left-3 w-12 h-12 mt-2 text-white '><MdOutlineArrowBackIos size={20}/> </button>
            </div>
            <div className='flex w-screen items-center justify-center'>
                <div className='relative mt-28 flex flex-row  bg-white rounded-full items-center w-8/12'>
                    <input className=' px-4 w-full h-12 rounded-full bg-white text-gray-600' value={driver} placeholder='search...' onChange={(e) => handleInput(e)}/>
                </div>
            </div>
            <div className=' w-screen pt-16 flex justify-center items-center flex-col'>
                {
                    props.myReservations.map((reservation) => {
                        if(reservation.data.driver.toUpperCase().includes(driver.toUpperCase()) || reservation.data.reserverName.toUpperCase().includes(driver.toUpperCase())){
                            return(
                                <ViewCost
                                schedule={reservation.data} 
                                reservation={reservation}
                                userid={props.userid}
                                userInfo={props.userInfo}
                                canView={true}
                                data={[]}
                                incrementDebt={(debt) => incrementDebt(debt)}
                                onReturn='/my-reservations'
                                />
                            )
                        }
                    })
                }
                
            </div>
        </div>
    )
}

export default MyReservations