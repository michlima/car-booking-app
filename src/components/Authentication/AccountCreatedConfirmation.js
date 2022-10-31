import React from 'react'
import { Link } from 'react-router-dom'

const AccountCreatedConfirmation = () => {
    return (
        <div>
            <a>Account Created!</a>
            <Link to='/'>Back to log in page</Link>
        </div>
    )
}

export default AccountCreatedConfirmation