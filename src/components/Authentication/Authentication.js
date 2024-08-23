import React, { useState } from "react";
import Input from "../Input";
import { Link, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../backend/firebase";
import { signIn } from "../../backend/utils";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { registerData } from "../../backend/utils";

import ywamPicture from "../pictures/ywam_bb.png";

const Authentication = (props) => {
  const [errorMessage, setErrMessage] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleInput = (name, value) => {
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const singIn = () => {
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        setErrMessage("Error: email or passsword might be incorrect.");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col -translate-y-10 select-none">
      <img alt="YWAM BB" className="h-28 -translate-x-2" src={ywamPicture} />
      <a className="text-2xl mb-3 text-gray-900">Car Pool</a>
      <p className="p-4 text-red-500">{errorMessage}</p>
      <Input label="email" handleInput={handleInput} placeholder="email" />
      <Input
        label="password"
        handleInput={handleInput}
        placeholder="password"
        type="password"
      />
      <div className="flex flex-row gap-4">
        <button
          className="text-white w-24 h-12 rounded-lg bg-primary-2 "
          onClick={singIn}
        >
          {" "}
          Sign In{" "}
        </button>

        <Link
          className=" text-white hover:text-white w-24 h-12 rounded-lg bg-primary-2 flex items-center justify-center "
          to="/complete-registration"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Authentication;
