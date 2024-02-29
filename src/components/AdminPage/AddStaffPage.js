import React, { useState } from "react";
import Input from "../Input";
import { DatePicker } from "rsuite";
const AddStaff = () => {
  const [staffData, setStaffData] = useState();
  const handleInput = async (label, value) => {
    setStaffData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };
  return (
    <div className=" w-screen flex items-center flex-col  bg-white p-2 pt-20 select-none z-10">
      <p className="text-lg my-2">Add Staff</p>
      <div className="flex w-full justify-center flex-row translate-x-1">
        <Input
          class={"bookCar"}
          label="reason"
          placeholder="First Name"
          handleInput={(label, value) => handleInput(label, value)}
        />
      </div>
      <div className="flex w-full justify-center flex-row translate-x-1">
        <Input
          class={"bookCar"}
          label="reason"
          placeholder="Last Name"
          handleInput={(label, value) => handleInput(label, value)}
        />
      </div>
      <div className="flex flex-row flex items-center justify-center gap-5 bg-sky-200 p-5 rounded-lg ">
        <p className="text-lg">Visa Expiration</p>
        <DatePicker onSelect={(e) => console.log(e)} />
      </div>
      <button
        to="/add-staff"
        className="m-20 bg-slate-700 px-5 py-2 text-white rounded-lg hover:scale-125 duration-500"
      >
        <p className="text-2xl">+</p>
      </button>
    </div>
  );
};

export default AddStaff;
