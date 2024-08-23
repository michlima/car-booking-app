import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import { hasClass } from "rsuite/esm/DOMHelper";
import { addNewCar } from "../../backend/utils";
import Input from "../Input";

const AddNewCar = () => {
  const [errorList, setErrorList] = useState({});
  const [response, setResponse] = useState("");
  const [carInfo, setCarInfo] = useState({
    name: "",
    cost: "",
    fuel: "",
    plateNumber: "",
  });
  //   label, type, handleInput

  const handleInput = (name, value) => {
    setCarInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const createCar = async () => {
    const errors = {};
    let hasError = false;
    for (const [key, value] of Object.entries(carInfo)) {
      if (value.length < 2) {
        errors[key] = true;
        hasError = true;
      }
    }
    console.log(hasError);
    console.log(errors);
    if (hasError) {
      setErrorList(errors);
      hasError = false;
      return;
    }
    setErrorList({});
    console.log("adding..");

    const data = {
      available: true,
      cost: carInfo.cost,
      fuel: carInfo.fuel,
      id: carInfo.plateNumber.toUpperCase(),
      lightStatus: "working",
      lightsWorking: true,
      name: carInfo.name,
      notes: "",
      oil: new Date(),
      status: "Available",
    };
    let res = await addNewCar(data);
    if (res) {
      setResponse("New car now available for reservation");
      setCarInfo({
        name: "",
        cost: "",
        fuel: "",
        plateNumber: "",
      });
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="w-full">
        <Link to="/admin-car" className=" flex mt-4">
          <MdArrowBack size={20} />
        </Link>
      </div>
      <h3 style={{ width: "100%", textAlign: "center" }}>Add New Car</h3>
      <h6
        style={{
          width: "100%",
          textAlign: "center",
          color: "green",
        }}
      >
        {response}
      </h6>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {[
          {
            name: "name",
            label: "name",
            type: "text",
            placeholder: "Car name i.e. Red Van, Blue Van etc.",
          },
          {
            name: "cost",
            label: "cost",
            type: "text",
            placeholder: "Cost per km",
          },
          {
            name: "fuel",
            label: "fuel",
            type: "text",
            placeholder: "fuel type (gas or diesel)",
          },
          {
            name: "plateNumber",
            label: "plateNumber",
            type: "text",
            placeholder: "Plate Number (Kennzeichen)",
          },
        ].map((e) => {
          return (
            <Input
              error={errorList[e.name]}
              name={e.name}
              label={e.label}
              type={e.type}
              placeholder={e.placeholder}
              handleInput={handleInput}
            />
          );
        })}
        <button
          style={{
            paddingInline: "30px",
            paddingBlock: "10px",
            background: "#1e293b",
            color: "white",
          }}
          onClick={() => createCar()}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddNewCar;
