import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import DateRangePicker from "rsuite/DateRangePicker";
import { TiLocation } from "react-icons/ti";
import "../cs.css";
import { Checkbox } from "rsuite";
import Input from "../Input";
import { bookTime, getMonthStringShort } from "../../backend/utils";
import { db } from "../../backend/firebase";
import { AiFillCalendar } from "react-icons/ai";
import { writeBatch, doc, collection } from "firebase/firestore";
import { getDocs } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { AiOutlineClockCircle } from "react-icons/ai";
import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import { GiSteeringWheel } from "react-icons/gi";
import Clock from "./Clock";

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const hours = ["12"];
for (let i = 0; i < 24; i++) {
  if (i == 11) {
    hours.push("00");
    continue;
  }
  hours.push(`${i + 1}`);
}

const CompleteBooking = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [month, setMonth] = useState(new Date());

  const [startSelect, setStartSelect] = useState(false);
  const [endSelect, setEndSelect] = useState(false);
  const [selectingHour, setSelectingHour] = useState(true);
  const [am, setIsAm] = useState(true);
  let cost;
  if (location.state) {
    cost = location.state.cost;
  } else {
    navigate("/");
  }
  const [personal, setPersoanlTrip] = useState(false);
  const hasRes = useRef(true);
  const isStartDate = useRef(true);
  const username =
    props.userInfo.firstName +
    (props.userInfo.lastName ? `${props.userInfo.lastName}` : "");
  const [bookingData, setBookingData] = useState({
    id: props.user.uid,
    reserverName: username,
    driver: null,
    destination: null,
    reason: null,
    personalTrip: false,
    car: props.car,
    startDate: new Date(),
    endDate: new Date(),
    cost: cost,
    longTrip: false,
  });
  const [reservations, setReservations] = useState([]);
  const [time, setTime] = useState({
    startHour: "00",
    startMinute: "00",
    endHour: "00",
    endMinute: "00",
  });
  const [pickRange, setPickRange] = useState(false);
  let year = new Date().getFullYear();
  const [range, setRange] = useState([new Date(), new Date()]);
  const [allDay, setAllDay] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!props.userInfo) {
      navigate("/");
    }
    if (!location.state) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (props.schedule == null) {
      navigate("/");
    }
  }, [props.schedule]);

  const nextMonth = () => {
    let newMonth;
    if (month.getMonth() == 11) {
      newMonth = new Date(month.getFullYear() + 1, 0, 1);
    } else {
      newMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
    }
    setMonth(newMonth);
    props.updateData(newMonth);
  };

  const previousMonth = () => {
    let newMonth;
    if (month.getMonth() == 0) {
      newMonth = new Date(month.getFullYear() - 1, 11, 1);
    } else {
      newMonth = new Date(month.getFullYear(), month.getMonth() - 1, 1);
    }
    setMonth(newMonth);
    props.updateData(newMonth);
  };

  const bookAllDay = () => {
    let start = new Date(bookingData.startDate);
    let end = new Date(bookingData.endDate);
    if (allDay) {
      start.setHours("00", "00");
      end.setHours("00", "00");
      setBookingData((prev) => ({
        ...prev,
        startDate: start,
        endDate: end,
      }));
      setTime({
        startHour: "00",
        startMinute: "00",
        endHour: "00",
        endMinute: "00",
      });
    } else {
      start.setHours("00", "00");
      end.setHours("23", "59");
      setBookingData((prev) => ({
        ...prev,
        startDate: start,
        endDate: end,
      }));
      setTime({
        startHour: "00",
        startMinute: "00",
        endHour: "23",
        endMinute: "59",
      });
    }
    setAllDay(!allDay);
  };

  const setDate = async (date) => {
    if (pickRange) {
      let dateRange = range;
      if (isStartDate.current) {
        setBookingData((prevState) => ({
          ...prevState,
          startDate: date,
        }));
        dateRange[0] = date;
        setRange(dateRange);
      } else {
        setBookingData((prevState) => ({
          ...prevState,
          endDate: date,
        }));
        dateRange[1] = date;
        props.getDataRange(dateRange);
        setRange(dateRange);
      }

      isStartDate.current = !isStartDate.current;
    } else {
      setBookingData((prevState) => ({
        ...prevState,
        startDate: date,
        endDate: date,
      }));
      await props.schedule.map((e) => {
        let start = new Date(e.data.startDate.seconds * 1000);
        if (
          start.getMonth() == date.getMonth() &&
          start.getFullYear() == date.getFullYear() &&
          start.getDate() == date.getDate()
        ) {
        }
      });
    }
  };

  const handleInput = async (label, value) => {
    setBookingData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  const multipleDay = () => {
    if (!pickRange) {
      setPickRange(true);
      setBookingData((prev) => ({
        ...prev,
        startDate: new Date(),
        endDate: new Date(),
        longTrip: true,
      }));
    } else {
      setPickRange(false);
      setBookingData((prev) => ({
        ...prev,
        startDate: new Date(),
        endDate: new Date(),
        longTrip: false,
      }));
    }
  };

  useEffect(() => {
    let hasReservations = false;
    try {
      let x = props.schedule.filter((e) => {
        let start = new Date(e.data.startDate.seconds * 1000);
        let end = new Date(e.data.endDate.seconds * 1000);
        let startBD = bookingData.startDate;
        let endBD = bookingData.endDate;
        end.setHours(0, 0, 0, 0);
        startBD.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        endBD.setHours(0, 0, 0, 0);
        if (startBD > endBD) {
          if (start <= startBD && end >= endBD) {
            if (props.car == e.data.car) {
              hasReservations = true;
              return e;
            }
          }
        } else {
          if (start <= endBD && end >= startBD) {
            if (props.car == e.data.car) {
              hasReservations = true;
              return e;
            }
          }
        }
      });
      setReservations(x);
    } catch (e) {
      navigate("/");
    }
    hasRes.current = hasReservations;
  }, [bookingData.startDate, bookingData.endDate, props.schedule]);

  if (!props.car) {
    navigate("/");
  }

  const personalTripCheckbox = () => {
    setBookingData((prev) => ({
      ...prev,
      personalTrip: !personal,
    }));

    setPersoanlTrip(!personal);
  };

  const validade = () => {
    if (!bookingData.destination || bookingData.destination.length < 2) {
      return { valid: false, reason: "please fill out destination" };
    }

    if (!bookingData.driver || bookingData.driver.length < 2) {
      return { valid: false, reason: "please name the driver" };
    }

    if (!bookingData.reason || bookingData.reason.length < 2) {
      return { valid: false, reason: "please fill out reason for trip" };
    }

    if (!props.user.uid) {
      return {
        valid: false,
        reason: "internet connection issue, please try again later",
      };
    }

    return { valid: true, reason: "" };
  };

  const book = async () => {
    const dataCheck = validade();
    let finalBooking = bookingData;
    finalBooking.startDate.setHours(time.startHour, time.startMinute);
    finalBooking.endDate.setHours(time.endHour, time.endMinute);

    if (dataCheck.valid) {
      try {
        bookTime(finalBooking);
      } catch (error) {
        console.log("error");
      } finally {
        navigate("/receit", {
          state: {
            bookingData: finalBooking,
          },
        });
        props.updateData();
      }
    } else {
      console.log(dataCheck.reason);
    }
  };

  const handleClockStart = (name, hour) => {
    let value = hour;

    if (!am && name == "startHour") {
      if (value == 12) {
        value = hours[hour];
      } else {
        value = hours[+hour + 12];
      }
    }
    setTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name == "startHour") {
      setSelectingHour(false);
    } else {
      setStartSelect(false);
      setSelectingHour(true);
    }
  };

  const handleClockEnd = (name, hour) => {
    let value = hour;
    if (name == "endHour") {
      setSelectingHour(false);
      if (Number(hour) < Number(time.startHour)) {
        value = Number(value) + 12;
      }
    } else {
      setEndSelect(false);
      setSelectingHour(true);
    }

    if (!am && name == "endHour") {
      if (value == 12) {
        value = hours[hour];
      } else {
        let i = +hour + 12;
        value = hours[+hour + 12];
      }
    }

    setTime((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClock = (type, value) => {
    if (type == "startHour") {
      handleClockStart("startHour", value);
    }
    if (type == "startMinute") {
      handleClockStart("startMinute", value);
    }
    if (type == "endHour") {
      handleClockEnd("endHour", value);
    }
    if (type == "endMinute") {
      handleClockEnd("endMinute", value);
    }
  };

  return (
    <div className="select-none w-full h-full pt-28 bg-slate-50 flex items-center flex-col mt-2">
      <div className="flex justify-center items-center flex-col">
        <p className="text-center">Reservation Car</p>
        <p className="text-3xl text-slate-800 font-bold mb-4">{props.car}</p>
      </div>
      <button
        onClick={() => multipleDay()}
        className={
          pickRange
            ? "w-40 px-5 py-2 bg-blue-300 text-black rounded-lg mb-2 "
            : " mb-2 w-40 px-5 py-2 bg-white border text-black rounded-lg"
        }
      >
        Multiple Days
      </button>
      {pickRange ? (
        <div className="flex flex-row items-center">
          <DateRangePicker
            onSelect={(e) => setDate(e)}
            value={range}
            showOneCalendar={true}
            appearance="default"
            placeholder="Pick Dates Here"
            style={{ width: 250 }}
          />
        </div>
      ) : (
        <Calendar
          month={month.getMonth()}
          year={year}
          next={() => nextMonth()}
          date={month}
          last={() => previousMonth()}
          setDate={(e) => setDate(e)}
        />
      )}
      <p className="text-lg text-white py-5 text-semibold mt-4 w-full px-10 text-center bg-slate-800">
        Reservations:
      </p>
      <div
        className={
          hasRes.current
            ? "flex flex-row overflow-x-auto w-screen bg-slate-800 pb-10"
            : " flex-row gap-20 overflow-x-auto w-screen items-center justify-center"
        }
      >
        {hasRes.current ? (
          reservations.map((e) => {
            let start = new Date(e.data.startDate.seconds * 1000);
            let end = new Date(e.data.endDate.seconds * 1000);
            if (e.data.car == props.car) {
              return (
                <div
                  key={e.id}
                  className="flex flex-col w-screen pt-2 bg-gray-200 my-4 pb-20 items-center  relative mx-4 rounded-lg"
                >
                  <p className="font-semibold w-52 text-center">
                    {e.data.reserverName}
                  </p>
                  <div className="flex flex-col w-full items-center justify-center ">
                    {e.data.longTrip ? (
                      <AiFillCalendar className="text-blue-800" size={30} />
                    ) : (
                      <div className="h-7"></div>
                    )}
                    <div className="flex flex-row items-center justify-center">
                      {e.data.longTrip ? (
                        <div>
                          <div className="flex flex-row items-center">
                            <p className="text-center text-lg">
                              {start.getDate()}{" "}
                              {getMonthStringShort(start.getMonth())},{" "}
                              {start.getFullYear()}
                            </p>
                            <HiMiniArrowsRightLeft
                              className="text-slate-600 mx-4"
                              size={25}
                            />
                            <p className="text-center text-lg">
                              {`${end.getDate()} ${getMonthStringShort(
                                end.getMonth()
                              )} ${end.getFullYear()}`}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-row">
                          <AiFillCalendar
                            size={25}
                            className="text-blue-800 mx-2"
                          />
                          <p className="text-center text-lg">
                            {start.getDate()}{" "}
                            {getMonthStringShort(start.getMonth())},{" "}
                            {start.getFullYear()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col py-1 items-center w-80">
                    <div clas>
                      <div className="flex flex-row items-center w-full">
                        <AiOutlineClockCircle
                          size={25}
                          className="text-blue-800 mx-2"
                        />
                        <div className="flex flex-row items-center justify-center gap-1">
                          <p className="font-semibold text-lg">
                            {start.getHours()}:
                            {start.getMinutes() < 10
                              ? "0" + start.getMinutes()
                              : start.getMinutes()}
                          </p>
                          -
                          <p className="font-semibold text-lg">
                            {end.getHours()}:
                            {end.getMinutes() < 10
                              ? "0" + end.getMinutes()
                              : end.getMinutes()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center w-full">
                        <GiSteeringWheel
                          size={25}
                          className="text-blue-800 mx-2"
                        />
                        <p className="font-semibold text-lg">{e.data.driver}</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 bg-white w-full px-5 h-full flex flex-row h-16 items-center justify-center">
                    <TiLocation size={20} className="mx-2" />
                    <p>{e.data.destination}</p>
                  </div>
                </div>
              );
            }
          })
        ) : (
          <div className="px-5 pt-2 pb-5 flex flex-col items-center mb-4 bg-slate-800 overflow-x-auto">
            <div className="flex flex-row items-center justify-center gap-5">
              <p className="text-white px-5 py-2 rounded-lg bg-slate-600">
                No Reservations
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-10 m-3">
        <div className="flex flex-col w-[7rem] flex items-center">
          <p className="text-sm text-slate-400"> Start Time</p>
          <button
            onClick={() => {
              if (startSelect) {
                setStartSelect(false);
              } else {
                setStartSelect(true);
                setEndSelect(false);
                setSelectingHour(true);
              }
            }}
            className={
              startSelect
                ? "duration-200 text-3xl text-blue-800"
                : "duration-200 text-3xl "
            }
          >
            {time.startHour} : {time.startMinute}
          </button>
          {startSelect ? (
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
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-col w-[7rem] flex items-center">
          <p className="text-sm text-slate-400"> End Time</p>
          <button
            onClick={() => {
              if (endSelect) {
                setEndSelect(false);
              } else {
                setStartSelect(false);
                setEndSelect(true);
                setSelectingHour(true);
              }
            }}
            className={
              endSelect
                ? "duration-200 text-3xl text-blue-800"
                : "duration-200 text-3xl "
            }
          >
            {time.endHour} : {time.endMinute}
          </button>
          {endSelect ? (
            <Clock
              hours={hours}
              hour={selectingHour}
              am={am}
              setIsAm={() => setIsAm(!am)}
              handleClock={
                selectingHour
                  ? (value) => handleClock("endHour", value)
                  : (value) => handleClock("endMinute", value)
              }
            />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex flex-row">
        <Checkbox className="m-3" value={allDay} onChange={() => bookAllDay()}>
          All day
        </Checkbox>
        <Checkbox
          className="m-3"
          value={personal}
          onChange={() => personalTripCheckbox()}
        >
          Personal
        </Checkbox>
      </div>

      <div className="flex justify-center items-center w-screen p-4 flex-col">
        <div className="flex w-full justify-center flex-row translate-x-1">
          <Input
            class={"bookCar"}
            label="destination"
            placeholder="destination"
            handleInput={(label, value) => handleInput(label, value)}
          />
        </div>
        <div className="flex w-full justify-center flex-row translate-x-1">
          <Input
            class={"bookCar"}
            label="driver"
            placeholder="driver"
            handleInput={(label, value) => handleInput(label, value)}
          />
        </div>
        <div className="flex w-full justify-center flex-row translate-x-1">
          <Input
            class={"bookCar"}
            label="reason"
            placeholder="reason for trip"
            handleInput={(label, value) => handleInput(label, value)}
          />
        </div>
        <button
          onClick={() => book()}
          className="m-20 bg-slate-700 px-6 py-3 text-white rounded-lg"
        >
          Book Car
        </button>
      </div>
    </div>
  );
};

export default CompleteBooking;
