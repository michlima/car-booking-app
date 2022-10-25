import React, { useState } from 'react'

const Form = () => {
    const [values,setValues] = useState({
        destination: '',
        reason: '',
    })
    const [checkbox, setCheckbox] = useState(false)

    const handleChange = event => {
        setValues({
          ...values,
          [event.target.name]: event.target.value,
        });
      };

    const checkTheBox = () => {
        if(!checkbox)
            {setValues({
                ...values,
                'reason': 'personal',
            });
        } else {
            setValues({
                ...values,
                'reason': '',
            });
        }
        setCheckbox(!checkbox)
    }
    
    console.log(values)
    return(
        
        <form>
            <input  
                className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                placeholder='Destination'
                name='destination'
                value={values.destination}
                onChange={handleChange}
                autoComplete="off"
                />
            <input  
                className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                placeholder='Reason for trip'
                name='reason'
                value={ checkbox ? 'personal' : values.reason}
                onChange={checkbox ? '' : handleChange}
                autoComplete="off"
                />
            <div className='w-full flex flex-row justify-center text-slate-600'>
                <p>personal trip ?</p>
                <input 
                    className=' ml-4 rounded-lg  bg-slate-200'
                    type='checkbox' 
                    placeholder='something'
                    value={checkbox}
                    onChange={checkTheBox}
                    />
            </div>
            
        </form>
    )
}

export default Form