import React, {useState} from 'react'
import Input from './Input'
import { Link, Navigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../backend/firebase';
import { signIn } from '../../backend/utils';
import ywamPicture from '../pictures/ywam_bb.png'

const Authentication = (props) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    const handleInput = (name, value) => {
        setCredentials(prevState => ({
            ...prevState,
            [name]: value
        }))
        console.log(credentials)
    }

    const singIn = () => {
        signIn(credentials)
    }

    const inputCls = 'min-w-40 h-24  '
    return (
        <div className='w-screen h-screen flex items-center justify-center flex-col -translate-y-10 select-none'>
            <img alt='YWAM BB' className='h-28 -translate-x-2' src={ywamPicture}/>
            <a className='text-2xl mb-3 text-gray-900'>Car Pool</a>
            <Input label='email'    handleInput={handleInput}placeholder='email' className='inputCls' />
            <Input label='password' handleInput={handleInput}placeholder='password' className='inputCls' type='password' />
            <div className='flex flex-row gap-4'>
                <button className='text-white w-24 h-12 rounded-lg bg-primary-2 ' onClick={singIn}> Sign In </button>
                <div className=' text-white w-24 h-12 rounded-lg bg-primary-2 flex items-center justify-center '>
                    <Link  to='/authenticate-email'> Register </Link>
                </div>
            </div>
        </div>
    )
}

export default Authentication