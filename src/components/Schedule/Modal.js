import React from 'react'
import {FaRegTimesCircle, FaCheck} from 'react-icons/fa'

const modalOpen = 'duration-200 fixed bottom-0 w-screen h-[37rem] flex justify-enter items-center flex-col bg-gray-800 w-12/12 h-12/12 rounded-lg p-2 select-none'
const modalClosed = 'duration-200 w-0 h-0 '

const Modal = (props) => {
    let modalCls = props.isShowing ? modalOpen : modalClosed
    return(
        <div className={modalCls} onScroll={() => console.log('dragging... ')}>
                { modalCls == modalClosed ?
                    <div/>
                    :
                    <div className='w-screen flex justify-enter items-center flex-col'>
                        <button className='bg-gray-800 w-6 h-6 rounded-full text-white ml-52' onClick={() => props.closeModal()}><FaRegTimesCircle size={20}/></button>
                        <p className='text-2xl text-white'>Milage</p>
                        {props.kmsFetched.start ?
                            <div className=' text-white text-2xl'>
                                Start - {props.kmsFetched.start}
                            </div>
                            :
                            <input  
                                className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                                type='number'
                                placeholder='start ...'
                                name='start'
                                value={props.kms.start}
                                onChange={props.handleChange}
                                autoComplete="off"
                            />
                        }
                        {props.kmsFetched.end ?
                            <div className=' text-white text-2xl'>
                                End - {props.kmsFetched.end}
                            </div>
                            :
                            <input  
                                className=' rounded-lg p-2 m-2 h-8 bg-slate-200' 
                                placeholder='end ...'
                                type='number'
                                name='end'
                                value={props.kms.end}
                                onChange={props.handleChange}
                                autoComplete="off"
                            />
                        }
                        <div className='text-white'>
                            <p className='font-semibold'>Reason</p>
                            <p className='italic'>{props.reason}</p>
                        </div>
                        {props.kmsFetched.start && props.kmsFetched.end
                            ?
                            <div/>
                            :
                            <button onClick={props.postKms} className='w-screen w- h-2 flex items-center justify-center mt-12' >
                                <p className=' duration-200 w-16 h-16 bg-red-400 flex items-center hover:text-3xl hover:w-12 hover:h-12 hover:text-white justify-center rounded-full'> <FaCheck/></p>
                            </button>
                        } 
                    </div>
                }
            </div>
    )
} 

export default Modal