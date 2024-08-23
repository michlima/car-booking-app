import React from "react";
import { Link } from "react-router-dom";

const AccountRequestFeedback = () => {
  return (
    <div className="flex flex-col w-full justify-center content-center">
      <h1 className="text-center">Request to Create Account Sent</h1>
      <text className="text-center">
        Please wait for admin to approve request your account for you to be able
        to login
      </text>
      <Link to="/" className="text-center text-blue-600">
        back to sign in page
      </Link>
    </div>
  );
};

export default AccountRequestFeedback;
