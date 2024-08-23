import React, { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
const weekDays = ["M", "T", "W", "T", "F", "S", "S"];

const Calendar = (props) => {
  const [daysArray, setDays] = useState(false);
  const [date, setDate] = useState({
    startDate: props.date,
    day: props.date.getDate(),
    month: getMonth(props.date.getMonth()),
    year: props.date.getFullYear(),
  });
  const sd = window.localStorage.getItem("day");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const setAllDays = () => {
    let days = new Date(date.year, props.date.getMonth() + 1, 0).getDate();
    let dayOW = new Date(date.year, props.date.getMonth(), 0).getDay();
    setDays(makeDays(days, dayOW));
  };

  useEffect(() => {
    if (date.startDate !== props.date) {
      setDate({
        startDate: props.date,
        day: props.date.getDate(),
        month: getMonth(props.date.getMonth()),
        year: props.date.getFullYear(),
      });
    }
    setAllDays();
  }, [props.date]);

  const selectDate = (day, d) => {
    d.preventDefault();
    const newDate = new Date(date.year, props.date.getMonth(), day);
    setSelectedDate(newDate);

    props.setDate(newDate);
  };

  const navigateCalendar = (e, direction) => {
    e.preventDefault();
    if (direction === "left") {
      props.last();
    } else {
      props.next();
    }
  };

  let i = 0;
  return (
    <div className=" text-black bg-slate-50 flex  flex-col w-screen px-5 items-center  rounded-tr-[2rem]">
      <div className="w-full flex flex-row">
        <button onClick={(e) => navigateCalendar(e, "left")} className="pl-4">
          <MdKeyboardArrowLeft />
        </button>
        <div className="mb-2 w-full flex flex-col items-center">
          <a className="flex justify-center text-2xl text-black mx-max w-4/6">
            {date.month}
          </a>
          <a className="">{date.year}</a>
        </div>
        <button onClick={(e) => navigateCalendar(e, "right")} className="pr-4">
          <MdKeyboardArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 rounded-lg w-full shadow h-[16rem] p-2">
        {weekDays.map((e, index) => {
          return (
            <div key={index} className=" p-1 flex items-center justify-center">
              {e}
            </div>
          );
        })}
        {daysArray
          ? daysArray.map((e, index) => {
              let cls = " p-1 border-b-2 border-slate-50 ";
              if (i == 5 || i == 6) {
                if (i == 6) i = -1;
                cls = "text-gray-500 p-1 border-b-2 border-slate-50";
              }

              i += 1;
              if (e == "") {
                return <div key={index} />;
              }
              if (e == selectedDate.getDate()) {
                return (
                  <button
                    onClick={(d) => selectDate(e, d)}
                    key={index}
                    className=" p-1 border-b-2 border-b- border-primary-2"
                  >
                    {e}
                  </button>
                );
              }
              return (
                <button
                  key={index}
                  onClick={(d) => selectDate(e, d)}
                  className={cls}
                >
                  {e}
                </button>
              );
            })
          : "loading.."}
      </div>
    </div>
  );
};

// Fabricates days to fit in calendar
const makeDays = (days, dayOW) => {
  let daysArr = [];
  for (let i = 0; i < dayOW; i++) {
    daysArr.push("");
  }
  for (let i = 0; i < days; i++) {
    daysArr.push("" + (i + 1));
  }
  return daysArr;
};

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

export default Calendar;
