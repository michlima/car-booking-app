import React, { useRef, useState } from 'react'
import Calendar from './Calendar'
import ModalBookCar from './ModalBookCar'
import FocusReservation from './FocusReservation'
import { Link } from 'react-router-dom'
import ReservationComponent from './ReservationComponent'
import { AiFillPropertySafety } from 'react-icons/ai'

const cars = [
    'Blue Van',
    'SOH',
    'Truck'
]

//returns next 12 months after current month
const getMonths = () => {
    let month = new Date().getMonth()
    let year = new Date().getFullYear()
    let nextMonths = []
    for(let i = 0; i < 12; i++){
        nextMonths.push({month: month, year: year})
        if(month < 11){
            month+=1
        } else{
            month = 0
            year +=1
        }
    }
    return nextMonths
}
const Bookcar = (props) => {
    const [months, setState] = useState(getMonths())
    const [showForm, setBookForm] = useState(false)
    const [errorMessages, setErrorMessages] = useState('')
    const [form, setFormData] = useState({
        id: props.userid, 
        driver: null,
        day: window.localStorage.getItem('day'),
        month: window.localStorage.getItem('month'),
        year: window.localStorage.getItem('year'),
        startHour: '00',
        startMinute: '00',
        endHour: '00',
        endMinute: '00',
        reason: null,
        destination: null,
        car: null
    })

    const changeFormData = (value) => {
        setErrorMessages('')
        value.map((e) => {
            setFormData(prevState => ({
                ...prevState,
                [e.name]: e.value
            }))
        })
        console.log(form)
    }

    const handleInput = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const openBookCarModal = () => {
        if(form.day != null){
            setBookForm(true)
        } else {
            setErrorMessages('*please choose date of booking first*')
        }
    }

    //call to backend
    const bookTime = () => { 
        props.bookTimeF(form)
    }


    const clearForm = () => {
        setFormData ( prevState => ({
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
            <p className='text-red-600'>{errorMessages}</p>
            <div className='flex items-center w-screen bg-white snap-x scroll-smooth p-2 gap-5 overflow-auto scrollbar snap-mandatory'>
                {months.map((e,index) => {
                    return(
                        <div className=' snap-center'>
                            <Calendar month={e.month} year={e.year} setDate={(value) => changeFormData(value)}/>
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
                                object={object}
                                userid={props.userid}
                                data={form}/>
                        )
                    })}
                    
                </div>
                :
                <div/>
            }
            <button onClick={() => openBookCarModal()} className='text-white fixed right-10 bottom-10 p-3 shadow-lg bg-primary-2 rounded-full'>
                <a>Book Car</a>
            </button>
            <ModalBookCar
                isShowing={showForm}
                closeModal={() => setBookForm(false)}
                handleInput={(name, value) => handleInput(name, value)}
                chooseCar={(car) => handleInput('car', car)}
                cars={cars}
                formData={form}
                bookTime={bookTime}
                clearForm={clearForm}
                />
            {/* <ModalDeleteItem/> */}
        </div>
    )
}

export default Bookcar