import React, {useState} from 'react'
import { useRef } from 'react'

// props needed: label, type, handleInput
const Input = (props) => {
    const [value, setValue] = useState('')
    const [errorMessage, setErrorMessage] = useState([])
    const errors = useRef([false,false])
    let cls = ''

    if(props.class == 'bookcar') {
        cls = 'px-2.5  bg-white/40  w-full rounded-lg h-10 text-black'
    } else {
        cls = 'px-2.5  backdrop-blur-xl bg-white/40 border w-full rounded-lg h-10 text-black'
    }

    const handleChange = e => {
        const { value } = e.target;
        let validNumber = false
        if(props.label === 'age'){
            let lastInput = value.charAt(value.length - 1)
            for(let i = 0; i < 10; i++) {
                if(lastInput == i){
                    validNumber = true
                    break;
                }
            }

            if(value < 110){
                errors.current[1] = false
            }

            if(value > 110 ){
                if(!errors.current[1]){
                    setErrorMessage(prevValue => [... prevValue, '* please put in valid age'])
                    setValue(value)
                    props.handleInput(props.label, value)
                    errors.current[1] = true
                }
            } else if(validNumber){
                errors.current[0] = false
                setValue(value)
                props.handleInput(props.label, value)
                setErrorMessage([null])
            } else {
                if(!errors.current[0]){
                    setErrorMessage( prevValue => [ ... prevValue, '* only numbers can be used to describe age'])
                    errors.current[0] = true
                }
            }
        } else {
            setValue(value)
            props.handleInput(props.label, value)
        }
    };

    

    

    return (
        <div className=' flex flex-col items-center justify-center w-68 max-w-xs  w-5/6 mb-5 lowercase '>
            <input className='px-2.5  backdrop-blur-xl bg-white border w-full rounded-lg h-10 text-black' 
                type={props.type} 
                value={value}  
                placeholder={props.placeholder}
                onChange={handleChange} 
            /> 
            {errorMessage.map((message) => {
                return <p className='text-red-600 text-sm'>{errorMessage}</p>
            })}
            
        </div>
    )
}

export default Input