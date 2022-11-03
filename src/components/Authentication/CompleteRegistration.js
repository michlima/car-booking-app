import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Input from '../Input'
import { buttonCls } from '../classes'
import { auth } from '../../backend/firebase'
import { signOut} from "firebase/auth";
import { register } from '../../backend/utils'


const CompleteRegistration = () => {

    const email = useRef(window.localStorage.getItem('emailForSignIn'))
    const [userInfo, setUserInfo] = useState({
        password: null,
        firstName: null,
        lastName: null,
        age: null,
    })
    
    

    const handleInput = (name, value) => {
        
        
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }))
        
        console.log(userInfo)
        
    }

    const registerUser = () => {
        register(email.current, userInfo)

    }

    return (
        <div className='h-screen w-screen flex items-center justify-center flex-col -translate-y-10 select-none' >
            <p className='text-2xl m-5'>Complete Registration</p>
            <Input label='password' handleInput={handleInput} type='password' placeholder='password' />
            <Input label='firstName' handleInput={handleInput} placeholder='first name' />
            <Input label='lastName' handleInput={handleInput} placeholder='last name' />
            <Input label='age' handleInput={handleInput} placeholder='age' />
            
            <button className={buttonCls} onClick={registerUser}>Register</button>
            <Link  to='/'>Already have an account?</Link>
        </div>
    )
}

export default CompleteRegistration