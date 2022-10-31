import React, { useState } from 'react' 
import { Link, useNavigate } from 'react-router-dom'
import Input from './Input'
import { buttonCls } from '../classes'
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from '../../backend/firebase';


const EmailAthentication = () => {
    const navigate = useNavigate()
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

    const actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be in the authorized domains list in the Firebase Console.
        url: 'https://bb-carpool.web.app',
        // This must be true.
        handleCodeInApp: true,
    }

    const registerUser = () => {
        sendSignInLinkToEmail(auth, credentials.email, actionCodeSettings)
        .then(() => {
            // The link was successfully sent. Inform the user.
            // Save the email locally so you don't need to ask the user for it again
            // if they open the link on the same device.
            window.localStorage.setItem('emailForSignIn', credentials.email);
            console.log('email sent')
            navigate('/email-sent-confirmation')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center flex-col -translate-y-10 select-none' >
            <p className='text-2xl m-5'>Register here</p>
            <Input label='email' handleInput={handleInput}  placeholder='email' />
            <button className='w-40 h-12 bg-primary-2 text-white rounded-lg hover:font-bold' onClick={registerUser}>Authenticate Email</button>
            <Link  to='/'>Already have an account?</Link>
            <p>{credentials.email}</p>
        </div>
    )
}

export default EmailAthentication

