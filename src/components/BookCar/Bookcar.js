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

  let carContainerCls = "flex px-10 gap-20 w-screen ";
  let carDetailsButton = "";
  let carFrame = "flex flex-col w-[30%] relative h-28";
  if (width < 1100) {
    carContainerCls = "flex flex-col w-screen ";
    carFrame = "flex flex-col w-screen relative mb-4";
  }
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
                  date.getMonth()
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
    <div className="flex items-center bg-white flex-col p-2 pb-20 pt-20 select-none z-10">
      <p className="text-red-600">{errorMessages}</p>
      <p className="text-2xl text-white font-semibold text-center pt-7 pb-2 w-screen bg-slate-800 ">
        My Trips This Month ({getMonthString(props.today.getMonth())})
      </p>
      <div className="w-screen">
        {props.schedule.length > 0 ? (
          <div className="flex flex-row overflow-x-auto w-full bg-slate-800 pb-10">
            {props.schedule.map((e) => {
              if (e.data.reserverID == props.userid) {
                const res = e.data;
                let date = new Date(e.data.startDate.seconds * 1000);
                let today = new Date();
                if (showTodayCard) {
                  if (
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear() &&
                    date.getDate() === today.getDate()
                  ) {
                    return (
                      <div className=" mx-5">
                        <BookingCard
                          carlist={props.carlist}
                          userid={props.userid}
                          data={res}
                          e={e}
                          date={date}
                          updateData={() => props.updateData()}
                          from="/"
                        />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className=" mx-5 w-full">
                      <BookingCard
                        carlist={props.carlist}
                        userid={props.userid}
                        data={res}
                        e={e}
                        date={date}
                        updateData={() => props.updateData()}
                        from="/"
                      />
                    </div>
                  );
                }
              }
            })}
          </div>
        ) : (
          <div className="flex flex-row overflow-x-auto w-screen bg-slate-800 pb-10 items-center justify-center">
            <p className="text-slate-200 px-10 py-2 bg-slate-600 text-center mt-10 rounded-lg">
              No resesrvations
            </p>
          </div>
        )}
      </div>
      <div className=" flex items-center justify-center py-4 w-screen bg-slate-800 ">
        <button
          onClick={() => setShowTodayCard(!showTodayCard)}
          className={
            showTodayCard
              ? "bg-blue-800 px-5 py-3 rounded-lg text-white duration-500"
              : "bg-white px-4 py-2 rounded-lg duration-500"
          }
        >
          Show Only Today
        </button>
      </div>

      <p className="text-2xl font-semibold text-center m-10 w-screen px-10">
        Book A Car
      </p>
      <div className={carContainerCls}>
        {props.carlist.map((e) => {
          return (
            <div className={carFrame}>
              <button
                onClick={() => navigateTo(e.data.name, e.data.cost)}
                key={e.id}
                className="bg-white rounded-t-lg drop-shadow-md mb-[1px] flex p-2 relative duration-200 text-slate-700 "
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
              <div
                className={
                  showDetails == e.data.name ? noDetailsCls : showDetailsCls
                }
              >
                <CarDetails e={e} />
              </div>
              <div className="items-center justify-center flex">
                <button
                  className={
                    showDetails == e.data.name
                      ? "duration-500 text-slate-700 bg-indigo-500 h-16 w-16 items-center justify-center flex items-center justify-center w-full border-t-[1px] drop-shadow-md rounded-full  border-slate-200 "
                      : "duration-500 text-slate-700 flex items-center h-8 justify-center w-full border-t-[1px] bg-white drop-shadow-md rounded-b-lg  border-slate-200 "
                  }
                  onClick={() => detailsTrigger(e.data.name)}
                >
                  <div
                    className={
                      showDetails == e.data.name
                        ? flipImageCls
                        : "duration-500 flex flex-col items-center justify-center"
                    }
                  >
                    {showDetails == e.data.name ? (
                      <></>
                    ) : (
                      <p className="text-xs text-slate-400">show details</p>
                    )}
                    <IoIosArrowDown size={15} />
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Bookcar;
