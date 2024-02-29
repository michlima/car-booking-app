import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getMonthReservations } from "../../backend/utils";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../backend/firebase";
import { BookingCardAdmin } from "../BookCar/BookingCard";
import { useReactToPrint } from "react-to-print";
import { CiMoneyBill } from "react-icons/ci";
import { TbRoute, TbSteeringWheel } from "react-icons/tb";
import { BsCalendar2Check } from "react-icons/bs";
import Spreadsheet from "react-spreadsheet";
import "react-app-polyfill/stable";
import "../styling/month-reservations.css";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const monthsAbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MonthReservations = (props) => {
  const [viewingRes, setViewingRes] = useState(props.viewingRes);
  const [viewingID, setViewingID] = useState(null);
  const [today, setToday] = useState(new Date());
  const [carBookings, setCarBookings] = useState({});
  const [rowLabels, setRowLables] = useState({});
  const [data, setData] = useState(null);
  const componentRef = useRef();

  const getThis = async () => {
    let todayStr = "" + today.getFullYear() + "-" + months[today.getMonth()];
    let answer = await getMonthReservations(todayStr);
    console.log(answer);
    setData(answer);
    console.log("reloaded");
  };

  useEffect(() => {
    getThis();
  }, []);

  const columnLabels = [
    "Name",
    "Destination",
    "Driver",
    "Date",
    "Cost",
    "Reason",
    "Start Kms",
    "End Kms",
    "Paid",
  ];

  const nextMonth = () => {
    let clone = today;
    let month = today.getMonth();
    clone.setMonth(month + 1);
    setToday(clone);
    getThis(clone);
    console.log("loaded");
  };

  const lastMonth = () => {
    let clone = today;
    let month = today.getMonth();
    clone.setMonth(month - 1);
    setToday(clone);
    getThis(clone);
    console.log("loaded");
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log(data);
  useEffect(() => {
    let bookings = {};

    if (data) {
      data.forEach((booking) => {
        const { reserverName, car } = booking;
        if (!bookings[car]) {
          bookings[car] = [];
          rowLabels[car] = [];
        }
        rowLabels[car].push(booking.personalTrip ? "Personal" : "Ministry");
        bookings[car].push(booking);
      });
      setCarBookings(bookings);
      setRowLables(rowLabels);
    }
  }, [data]);

  const getSpreadSheet = (data) => {
    let spreadSheet = [];

    data.map((e, index) => {
      let startDate = new Date(e.startDate.seconds * 1000);
      let date = `${monthsAbr[startDate.getMonth()]} ${startDate.getDate()}`;
      let cost = "--/--";
      if (e.endKms && e.startKms) {
        cost = `$${(Math.round((e.endKms - e.startKms) * e.cost) * 100) / 100}`;
      }
      console.log(e.carID);
      console.log(e);
      spreadSheet.push([
        { value: e.reserverName, readOnly: false },
        { value: e.destination, readOnly: false },
        { value: e.driver, readOnly: false },
        { value: date, readOnly: false },
        { value: cost, readOnly: false },
        { value: `${e.reason} `, readOnly: false },
        { value: e.startKms, readOnly: false },
        { value: e.endKms, readOnly: false },
        { value: e.paid, readOnly: false },
      ]);
    });
    return spreadSheet;
  };

  if (data) {
  }
  console.log(carBookings);

  if (data == null) {
    return <p>loading..</p>;
  }

  return (
    <div className=" w-screen flex items-center flex-col  bg-white p-2 pt-20 select-none z-10">
      <Link to="/admin-page">Back</Link>
      <p>Reservations</p>
      <div>
        <button onClick={() => handlePrint()}>A file</button>
        <button onClick={() => lastMonth()} className="p-2 hover:">
          back
        </button>
        <button onClick={() => nextMonth()} className="p-2 hover:">
          forward
        </button>
      </div>
      <div></div>
      {data !== null ? (
        <div ref={componentRef} style={{ width: "100%", padding: "10px" }}>
          <p className="text-2xl text-center">
            {months[today.getMonth()]} {today.getFullYear()}
          </p>
          {Object.keys(carBookings).map((car) => {
            console.log(carBookings[car]);
            let data = getSpreadSheet(carBookings[car]);
            return (
              <div key={car}>
                {car ? (
                  <div>
                    <h3>{car}</h3>
                    <Spreadsheet
                      className="spread-sheet"
                      data={data}
                      allowEditing={false}
                      columnLabels={columnLabels}
                      rowLabels={rowLabels[car]}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default MonthReservations;

// {data.map((e) => {
//   return (
//     <div>
//       <p>Car:{e.car}</p>
//       <p>Cost:{e.cost}</p>
//       <p>Destination:{e.destination}</p>
//       <p>Driver:{e.driver}</p>
//       <p>Start Date:{e.startDate}</p>
//       <p>End Date:{e.endDate}</p>
//       <p>Multiple Days Booking:{e.longTrip}</p>
//       <p>Paid:{e.paid}</p>
//       <p>Reason:{e.reason}</p>
//       <p>ReserverID:{e.destination}</p>
//     </div>
//   );
// })}
