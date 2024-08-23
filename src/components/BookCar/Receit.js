import React from "react";
import { useLocation } from "react-router-dom";
import { TiLocation } from "react-icons/ti";
import { PiVanLight, PiTimerBold, PiSteeringWheelBold } from "react-icons/pi";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { getMonthString } from "../../backend/utils";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const getMonth = (month) => {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    default:
      return "December";
  }
};

const Receit = (props) => {
  let location = useLocation();
  const navigate = useNavigate();
  let booking = location.state.bookingData;
  let startDate = location.state.startDate;
  let endDate = location.state.endDate;
  console.log(startDate);
  console.log(endDate);

  const getMinutes = (minutes) => {
    if (minutes < 10) {
      return `0${minutes}`;
    } else {
      return minutes;
    }
  };

  const ReservationDate = () => {
    let d1 = startDate;
    let d2 = endDate;
    if (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    ) {
      return (
        <p className="flex flex-row gap-2 items-center my-2">
          {" "}
          <span className="text-xl">
            <BsFillCalendarDateFill />
          </span>{" "}
          {getMonthString(booking.startDate.getMonth())}{" "}
          {booking.startDate.getDate()} {booking.startDate.getFullYear()}
        </p>
      );
    } else {
      return (
        <p className="flex flex-row gap-2 items-center my-2">
          <span className="text-xl">
            <BsFillCalendarDateFill />
          </span>
          {getMonthString(d1.getMonth())} {d1.getDate()} {d1.getFullYear()} -{" "}
          {getMonthString(d2.getMonth())} {d2.getDate()} {d2.getFullYear()}
        </p>
      );
    }
  };

  return (
    <div className="pt-20 w-full flex flex-col items-center mt-5">
      <p className="text-slate-800 text-xl">Reservation Receit</p>
      <div className="flex flex-col bg-slate-200 p-5 rounded-lg items-center">
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-500">Reservation ID</p>
          <p className="font-bold">{booking.id}</p>
        </div>
        <div className="m-2 gap-2">
          <p className="flex flex-row gap-2 items-center my-2">
            <span className="text-2xl">
              <PiVanLight />
            </span>{" "}
            {booking.car}
          </p>
          <p className="flex flex-row gap-2 items-center my-2">
            <span className="text-xl">
              <PiSteeringWheelBold />
            </span>{" "}
            {booking.driver}
          </p>
          <p className="flex flex-row gap-2 items-center my-2">
            <span className="text-xl">
              <TiLocation />
            </span>{" "}
            {booking.destination}
          </p>
          <ReservationDate />
          <p className="flex flex-row gap-2 items-center my-2">
            <span className="text-xl">
              <PiTimerBold />
            </span>{" "}
            {startDate.getHours()}:{getMinutes(startDate.getMinutes())} -{" "}
            {endDate.getHours()}:{getMinutes(endDate.getMinutes())}
          </p>
        </div>
        <div className="bg-slate-100 p-2 rounded-lg m-3 w-4/5">
          <p className="text-xs w-full text-center text-blue-400">reason</p>
          <p className="w-full text-center"> {booking.reason}</p>
        </div>
      </div>
      <button
        onClick={() => {
          props.updateData();
          navigate("/");
        }}
        to={{ pathname: "/" }}
        className="w-10/12 bg-slate-800 text-white text-center py-3 m-5 px-5 text-semibold rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default Receit;
