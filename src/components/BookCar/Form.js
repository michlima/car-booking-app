import React, { useState } from 'react'

const Form = (props) => {
    const [values,setValues] = useState({
        destination: '',
        reason: '',
        driver: '',
        car: ''
    })
    const [checkbox, setCheckbox] = useState(false)

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setValues({
          ...values,
          [name]: event.target.value,
        });
        let newData = []
        switch (name) {
            case 'destination':
                newData = [
                    {name: 'destination', value: value},
                    {name: 'reason', value: values.reason},
                    {name: 'car', value: values.car},
                    {name: 'driver', value:values.driver}
                ]
                break;
            case 'reason':
                newData = [
                    {name: 'destination', value: values.destination},
                    {name: 'reason', value: value},
                    {name: 'car', value: values.car},
                    {name: 'driver', value:values.driver}
                ]
                break;
            case 'car':
                newData = [
                    {name: 'destination', value: values.destination},
                    {name: 'reason', value: values.reason},
                    {name: 'car', value: value},
                    {name: 'driver', value:values.driver}
                ]
                break;
            default:
                newData = [
                    {name: 'destination', value: values.destination},
                    {name: 'reason', value: values.reason},
                    {name: 'car', value: values.car},
                    {name: 'driver', value: value}
                ]
                break;
        }
    
        props.setData(newData)

    };




    const checkTheBox = () => {
        if(!checkbox)
            {setValues({
                ...values,
                'reason': 'personal',
            })
        } else {
            setValues({
                ...values,
                'reason': '',
            });
        }
        setCheckbox(!checkbox)
    }

    const cars = [
        'SOH',
        'Blue Van',
        'Truck',
    ]
    
    return(
        
        <div className='flex items-center justify-center w-screen flex-col'>
            <div className='w-screen flex  '>
                {cars.map((e,index) => {
                    if(e == values.car){
                        return (
                            <button key={index} name='car' value={e} onClick={handleChange} className='w-3/12 bg-primary-2 p-2 rounded-lg text-white m-1'>
                                {e}
                            </button>
                        )
                    }
                    return(
                        <button key={index} name='car' value={e} onClick={handleChange} className='w-3/12 bg-gray-800 p-2 rounded-lg text-white m-1'>
                            {e}
                        </button>
                    )  
                })}
                
            </div>

            <div className=' flex flex-col justify-center'>
                <>
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
                <input  
                    className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                    placeholder='Driver'
                    name='driver'
                    value={values.driver}
                    onChange={handleChange}
                    autoComplete="off"
                    />
                </>
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
            </div>
        </div>
    )
}

export default Form