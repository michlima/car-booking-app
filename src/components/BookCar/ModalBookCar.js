import React,{useState, useEffect} from 'react'
import {CgArrowsExchange} from 'react-icons/cg'
import {MdOutlineArrowBackIos} from 'react-icons/md'



import Input from '../Input'
const hours = ['12']
const minutes = []
for(let i = 0; i < 24;i++){
    if(i == 11){
        hours.push('00')
        continue
    }
    hours.push(`${i + 1}`)
}
for(let i = 0; i < 12;i++){
    minutes.push(i)
}


const modalOpen = 'duration-200 overflow-auto pb-20 fixed bottom-0 w-screen h-full flex justify-enter items-center flex-col bg-opacity-75 backdrop-blur-lg bg-slate-300 select-none'
const modalClosed = 'duration-200 w-0 h-0 fixed bottom-0'

const ModalBookCar = (props) => {
    let modalCls = props.isShowing ? modalOpen : modalClosed
    const [startSelect, setStartSelect] = useState(false)
    const [startMinute, setStartMinute] = useState(false)
    const [errorMessage, setErrorMessage] = useState([])
    const [am, setIsAm] = useState(true)
    const [endSelect, setEndSelect] = useState(false)
    const [endMinute, setEndMinute] = useState(false)
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
            }else {
                let i = +hour + 12
                value = hours[+hour + 12]
            }
        }
        setTime(prevState => ({
            ...prevState,
            [name] : value
        }))
        props.handleInput(name,value)
        
        if(name == 'startHour'){
            setStartMinute(true)
        } else {
            setStartSelect(false)
            setStartMinute(false)
        }
    }

    const closeModal = (position) => {
        props.clearData()
        props.closeModal()
        setTime({
            startHour: '00',
            startMinute: '00',
            endHour: '00',
            endMinute: '00',
        })
        setStartSelect(false)
        setStartMinute(false)
        setEndSelect(false)
        setEndMinute(false)
        setErrorMessage([])

    }
    
    const handleClockEnd = (name,hour) => {
        let value = hour
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

        if(name == 'endHour'){
            setEndMinute(true)
        } else {
            setEndSelect(false)
            setEndMinute(false)
        }
    }

    const isValidData = () => {
        let valid = true
        let errors = []
        if(!props.data.driver){
            errors.push('please insert the drivers name')
            valid = false
        }
        if(!props.data.destination){
            errors.push('please insert the destination')
            valid = false
        }
        if(!props.data.car){
            errors.push('please select the car you want to use')
            valid = false
        }
        if(!props.data.reason){
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
            props.clearData()
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
                            if(e == props.data.car){
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
                                    setStartMinute(false)
                                }
                                
                            }} className={startSelect ? 'duration-200 text-3xl text-primary-2' : 'duration-200 text-3xl '}>
                                {time.startHour} : {time.startMinute}
                            </button>
                            
                            <CgArrowsExchange className='text-white mx-10' size={40}/>

                            <button onClick={() => {
                                if(endSelect){
                                    setEndSelect(false)
                                }else{
                                    setEndSelect(true)
                                    setStartSelect(false)
                                    setEndMinute(false)
                                }
                                }} 
                                className={endSelect ? 'duration-200 text-3xl text-primary-2' : 'duration-200 text-3xl '}>
                                {time.endHour} : {time.endMinute}
                            </button>
                        </div>
                        {
                        startSelect
                        ?
                        startMinute
                        ?
                            <div className=' relative flex text-lg w-48 h-48 items-center justify-center text-primary-2 rounded-full bg-white'>
                                <button onClick={() => handleClockStart('startMinute',`00`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute left-50% top-1 '>00</button>
                                <button onClick={() => handleClockStart('startMinute',`05`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[15px] right-[42px]'>05</button>
                                <button onClick={() => handleClockStart('startMinute',`10`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[44px] right-[11px]'>10</button>
                                <button onClick={() => handleClockStart('startMinute',`15`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute top-50% right-1'>15</button>
                                <button onClick={() => handleClockStart('startMinute',`20`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[44px] right-[11px]'>20</button>
                                <button onClick={() => handleClockStart('startMinute',`25`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[15px] right-[42px]'>25</button>
                                <button onClick={() => handleClockStart('startMinute',`30`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute bottom-1 right-50%'>30</button>
                                <button onClick={() => handleClockStart('startMinute',`35`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[15px] left-[42px]'>35</button>
                                <button onClick={() => handleClockStart('startMinute',`40`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[44px] left-[11px]'>40</button>
                                <button onClick={() => handleClockStart('startMinute',`45`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute top-50% left-1'>45</button>
                                <button onClick={() => handleClockStart('startMinute',`50`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[44px] left-[11px]'>50</button>
                                <button onClick={() => handleClockStart('startMinute',`55`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[15px] left-[42px]'>55</button>
                            
                        </div>
                        :
                            <div className='text-black relative flex text-lg w-48 h-48 items-center justify-center text-primary-2 rounded-full bg-white'>
                                <button onClick={() => handleClockStart('startHour',`12`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-2xl left-50% top-1 '>           {am ? hours[0] : hours[12]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`1`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           top-[15px] right-[42px]'>   {am ? hours[1] : hours[13]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`2`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           top-[44px] right-[11px]'>   {am ? hours[2] : hours[14]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`3`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  top-50% right-1'>          {am ? hours[3] : hours[15]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`4`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[44px] right-[11px]'>{am ? hours[4] : hours[16]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`5`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[15px] right-[42px]'>{am ? hours[5] : hours[17]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`6`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  bottom-1 right-50%'>       {am ? hours[6] : hours[18]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`7`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[15px] left-[42px]'> {am ? hours[7] : hours[19]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`8`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[44px] left-[11px]'> {am ? hours[8] : hours[20]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`9`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  top-50% left-1'>           {am ? hours[9] : hours[21]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`10`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute          top-[44px] left-[11px]'>    {am ? hours[10] : hours[22]}</button>
                                <button onClick={() =>  handleClockStart('startHour',`11`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute          top-[15px] left-[42px]'>    {am ? hours[11] : hours[23]}</button>
                                <button onClick={() => setIsAm(!am)} className={am ? 'duration-200 absolute bg-white shadow-lg w-12 rounded-lg' : 'duration-200 absolute bg-gray-800 shadow-lg w-12 rounded-lg'}>{am ? 'am' : 'pm'}</button>
                            </div>
                        :
                            <></>
                        }
                        {endSelect
                        ?
                            endMinute
                        ?
                            <div className='relative flex text-lg w-48 h-48 items-center justify-center text-primary-2 rounded-full bg-white'>
                                    <button onClick={() => handleClockEnd('endMinute',`00`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute left-50% top-1 '>00</button>
                                    <button onClick={() => handleClockEnd('endMinute',`05`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[15px] right-[42px]'>05</button>
                                    <button onClick={() => handleClockEnd('endMinute',`10`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[44px] right-[11px]'>10</button>
                                    <button onClick={() => handleClockEnd('endMinute',`15`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute top-50% right-1'>15</button>
                                    <button onClick={() => handleClockEnd('endMinute',`20`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[44px] right-[11px]'>20</button>
                                    <button onClick={() => handleClockEnd('endMinute',`25`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[15px] right-[42px]'>25</button>
                                    <button onClick={() => handleClockEnd('endMinute',`30`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute bottom-1 right-50%'>30</button>
                                    <button onClick={() => handleClockEnd('endMinute',`35`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[15px] left-[42px]'>35</button>
                                    <button onClick={() => handleClockEnd('endMinute',`40`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm bottom-[44px] left-[11px]'>40</button>
                                    <button onClick={() => handleClockEnd('endMinute',`45`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute top-50% left-1'>45</button>
                                    <button onClick={() => handleClockEnd('endMinute',`50`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[44px] left-[11px]'>50</button>
                                    <button onClick={() => handleClockEnd('endMinute',`55`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-sm top-[15px] left-[42px]'>55</button>
                                
                            </div>
                        :
                            <div className='relative flex text-lg w-48 h-48 items-center justify-center text-primary-2 rounded-full bg-white'>
                                    <button onClick={() => handleClockEnd('endHour',`12`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute text-2xl left-50% top-1 '>           {am ? hours[0] : hours[12]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`1`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           top-[15px] right-[42px]'>   {am ? hours[1] : hours[13]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`2`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           top-[44px] right-[11px]'>   {am ? hours[2] : hours[14]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`3`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  top-50% right-1'>          {am ? hours[3] : hours[15]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`4`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[44px] right-[11px]'>{am ? hours[4] : hours[16]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`5`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[15px] right-[42px]'>{am ? hours[5] : hours[17]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`6`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  bottom-1 right-50%'>       {am ? hours[6] : hours[18]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`7`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[15px] left-[42px]'> {am ? hours[7] : hours[19]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`8`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute           bottom-[44px] left-[11px]'> {am ? hours[8] : hours[20]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`9`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute  text-2xl  top-50% left-1'>           {am ? hours[9] : hours[21]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`10`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute          top-[44px] left-[11px]'>    {am ? hours[10] : hours[22]}</button>
                                    <button onClick={() =>  handleClockEnd('endHour',`11`)} className='duration-200 hover:bg-gray-800 w-8 rounded-full absolute          top-[15px] left-[42px]'>    {am ? hours[11] : hours[23]}</button>
                                    <button onClick={() => setIsAm(!am)} className={am ? 'duration-200 absolute bg-white shadow-lg w-12 rounded-lg' : 'duration-200 absolute bg-gray-800 shadow-lg w-12 rounded-lg'}>{am ? 'am' : 'pm'}</button>
                                
                            </div>
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