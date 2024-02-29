import React, { useState } from 'react'
import { writeBatch, doc, collection } from "firebase/firestore"; 
import { db } from '../backend/firebase';

const Backend = (props) => {
    const [myFilter, setMyFilter] = useState([])
    const [count, setCount] = useState([])

    const filterData = () => {
        const date = new Date(props.schedule[0].data.startDate.seconds*1000)
        let dataFiltered = []
        let x = 0
        props.schedule.map((e) => {
            
            const date = new Date (e.data.startDate.seconds*1000)
            if(date.getMonth() == 6 && date.getFullYear() == 2023){
                x+=1
                dataFiltered.push(e.data)
            }
        })
        setCount(x)
        console.log(dataFiltered)
        setMyFilter(dataFiltered)
        console.log('my filter')
    }

    const postData = () => {
        const batch = writeBatch(db)

        myFilter.forEach(element => {
            var docRef = doc(collection(db, 'data-timeframe','2023-july','reservations'))
            batch.set(docRef, element)
        });
        batch.commit()
        console.log('commited')

    }
    return (
        <div className='pt-20'>
            <p>Back end</p>
            <div className='flex flex-col gap-10 '>
                <button onClick={() => filterData()}>Filter</button>
                <button onClick={() => postData()}>Post</button>
            </div>
            <p>Count: {count}</p>
            {myFilter.map((e) => {
                const date = new Date (e.startDate.seconds*1000)
                return (
                    <p>{getMonth(date.getMonth())} {date.getFullYear()} {e.car}</p>
                )
            })}
        </div>
    )
}

const getMonth = (month) => {
    switch (month) {
        case 0:
            return 'January'
        case 1:
            return 'February'
        case 2:
            return 'March'
        case 3:
            return 'April'
        case 4:
            return 'May'
        case 5:
            return 'June'
        case 6:
            return 'July'
        case 7:
            return 'August'
        case 8:
            return 'September'
        case 9:
            return 'October'
        case 10:
            return 'November'
        default:
            return 'December'
    }
}

export default Backend