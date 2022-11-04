import React, { useRef, useState } from 'react'
import Calendar from './Calendar'
import ModalBookCar from './ModalBookCar'
import FocusReservation from './FocusReservation'
import ReservationComponent from './ReservationComponent'

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
                        return(
                            <ReservationComponent 
                                schedule={object.data} 
                                data={data}
                                showReservation={() => setShowReservation(true)}/>
                        )
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