import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PiVanLight } from "react-icons/pi";
import { useWindowSize } from "../utils/utils";
import { Link } from "react-router-dom";
import { getMonthString, getMonthStringShort } from "../../backend/utils";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardArrowRight } from "react-icons/md";
import { BookingCard } from "./BookingCard";

//returns next 12 months after current month
const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const Bookcar = (props) => {
  let navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState("");
  const [width, height] = useWindowSize();
  const [kms, setKms] = useState();
  const [showDetails, setShowDetails] = useState("");
  const [showTodayCard, setShowTodayCard] = useState(false);
  const showDetailsCls =
    "duration-500 w-full opacity-0 flex items-center justify-center z-0 ";
  const noDetailsCls =
    "duration-500 w-full flex items-center justify-center z-0";
  const flipImageCls = "rotate-180 duration-500";

  let carContainerCls = "flex flex-col px-10 gap-5 w-screen ";
  let carDetailsButton = "";

  if (width < 414) {
    carDetailsButton = "translate-y-4";
  }

  const navigateTo = (name, cost) => {
    props.setCar(name);
    navigate("/complete-booking", {
      state: {
        cost: cost,
      },
    });
  };

  const detailsTrigger = (name) => {
    if (showDetails == name) {
      setShowDetails("");
    } else {
      setShowDetails(name);
    }
  };

  const CarDetails = (o) => {
    const e = o.e;
    let date = new Date(e.data.oil.seconds * 1000);
    if (showDetails !== e.data.name) {
      return <></>;
    }
    return (
      <div className="flex flex-col w-full z-0  duration-500 py-4">
        <div
          key={e.id}
          to="/complete-booking"
          className="w-full flex items-center flex-col bg-slate-50 drop-shadow-md flex rounded-b-lg p-2 m-[0.5px] relative duration-200 text-slate-700 "
        >
          <p className="font-semibold text-xl w-44 flex justify-center">
            {e.data.name}
          </p>
          <div className="w-full flex flex-col">
            <div className="px-2 inline-grid grid-cols-2 gap-4 w-full ">
              <p>
                Plate : <span className=" italic font-thin ">{e.data.id}</span>
              </p>
              <p className="flex flew-row">
                Oil :{" "}
                <span className=" text-red-500">{`${getMonthString(
                  date.getMonth(),
                )} ${date.getDate()} ${date.getFullYear()}`}</span>
              </p>
              <p>
                Kms : <span>{`${e.data.kms}`}</span>
              </p>
              <p>
                Status :{" "}
                <span
                  className={
                    e.data.available ? "text-blue-800" : "text-red-500"
                  }
                >
                  {e.data.status}
                </span>
              </p>
              <p>
                Lights :{" "}
                <span
                  className={
                    e.data.lightsWorking ? "text-blue-800" : "text-red-500"
                  }
                >
                  {e.data.lightsWorking ? "working" : e.data.lightsStatus}
                </span>
              </p>
              <p>
                Fuel Type : <span className="font-bold">{e.data.fuel}</span>
              </p>
            </div>
          </div>
          <div className="w-full flex items-center flex-col">
            <p className="text-lg">Notes</p>
            <p className="text-blue-800">{e.data.notes}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center bg-white flex-col pb-20 select-none z-10">
      <p className="text-red-600">{errorMessages}</p>
      <p className="text-2xl font-semibold text-center m-1 w-screen px-10">
        Book A Car
      </p>
      <div className={carContainerCls}>
        {props.carlist.map((e) => {
          return (
            <div style={{}}>
              <button
                onClick={() => navigateTo(e.data.name, e.data.cost)}
                key={e.id}
                className="bg-white rounded-t-lg drop-shadow-md  flex p-2 relative duration-200 text-slate-700 w-full "
              >
                <div className="p-4 bg-slate-400 w-24 flex items-center justify-center  rounded-lg">
                  <PiVanLight size={45} className="" />
                </div>
                <div className="px-2 w-full pr-16">
                  <p className="text-2xl text-center w-full font-semibold mt-2 ">
                    {e.data.name}
                  </p>
                  <p
                    className={
                      e.data.available
                        ? "text-blue-800 w-full text-center"
                        : "text-red-500 w-full text-center"
                    }
                  >
                    {e.data.status}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo(e.data.name, e.data.cost)}
                  className="absolute right-1 bottom-1 p-2 hover:scale-125"
                >
                  <MdKeyboardArrowRight size={70} />
                </button>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookcar;
