import React, { useEffect, useState } from "react";
import {
  getMonthStringShort,
  updatePayment,
  writeKms,
} from "../../backend/utils";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Input";
import { RiArrowRightCircleLine } from "react-icons/ri";
import { TbArrowsExchange2 } from "react-icons/tb";
import { CiMoneyBill } from "react-icons/ci";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import { deleteBooking } from "../../backend/utils";
import { useWindowSize } from "../utils/utils";

const BookingCard = (props) => {
  const [kms, setKms] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [width, height] = useWindowSize();

  const res = props.data;
  const date = props.date;
  const endDate = new Date(props.data.endDate.seconds * 1000);
  const e = props.e;

  const postEndKms = async (id) => {
    let data = {
      endKms: kms.endKms,
    };
    if (!res.startKms) {
      setErrorMessage("please fill in start kilometers first");
      return;
    }
    let start = Number(res.startKms);
    let end = Number(kms.endKms);
    if (res.start >= end) {
      setErrorMessage(
        "start kilometers can not be greater or equal than end kilometers. Please check input again"
      );
      return;
    }

    await writeKms(date, data, id, props.userid);
    setErrorMessage("");
    props.updateData();
  };

  const postStartKms = async (id) => {
    let data = {
      startKms: kms.startKms,
    };
    await writeKms(date, data, id, props.userid);
    props.updateData();
  };

  const handleInput = async (label, value) => {
    console.log(props);
    setKms((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  let mainCls =
    "flex flex-col w-96 height-full drop-shadow-md  rounded-lg m-3 bg-white items-center";
  if (width < 450) {
    mainCls =
      "flex flex-col w-72 drop-shadow-md rounded-lg m-3 bg-white items-center";
  }

  return (
    <div className={mainCls}>
      <p className="m-2 text-red-500 font-semibold text-center w-full px-2">
        {errorMessage}
      </p>
      <div className="flex flex-row pt-2 w-full px-5 ">
        <div className="flex flex-col w-full">
          <p className="text-slate-500">status</p>
          <p className="text-slate-500">car</p>
          <p className="text-slate-500">driver</p>
        </div>
        <div className="flex flex-col w-full">
          <p
            className={
              res.paid
                ? "text-blue-800 text-right w-full"
                : "text-red-300 text-right  w-full"
            }
          >
            {res.paid ? "paid" : "awaiting payment"}
          </p>
          <p className="text-right w-full">{res.car}</p>
          <p className="text-right w-full">{res.driver}</p>
        </div>
      </div>
      <div className="bg-slate-100 w-full h-[0.1rem]" />
      <div className="flex flex-row w-full mx-4 my-2 items-center m-5">
        <div className="flex flex-col items-center justify-center w-full">
          <CiMoneyBill size={35} className="text-blue-800" />
          {res.startKms && res.endKms ? (
            <p className="text-slate-400">
              €{((res.endKms - res.startKms) * res.cost).toFixed(2)}
            </p>
          ) : (
            <p className="text-slate-400">--</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <TbArrowsExchange2 size={35} className="text-blue-800" />
          {res.startKms && res.endKms ? (
            <p className="text-slate-400">{res.endKms - res.startKms}kms</p>
          ) : (
            <p className="text-slate-400">--</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <BsFillCalendarCheckFill size={25} className="text-blue-800 m-2" />
          {props.data.longTrip ? (
            <div className="flex flex-row text-slate-400">
              <p className="text-slate-400 pr-2">
                {getMonthStringShort(date.getMonth())} {date.getDate()}
              </p>
              -
              <p className="pl-2 text-slate-400">
                {getMonthStringShort(endDate.getMonth())} {endDate.getDate()}
              </p>
            </div>
          ) : (
            <p className="text-slate-400">
              {getMonthStringShort(date.getMonth())} {date.getDate()}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center w-full justify-center my-2">
        <AiOutlineClockCircle size={18} className="text-blue-800 mx-2" />
        <div className="flex flex-row items-center justify-center gap-1">
          <p className="font-semibold text-md">
            {date.getHours()}:
            {date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes()}
          </p>
          -
          <p className="font-semibold text-md">
            {endDate.getHours()}:
            {endDate.getMinutes() < 10
              ? "0" + endDate.getMinutes()
              : endDate.getMinutes()}
          </p>
        </div>
      </div>
      <div className="bg-slate-100 w-full h-[0.1rem]" />
      <p className="text-slate-500 text-xs mt-4">reason:</p>
      <p className="text-slate-500 ">{res.reason}</p>
      <p className="text-slate-500 text-xs mt-4">destination:</p>
      <p className="text-slate-500 ">{res.destination}</p>
      <Link
        to={{ pathname: "/focus-reservation" }}
        state={{ id: e.id, from: props.from, data: e }}
        className="w-7/12 bg-blue-800 text-white text-center py-2 m-5 px-3 text-semibold rounded-lg"
      >
        View
      </Link>
      {res.startKms ? (
        <div className="h-14 flex items-center justify-center ">
          <p className="text-xl font-semibold">Start: {res.startKms}kms</p>
        </div>
      ) : (
        <div className="flex flex-row items-top justify-center h-14 w-[95%] mb-2">
          <Input
            class={"bookCar"}
            label="startKms"
            placeholder="start kilometerss"
            handleInput={(label, value) => handleInput(label, value)}
          />
          <button
            onClick={() => postStartKms(e.id)}
            className="bg-white h-8 mx-2"
          >
            <RiArrowRightCircleLine size={35} />
          </button>
        </div>
      )}
      {res.endKms ? (
        <div className="h-14 flex items-center justify-center mb-2">
          <p className="text-xl font-semibold">End: {res.endKms}kms</p>
        </div>
      ) : (
        <div className="flex flex-row items-top justify-center h-14 w-[95%] mb-2">
          <Input
            class={"bookCar"}
            label="endKms"
            placeholder="end kilometers"
            handleInput={(label, value) => handleInput(label, value)}
          />
          <button
            onClick={() => postEndKms(e.id)}
            className="bg-white h-8 mx-2"
          >
            <RiArrowRightCircleLine size={35} />
          </button>
        </div>
      )}
    </div>
  );
};

const BookingCardAdmin = (props) => {
  const navigate = useNavigate();
  let kms1 = props.data.startKms ? props.data.startKms : "";
  let kms2 = props.data.endKms ? props.data.endKms : "";
  const [kms, setKms] = useState({
    startKms: kms1,
    endKms: kms2,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [width, height] = useWindowSize();
  let res = props.data;
  let date = props.date;
  let endDate = new Date(props.data.endDate.seconds * 1000);
  let e = props.e;

  const postEndKms = async (id) => {
    let data;
    if (!kms.endKms) {
      data = {
        startKms: kms.startKms,
      };
    } else {
      data = {
        startKms: kms.startKms,
        endKms: kms.endKms,
      };
    }

    console.log("1");
    if (!kms.startKms) {
      setErrorMessage("please fill in start kilometers first");
      return;
    }
    console.log(kms.startKms);
    let start;
    let end;
    if (kms.endKms) {
      start = Number(kms.startKms);
      end = Number(kms.endKms);
      console.log("3");
      if (start >= end) {
        setErrorMessage(
          "start kilometers can not be greater or equal than end kilometers. Please check input again"
        );
        return;
      }
    }

    console.log("got here");
    console.log(props.userid);
    await writeKms(date, data, id, props.userid);
    setErrorMessage("");
  };

  useEffect(() => {
    res = props.data;
    date = props.date;
    endDate = new Date(props.data.endDate.seconds * 1000);
    e = props.e;
    let kms1 = props.data.startKms ? props.data.startKms : "";
    let kms2 = props.data.endKms ? props.data.endKms : "";
    setKms({
      startKms: kms1,
      endKms: kms2,
    });
  }, [props.data, props.e]);

  const deleteReservation = async () => {
    await deleteBooking(e.id, e, props.userid);
    props.updateData();
  };
  let mainCls =
    "flex flex-col w-96  drop-shadow-md  rounded-lg m-3 bg-white items-center";
  if (width < 450) {
    mainCls = "flex flex-col w-72  drop-shadow-md  rounded-lg m-3 items-center";
  }

  const handleInputInput = async (label, value) => {
    console.log(props);
    setKms((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  return (
    <div className={mainCls}>
      <p className="m-2 text-red-500 font-semibold text-center w-full px-2">
        {errorMessage}
      </p>
      <div className="flex flex-row pt-2 w-full px-5 ">
        <div className="flex flex-col w-full">
          <p className="text-slate-500">name</p>
          <p className="text-slate-500">status</p>
          <p className="text-slate-500">car</p>
          <p className="text-slate-500">driver</p>
        </div>
        <div className="flex flex-col w-full">
          <p className="text-slate-500 text-right w-full  ">
            {res.reserverName}
          </p>
          <p
            className={
              res.paid
                ? "text-blue-800 text-right w-full"
                : "text-red-300 text-right  w-full"
            }
          >
            {res.paid ? "paid" : "awaiting payment"}
          </p>
          <p className="text-right w-full">{res.car}</p>
          <p className="text-right w-full">{res.driver}</p>
        </div>
      </div>
      <div className="bg-slate-100 w-full h-[0.1rem]" />
      <div className="flex flex-row w-full mx-4 my-2 items-center m-5">
        <div className="flex flex-col items-center justify-center w-full">
          <CiMoneyBill size={35} className="text-blue-800" />
          {res.startKms && res.endKms ? (
            <p className="text-slate-400">
              €{((res.endKms - res.startKms) * res.cost).toFixed(2)}
            </p>
          ) : (
            <p className="text-slate-400">--</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <TbArrowsExchange2 size={35} className="text-blue-800" />
          {res.startKms && res.endKms ? (
            <p className="text-slate-400">{res.endKms - res.startKms}kms</p>
          ) : (
            <p className="text-slate-400">--</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <BsFillCalendarCheckFill size={25} className="text-blue-800 m-2" />
          {props.data.longTrip ? (
            <div className="flex flex-row text-slate-400">
              <p className="text-slate-400 pr-2">
                {getMonthStringShort(date.getMonth())} {date.getDate()}
              </p>
              -
              <p className="pl-2 text-slate-400">
                {getMonthStringShort(endDate.getMonth())} {endDate.getDate()}
              </p>
            </div>
          ) : (
            <p className="text-slate-400">
              {getMonthStringShort(date.getMonth())} {date.getDate()}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center w-full justify-center my-2">
        <AiOutlineClockCircle size={18} className="text-blue-800 mx-2" />
        <div className="flex flex-row items-center justify-center gap-1">
          <p className="font-semibold text-md">
            {date.getHours()}:
            {date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes()}
          </p>
          -
          <p className="font-semibold text-md">
            {endDate.getHours()}:
            {endDate.getMinutes() < 10
              ? "0" + endDate.getMinutes()
              : endDate.getMinutes()}
          </p>
        </div>
      </div>
      <div className="bg-slate-100 w-full h-[0.1rem]" />
      <p className="text-slate-500 text-xs mt-1">reason:</p>
      <p className="text-slate-500 ">{res.reason}</p>
      <p className="text-slate-500 text-xs ">destination:</p>
      <p className="text-slate-500 ">{res.destination}</p>
      <button
        onClick={async () => {
          await props.saveSearch();
          navigate("/focus-reservation", {
            state: { id: e.id, from: props.from, data: e },
          });
        }}
        state={{ id: e.id, from: props.from, data: e }}
        className="hover:text-white w-7/12 bg-blue-800 text-white text-center py-2 m-1  px-3 text-semibold rounded-lg"
      >
        View
      </button>
      <button
        onClick={() => {
          updatePayment(e, props.userid);
          props.updateData();
        }}
        state={{ id: e.id, from: props.from, data: e }}
        className="w-7/12 bg-green-500 text-white text-center py-2 px-3 m-1 text-semibold rounded-lg"
      >
        Mark as Paid
      </button>
      <button
        className="w-7/12 bg-red-500 text-white text-center py-2 mb-4 px-3 text-semibold rounded-lg"
        onClick={() => deleteReservation()}
      >
        Delete Reservation
      </button>
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-row items-top justify-center h-14 w-[95%] mb-2">
          <div className="flex flex-col items-center justify-center mx-2">
            <p className="text-xs">start kms</p>
            <Input
              class={"bookCar"}
              label="startKms"
              value={res.startKms}
              placeholder={res.startKms ? res.startKms : "start kilometerss"}
              handleInput={(label, value) => handleInputInput(label, value)}
            />
          </div>

          <div className="flex flex-col items-center justify-center mx-2">
            <p className="text-xs">end kms</p>
            <Input
              class={"bookCar"}
              label="endKms"
              value={res.startKms}
              placeholder={res.endKms ? res.endKms : "start kilometerss"}
              handleInput={(label, value) => handleInputInput(label, value)}
            />
          </div>
        </div>
        <button
          onClick={() => postEndKms(e.id)}
          className="w-7/12 bg-sky-500 text-white text-center py-2 m-2 px-3 text-semibold rounded-lg"
        >
          Update Kms
        </button>
      </div>
    </div>
  );
};

export { BookingCard, BookingCardAdmin };
