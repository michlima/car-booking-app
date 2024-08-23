import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import {
  deleteBooking,
  editData,
  editTime,
  getMonthString,
} from "../../backend/utils";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiArrowRightCircleLine } from "react-icons/ri";
import { TbArrowsExchange2 } from "react-icons/tb";
import { AiOutlineClockCircle } from "react-icons/ai";
import { CiMoneyBill } from "react-icons/ci";
import { BsFillCalendarCheckFill, BsCheck, BsCheckLg } from "react-icons/bs";
import { getMonthStringShort } from "../../backend/utils";
import { writeKms } from "../../backend/utils";
import Input from "../Input";
import Clock from "./Clock";

const hours = ["12"];
for (let i = 0; i < 24; i++) {
  if (i == 11) {
    hours.push("00");
    continue;
  }
  hours.push(`${i + 1}`);
}

const FocusReservation = (props) => {
  const navigate = useNavigate();
  const format = "HH:mm";
  const location = useLocation();
  const [edit, setEdit] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [kms, setKms] = useState();
  const [time, setTime] = useState(null);
  const [editables, setEditables] = useState();
  const [focussing, setFocussing] = useState(null);
  const [allDay, setAllDay] = useState(false);
  const [init, setInit] = useState(true);
  const [startSelect, setStartSelect] = useState(false);
  const [endSelect, setEndSelect] = useState(false);
  const [selectingHour, setSelectingHour] = useState(true);
  const [am, setIsAm] = useState(true);

  const [startSelectEnd, setStartSelectEnd] = useState(false);
  const [endSelectEnd, setEndSelectEnd] = useState(false);
  const [selectingHourEnd, setSelectingHourEnd] = useState(true);
  const [amEnd, setIsAmEnd] = useState(true);
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
    resolveDate();

    setInit(false);
  }, []);

  useEffect(() => {
    if (!edit && !init) {
      updateTime();
    }
  }, [edit]);

  const updateTime = async () => {
    await editTime(focussing, editables, props.userid);
    resolveDate();
  };

  const resolveDate = async () => {
    let data = await props.updateFocusing(
      location.state.id,
      location.state.data,
    );
    setFocussing(data);
  };

  if (!focussing) {
    return <div>Loading..</div>;
  }

  const from = location.state.from;
  const res = focussing.data;
  const date = new Date(focussing.data.startDate.seconds * 1000);
  const endDate = new Date(focussing.data.endDate.seconds * 1000);
  const e = focussing;
  const d1 = new Date(focussing.data.startDate.seconds * 1000);
  const d2 = new Date(focussing.data.endDate.seconds * 1000);

  if (!time) {
    const start = new Date(focussing.data.startDate.seconds * 1000);
    const end = new Date(focussing.data.endDate.seconds * 1000);

    setTime({
      startHour:
        start.getHours() < 10 ? `0${start.getHours()}` : start.getHours(),
      startMinute:
        start.getMinutes() < 10 ? `0${start.getMinutes()}` : start.getMinutes(),
      endHour: end.getHours() < 10 ? `0${end.getHours()}` : end.getHours(),
      endMinute:
        end.getMinutes() < 10 ? `0${end.getMinutes()}` : end.getMinutes(),
    });
    setEditables({
      startDate: start,
      endDate: end,
    });
  }

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
    if (start >= end) {
      setErrorMessage(
        "start kilometers can not be greater or equal than end kilometers. Please check input again",
      );
      return;
    }

    await writeKms(date, data, id, props.userid);
    setErrorMessage("");
    let d = await props.updateFocusing(focussing.id);
    setFocussing(d);
  };
  const postStartKms = async (id) => {
    let data = {
      startKms: kms.startKms,
    };
    await writeKms(date, data, id, props.userid);
    let d = await props.updateFocusing(focussing.id);
    setFocussing(d);
  };

  const ReservationDate = () => {
    return (
      <p className="flex flex-row gap-2 items-center my-2">
        <span className="mr-4">
          <BsFillCalendarDateFill size={28} />
        </span>
        {getMonthString(d1.getMonth())} {d1.getDate()} {d1.getFullYear()}
      </p>
    );
  };

  const handleInput = async (label, value) => {
    setKms((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  const postNewData = () => {
    editData(focussing.id, focussing.data.reserverID, editables, d1);
    props.updateData();
    navigate(from);
  };

  let editButtonCls =
    "items-center px-5 mx-4 py-2 bg-white drop-shadow-xl rounded-lg duration-1000";
  if (edit) {
    editButtonCls =
      "items-center text-white px-5 mx-4 py-2 bg-blue-800 drop-shadow-xl rounded-lg duration-1000";
  }

  const deleteReservation = async () => {
    await deleteBooking(focussing.id, focussing, props.userid);
    props.updateData();
    navigate(from);
  };

  const handleClockStart = (name, hour) => {
    let value = hour;
    let date;

    if (name == "startHour") {
      setSelectingHour(false);
      if (!am) {
        if (value == 12) {
          value = hours[hour];
        } else {
          value = hours[+hour + 12];
          setSelectingHour(false);
        }
      }
      date = editables.startDate;
      date.setHours(Number(value), date.getMinutes());
    }

    if (name == "startMinute") {
      setSelectingHour(true);
      date = editables.startDate;
      date.setHours(date.getHours(), Number(value));
    }
    setEditables((prev) => ({
      ...prev,
      startDate: date,
    }));

    setTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClockEnd = (name, hour) => {
    let date;
    let value = hour;
    if (name == "endHour") {
      setSelectingHourEnd(false);

      if (Number(hour) < Number(time.startHour)) {
        value = Number(value) + 12;
      }
      date = editables.endDate;
      date.setHours(Number(value), date.getMinutes());
    } else {
      setEndSelectEnd(false);
      setSelectingHourEnd(true);
    }

    if (name == "endMinute") {
      setSelectingHourEnd(true);
      date = editables.endDate;
      date.setHours(date.getHours(), Number(value));
    }

    setEditables((prev) => ({
      ...prev,
      endDate: date,
    }));

    setTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClock = (type, value) => {
    switch (type) {
      case "startHour":
        handleClockStart("startHour", value);
        break;
      case "startMinute":
        handleClockStart("startMinute", value);
      case "endHour":
        handleClockEnd("endHour", value);
        break;
      default:
        handleClockEnd("endMinute", value);
        break;
    }
  };

  return (
    <div className=" pt-2 flex items-center flex-col justify-center">
      <div className="w-11/12 flex flex-row my-2 justify-center items-center">
        <Link
          to={from}
          className="items-center px-5 py-3 bg-white drop-shadow-xl rounded-lg"
        >
          <div>
            <IoChevronBackOutline size={30} className="" />
          </div>
        </Link>
        <div className=" w-full"></div>
        <div className={editButtonCls}>
          {edit ? (
            <button onClick={() => setEdit(!edit)}>
              <BsCheckLg size={30} />
            </button>
          ) : (
            <button onClick={() => setEdit(!edit)}>
              <AiFillEdit size={30} className="" />
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col w-11/12  drop-shadow-md  rounded-lg   bg-white items-center">
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
            <CiMoneyBill size={50} className="text-blue-800" />
            {res.startKms && res.endKms ? (
              <p className="text-slate-400">
                €{((res.endKms - res.startKms) * res.cost).toFixed(2)}
              </p>
            ) : (
              <p className="text-slate-400">--</p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <TbArrowsExchange2 size={50} className="text-blue-800" />
            {res.startKms && res.endKms ? (
              <p className="text-slate-400">{res.endKms - res.startKms}kms</p>
            ) : (
              <p className="text-slate-400">--</p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <BsFillCalendarCheckFill size={35} className="text-blue-800 m-2" />
            {res.longTrip ? (
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
          {edit ? (
            <></>
          ) : (
            <AiOutlineClockCircle size={25} className="text-blue-800 mx-2" />
          )}
          {edit ? (
            <div className="flex flex-col items-center justify-center">
              <AiOutlineClockCircle size={25} className="text-blue-800 mx-2" />
              <div className="flex flex-row gap-10 m-3">
                <div className="flex flex-col w-[7rem] flex items-center">
                  <p className="text-sm text-slate-400"> Start Time</p>
                  <button className="duration-200 text-3xl text-blue-800">
                    {time.startHour} : {time.startMinute}
                  </button>
                  <Clock
                    hours={hours}
                    hour={selectingHour}
                    am={am}
                    setIsAm={() => setIsAm(!am)}
                    handleClock={
                      selectingHour
                        ? (value) => handleClock("startHour", value)
                        : (value) => handleClock("startMinute", value)
                    }
                  />
                </div>

                <div className="flex flex-col w-[7rem] flex items-center">
                  <p className="text-sm text-slate-400"> End Time</p>
                  <button className="duration-200 text-3xl text-blue-800">
                    {time.endHour} : {time.endMinute}
                  </button>

                  <Clock
                    hours={hours}
                    hour={selectingHourEnd}
                    am={amEnd}
                    setIsAm={() => setIsAmEnd(!amEnd)}
                    handleClock={
                      selectingHourEnd
                        ? (value) => handleClock("endHour", value)
                        : (value) => handleClock("endMinute", value)
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-1">
              <p className="font-semibold text-lg">
                {date.getHours()}:
                {date.getMinutes() < 10
                  ? "0" + date.getMinutes()
                  : date.getMinutes()}
              </p>
              -
              <p className="font-semibold text-lg">
                {endDate.getHours()}:
                {endDate.getMinutes() < 10
                  ? "0" + endDate.getMinutes()
                  : endDate.getMinutes()}
              </p>
            </div>
          )}
        </div>
        <div className="bg-slate-100 w-full h-[0.1rem]" />
        <p className="text-slate-500 text-xs mt-4">reason:</p>
        <p className="text-slate-500 ">{res.reason}</p>
        <p className="text-slate-500 text-xs mt-4">destination:</p>
        <p className="text-slate-500 ">{res.destination}</p>
        {res.startKms ? (
          <div className="h-16 flex items-center justify-center ">
            <p className="text-xl font-semibold">Start: {res.startKms}kms</p>
          </div>
        ) : (
          <div className="flex flex-row items-top justify-center h-16 w-[95%] mb-2">
            <Input
              class={"bookCar"}
              label="startKms"
              placeholder="start kilometers"
              handleInput={(label, value) => handleInput(label, value)}
            />
            <button
              onClick={() => postStartKms(e.id)}
              className="bg-white h-12 mx-2"
            >
              <RiArrowRightCircleLine size={35} />
            </button>
          </div>
        )}
        {res.endKms ? (
          <div className="h-16 flex items-center justify-center mb-2">
            <p className="text-xl font-semibold">End: {res.endKms}kms</p>
          </div>
        ) : (
          <div className="flex flex-row items-top justify-center h-16 w-[95%] mb-2">
            <Input
              class={"bookCar"}
              label="endKms"
              placeholder="end kilometers"
              handleInput={(label, value) => handleInput(label, value)}
            />
            <button
              onClick={() => postEndKms(e.id)}
              className="bg-white h-12 mx-2"
            >
              <RiArrowRightCircleLine size={35} />
            </button>
          </div>
        )}
        <Link
          to={{ pathname: from }}
          className="w-10/12 bg-blue-800 text-white text-center py-3 m-5 px-5 text-semibold rounded-lg"
        >
          Go Back
        </Link>
        {res.startKms || res.endKms ? (
          <></>
        ) : (
          <button
            className="w-10/12 bg-red-500  text-white text-center py-3 m-5 px-5 text-semibold rounded-lg"
            onClick={() => deleteReservation()}
          >
            Delete Reservation
          </button>
        )}
      </div>
    </div>
  );
};

export default FocusReservation;
