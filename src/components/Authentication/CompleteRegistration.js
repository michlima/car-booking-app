import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { accountRequestCreate } from "../../backend/utils";
import Input from "../Input";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

const CompleteRegistration = () => {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState({
    email: null,
    password: null,
    firstName: null,
    lastName: null,
    age: null,
  });
  const navigate = useNavigate();

  const handleInput = (name, value) => {
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const sendRequest = () => {
    let failures = {};
    let validations = [
      { pattern: /[a-z]/, issue: "Must include lowercase letters." },
      { pattern: /[A-Z]/, issue: "Must include uppercase letters." },
      { pattern: /.{5,}/, issue: "Must be at least 5 characters long." },
    ];
    let validationIssues = validations
      .filter((validation) => {
        return !userInfo.password?.match?.(validation.pattern);
      })
      .map((validation) => validation.issue);
    if (validationIssues.length > 0) {
      failures["pwdVerification"] = true;
    }

    // check if values exists
    for (const [key, value] of Object.entries(userInfo)) {
      if (value === null || value.length < 2) failures[key] = true;
    }
    // email validation
    let isEmail = validateEmail(userInfo.email);
    // if all fields valid
    console.log(failures);
    console.log(isEmail);
    if (Object.entries(failures).length < 1 && isEmail) {
      let res = accountRequestCreate(userInfo);
      if (!res) {
        setErrorMessage("Could not make request, please contact admin");
      } else {
        navigate("/account-request-feedback");
      }
    } else {
      // handle error case
      if (!isEmail || userInfo.length < 5) failures[userInfo.email] = true;
      setErrors(failures);
      let pwdIssues = `Your password was too weak for the following reasons: ${validationIssues.join(
        "\n",
      )}`;
      setErrorMessage(pwdIssues);
    }
  };

  return (
    <div className="h-full w-screen overflow-auto pt-10 flex items-center justify-center flex-col -translate-y-10 select-none">
      <p className="text-2xl m-5">Registration</p>
      <p className="m-2 text-rose-500">{errorMessage}</p>
      {[
        { value: "", name: "email", type: "", placeholder: "email" },
        {
          value: "",
          name: "password",
          type: "password",
          placeholder: "password",
        },
        { value: "", name: "firstName", type: "", placeholder: "first name" },
        { value: "", name: "lastName", type: "", placeholder: "last name" },
        { value: "", name: "age", type: "number", placeholder: "age" },
      ].map((e) => {
        return (
          <Input
            error={errors[e.name]}
            name={e.name}
            value={e.value}
            className="border-rose-400"
            label={e.name}
            handleInput={handleInput}
            type={e.type}
            placeholder={e.placeholder}
          />
        );
      })}

      <button
        className=" text-white hover:text-white w-24 h-12 rounded-lg bg-primary-2 flex items-center justify-center "
        onClick={() => sendRequest()}
      >
        Request Account
      </button>

      <Link to="/" className="m-10">
        <a className="my-5">Already have an account?</a>
      </Link>
    </div>
  );
};

export default CompleteRegistration;
