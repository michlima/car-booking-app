import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Input from "../Input";
import { buttonCls } from "../classes";
import { register } from "../../backend/utils";
import { useNavigate } from "react-router-dom";
import { auth } from "../../backend/firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { registerData } from "../../backend/utils";

const providerGoogle = new GoogleAuthProvider();

const CompleteRegistration = () => {
  let navigate = useNavigate();

  const email = useRef(window.localStorage.getItem("emailForSignIn"));
  const [userInfo, setUserInfo] = useState({
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    age: null,
  });

  const handleInput = (name, value) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const registerUser = async () => {
    let xx = await register(userInfo.email, userInfo);
    console.log(xx);
  };

  const registerWithGmail = () => {
    signInWithPopup(auth, providerGoogle)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        registerData(user.uid, user.email, user.displayName, "", "??");
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    navigate("/");
  };

  return (
    <div className="h-full w-screen overflow-auto pt-10 flex items-center justify-center flex-col -translate-y-10 select-none">
      <p className="text-2xl m-5">Registration</p>
      <Input label="email" handleInput={handleInput} placeholder="email" />
      <Input
        label="password"
        handleInput={handleInput}
        type="password"
        placeholder="password"
      />
      <Input
        label="firstName"
        handleInput={handleInput}
        placeholder="first name"
      />
      <Input
        label="lastName"
        handleInput={handleInput}
        placeholder="last name"
      />
      <Input label="age" handleInput={handleInput} placeholder="age" />

      <button className={buttonCls} onClick={registerUser}>
        Register
      </button>
      <a className="my-5">OR</a>
      <button onClick={registerWithGmail}>
        <FcGoogle className="text-green-600 my-5" size={50} />
      </button>
      <Link to="/">Already have an account?</Link>
    </div>
  );
};

export default CompleteRegistration;
