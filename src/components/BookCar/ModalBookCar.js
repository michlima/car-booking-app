import React,{useState, useEffect} from 'react'
import {CgArrowsExchange} from 'react-icons/cg'
import {MdOutlineArrowBackIos} from 'react-icons/md'
import Clock from './Clock'



import Input from '../Input'

const hours = ['12']
for(let i = 0; i < 24;i++){
    if(i == 11){
        hours.push('00')
        continue
    }
    hours.push(`${i + 1}`)
}



const modalOpen = 'duration-200 overflow-auto pb-20 fixed bottom-0 w-screen h-full flex justify-enter items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'
const modalClosed = 'duration-200 w-0 h-0 fixed bottom-0'

const ModalBookCar = (props) => {
    let modalCls = props.isShowing ? modalOpen : modalClosed
    const [startSelect, setStartSelect] = useState(false)
    const [endSelect, setEndSelect] = useState(false)
    const [selectingHour, setSelectingHour] = useState(true)
    const [errorMessage, setErrorMessage] = useState([])
    const [am, setIsAm] = useState(true)
    const [time, setTime] = useState({
        startHour: '00',
        startMinute: '00',
        endHour: '00',
        endMinute: '00',
    })

    const handleClockStart = (name,hour) => {
        let value = hour

        if(!am && name == 'startHour'){
            if(value == 12){
                value = hours[hour]    
            } else {
                value = hours[+hour + 12]
            }
        }
        setTime(prevState => ({
            ...prevState,
            [name] : value
        }))
        props.handleInput(name,value)
        
        if(name == 'startHour'){
            setSelectingHour(false)
        } else {
            setStartSelect(false)
            setSelectingHour(true)
        }
    }

    const closeModal = (position) => {
        props.clearForm()
        props.closeModal()
        setTime({
            startHour: '00',
            startMinute: '00',
            endHour: '00',
            endMinute: '00',
        })
        setStartSelect(false)
        setSelectingHour(false)
        setEndSelect(false)
        setErrorMessage([])

    }
    
    const handleClockEnd = (name,hour) => {
        let value = hour
        if(name == 'endHour'){
            console.log('oops')
            setSelectingHour(false)
            if(Number(hour) < Number(time.startHour)){
                console.log('oops')
                value = Number(value) + 12
            }
        } else {
            setEndSelect(false)
            setSelectingHour(true)
        }
        console.log(value)
        
        if(!am && name == 'endHour'){
            if(value == 12){
                value = hours[hour]    
            }else {
                let i = +hour + 12
                value = hours[+hour + 12]
            }
        }

        props.handleInput(name,value)
        
        setTime(prevState => ({
            ...prevState,
            [name] : value
        }))
    }

    const isValidData = () => {
        let valid = true
        let errors = []
        if(!props.formData.driver){
            errors.push('please insert the drivers name')
            valid = false
        }
        if(!props.formData.destination){
            errors.push('please insert the destination')
            valid = false
        }
        if(!props.formData.car){
            errors.push('please select the car you want to use')
            valid = false
        }
        if(!props.formData.reason){
            errors.push('please insert reason for trip')
            valid = false
        }
        setErrorMessage(errors)
        return valid
    }

    const submitData = () => {
        let validation = isValidData()
        if(validation) {
            props.bookTime()
            props.closeModal()
            props.clearForm()
        }
        
    }

    const handleClock = (type, value) => {
        if(type == 'startHour'){
            handleClockStart('startHour', value)
        }
        if(type == 'startMinute'){
            handleClockStart('startMinute', value)
        }
        if(type == 'endHour'){
            handleClockEnd('endHour', value)
        }
        if(type == 'endMinute'){
            handleClockEnd('endMinute', value)
        }
    }


    return(
        <div className={modalCls}>
            <button onClick={closeModal} className='absolute flex items-center justify-center top-1 left-3 w-12 h-12 mt-2 text-white '><MdOutlineArrowBackIos size={20}/> </button>
            { modalCls == modalClosed ?
                <div/>
                :
                <>
                    <div className='w-screen bg-gray-800 flex justify-enter items-center  pb-4 flex-col'>
                        <p className='text-2xl text-white mt-5'>Book Car</p>
                    </div>
                    {errorMessage.map((errors) => {
                        return <a className='text-red-400'>{errors}</a>
                    })}
                    <div className='flex justify-center items-center w-screen p-4 flex-col'>
                        <div className='flex w-full justify-center flex-row translate-x-1'>
                            <Input class={'bookCar'} label='destination' placeholder='destination' handleInput={(name, value) => props.handleInput(name, value)}/>
                        </div>
                        <div className='flex w-full justify-center flex-row translate-x-1'>
                            <Input class={'bookCar'} label='driver' placeholder='driver'  handleInput={(name, value) => props.handleInput(name, value)}/>
                        </div>
                        <div className='flex w-full justify-center flex-row translate-x-1'>
                            <Input class={'bookCar'} label='reason' placeholder='reason for trip'  handleInput={(name, value) => props.handleInput(name, value)}/>
                        </div>                            
                    </div>  
                    <div className='flex w-screen'>
                        {props.cars.map((e) => {
                            if(e == props.formData.car){
                                return <button className='duration-200 rounded-lg bg-primary-2 w-full h-12 m-2' onClick={() => props.chooseCar(e)} >{e}</button>
                            }
                            return <button className='duration-200 bg-white rounded-lg w-full h-12 m-2' onClick={() => props.chooseCar(e)} >{e}</button>
                        })}
                    </div> 
                    <div className='flex flex-col text-white bg-gray-800 rounded-lg px-5 py-2 items-center'>
                        <div className='flex items-center' >
                            <button onClick={() => {
                                if(startSelect){
                                    setStartSelect(false)
                                } else {
                                    setStartSelect(true)
                                    setEndSelect(false)
                                    setSelectingHour(true)
                                }
                                
                            }} className={startSelect ? 'duration-200 text-3xl text-primary-2' : 'duration-200 text-3xl '}>
                                {time.startHour} : {time.startMinute}
                            </button>
                            
                            <CgArrowsExchange className='text-white mx-10' size={40}/>

                            <button onClick={() => {
                                console.log(endSelect)
                                if(endSelect){
                                    setEndSelect(false)
                                }else{
                                    setStartSelect(false)
                                    setEndSelect(true)
                                    setSelectingHour(true)
                                }
                                }} 
                                className={endSelect ? 'duration-200 text-3xl text-primary-2' : 'duration-200 text-3xl '}>
                                {time.endHour} : {time.endMinute}
                            </button>
                        </div>
                        {
                        startSelect
                        ?
                            <Clock hours={hours} hour={selectingHour} am={am}setIsAm={() => setIsAm(!am)} handleClock={selectingHour ? ( value) => handleClock('startHour', value) :( value) => handleClock('startMinute', value) }/>
                        :
                            <></>
                        }
                        {endSelect
                        ?                        
                            <Clock hours={hours}  hour={selectingHour} am={am} setIsAm={() => setIsAm(!am)} handleClock={selectingHour ? ( value) => handleClock('endHour', value) :( value) => handleClock('endMinute', value)}/>
                        :
                            <></>
                        }
                    </div>
                </>
            }
            <button onClick={submitData} className='bg-white shadow-lg  text-primary-2 p-3 rounded-lg mt-20'>Book Time</button>
        </div>
    )
} 

export default ModalBookCar