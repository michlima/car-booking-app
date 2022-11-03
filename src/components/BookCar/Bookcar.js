import React, { useRef, useState } from 'react'
import Calendar from './Calendar'
import {FaCarAlt} from 'react-icons/fa'
import {GoLocation} from 'react-icons/go'
import ModalBookCar from './ModalBookCar'
import FocusReservation from './FocusReservation'

const cars = [
    'Blue Van',
    'SOH',
    'Truck'
]
const Bookcar = (props) => {
    const [showModal, setShowModal] = useState(false)
    const [showReservation, setShowReservation] = useState(false)
    const [viewReservation, setViewReservation] = useState()
    const [errorMessage, setErrorMessage] = useState('')
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
    const [data, setData] = useState({
        id: props.userid, 
        driver: null,
        day: null,
        month: null,
        year: '2022',
        startHour: '00',
        startMinute: '00',
        endHour: '00',
        endMinute: '00',
        reason: null,
        destination: null,
        car: null
    })

    const changeData = (value) => {
        setErrorMessage('')
        value.map((e) => {
            setData(prevState => ({
                ...prevState,
                [e.name]: e.value
            }))
        })
    }

    const handleInput = (name, value) => {
        setData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const openModal = () => {
        if(data.day != null){
            setShowModal(true)
        } else {
            setErrorMessage('*please choose date of booking first*')
        }
    }

    const bookTime = () => { 
        props.bookTimeF(data)
    }

    const showReservationData = (object) => {
        setViewReservation(object)
        setShowReservation(true)
    }

    const clearData = () => {
        setData ( prevState => ({
            ... prevState,
            'driver': null,
            'startHour': '00',
            'startMinute': '00',
            'endHour': '00',
            'endMinute': '00',
            'reason': null,
            'destination': null,
            'car': null
        }))
    }


    
    return(
        <div className='flex items-center bg-white flex-col w-screen p-2 pb-20 pt-28'>
            <p className='text-red-600'>{errorMessage}</p>
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
                <div className='grid grid-cols-2 w-screen flex items-center justify-center mt-2'>
                    {props.schedule.map((object, index) => {
                        let schedule = object.data
                        if(schedule.month == data.month && schedule.day == data.day && schedule.year == data.year){
                                let cls
                                switch (schedule.car) {
                                    case 'Blue Van':
                                        cls = 'relative flex flex-col bg-blue-500 m-4 text-white rounded-lg shadow-lg'
                                        break;
                                    case 'Truck':
                                        cls = 'relative flex flex-col bg-white m-4 rounded-lg text-black shadow-lg'
                                        break;
                                    default:
                                        cls = 'relative flex flex-col bg-gray-400 m-4 text-white rounded-lg shadow-lg'

                                }
                            
                            return(
                                <button onClick={() => showReservationData(object)} key={index} className={cls}>
                                    <div className='bg-gray-800 w-full flex flex-col text-1xl rounded-t-lg p-2 items-center text-white'>
                                        <span className='mr-2 text-1xl font-bold'>{schedule.driver}</span>
                                        {`${schedule.startHour}:${schedule.startMinute} - ${schedule.endHour}:${schedule.endMinute}`}
                                    </div> 
                                    <p className=' mx-2 mt-1 flex items-center justify-center font-semibold'><GoLocation className='m-2'/>{schedule.destination}</p>
                                    <p className=' mx-2 my-1 flex items-center justify-center font-semibold '><FaCarAlt className='m-2'/>{schedule.car}</p>
                                </button> 
                            )
                        }
                    })}
                    
                </div>
                :
                <div/>
            }
            <button onClick={() => openModal()} className='text-white fixed right-10 bottom-10 p-3 shadow-lg bg-primary-2 rounded-full'>
                <a>Book Car</a>
            </button>
            <ModalBookCar
                isShowing={showModal}
                closeModal={() => setShowModal(false)}
                handleInput={(name, value) => handleInput(name, value)}
                chooseCar={(car) => handleInput('car', car)}
                cars={cars}
                data={data}
                setData={(value) => changeData(value)}
                bookTime={bookTime}
                clearData={clearData}
                />
            <FocusReservation
                isShowing={showReservation}
                closeModal={() => setShowReservation(false)}
                handleInput={(name, value) => handleInput(name, value)}
                chooseCar={(car) => handleInput('car', car)}
                cars={cars}
                car={data.car}
                setData={(value) => changeData(value)}
                bookTime={bookTime}
                reservation={viewReservation}
                />
            {/* <ModalDeleteItem/> */}
        </div>
    )
}

export default Bookcar