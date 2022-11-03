import React, {useState} from 'react'
import Input from '../Input';
import { Link, Navigate } from 'react-router-dom'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../backend/firebase';
import { signIn } from '../../backend/utils';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {FcGoogle} from 'react-icons/fc'

import ywamPicture from '../pictures/ywam_bb.png'

const providerGoogle = new GoogleAuthProvider();

const Authentication = (props) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    })

    const signInWithGmail =() => {
        signInWithPopup(auth, providerGoogle)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
    }
  

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

    return (
        <div className='w-screen h-screen flex items-center justify-center flex-col -translate-y-10 select-none'>
            <img alt='YWAM BB' className='h-28 -translate-x-2' src={ywamPicture}/>
            <a className='text-2xl mb-3 text-gray-900'>Car Pool</a>
            <Input label='email'    handleInput={handleInput} placeholder='email'  />
            <Input label='password' handleInput={handleInput} placeholder='password' type='password' />
            <div className='flex flex-row gap-4'>
                <button className='text-white w-24 h-12 rounded-lg bg-primary-2 ' onClick={singIn}> Sign In </button>
                <div className=' text-white w-24 h-12 rounded-lg bg-primary-2 flex items-center justify-center '>
                    <Link  to='/authenticate-email'> Register </Link>
                </div>
            </div>
            <a className='my-5'>OR</a>
            <button onClick={signInWithGmail}><FcGoogle className='text-green-600 my-5' size={50}/></button>
        </div>
    )
}

export default Authentication