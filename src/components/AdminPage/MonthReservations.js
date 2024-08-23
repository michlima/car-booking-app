import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getMonthReservations } from "../../backend/utils";
import { MdArrowBack } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
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
  const [viewSpreadSheet, setViewSpreadSheet] = useState(false);
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

  console.log(data);

  if (data == null) {
    return <p>loading..</p>;
  }
  const SpreadSheet = () => {
    return (
      <div ref={componentRef} style={{ width: "100%", padding: "10px" }}>
        <p className="text-2xl text-center">
          {months[today.getMonth()]} {today.getFullYear()}
        </p>
        {Object.keys(carBookings).map((car) => {
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
    );
  };

  const ReservationsList = () => {
    console.log(data);

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {data.map((reservation) => {
          const startDate = new Date(
            reservation.startDate.seconds * 1000 +
              reservation.startDate.nanoseconds / 1000000,
          );
          const endDate = new Date(
            reservation.endDate.seconds * 1000 +
              reservation.endDate.nanoseconds / 1000000,
          );
          console.log(reservation);
          return (
            <div style={{ width: "100%", padding: ".25rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <text
                  style={{
                    paddingInline: "20px",
                    paddingBlock: "15px",
                    background: "black",
                    color: "white",
                    display: "flex",
                    justifyItems: "center",
                    textAlign: "center",
                  }}
                >
                  {startDate.getDate()}
                </text>
                <div style={{ width: "100%" }}>
                  <h5>{reservation.reserverName}</h5>
                  <div>
                    <text>
                      time:
                      {startDate.getHours()}:
                      {startDate.getMinutes() < 9
                        ? startDate.getMinutes() + "0"
                        : startDate.getMinutes()}
                    </text>
                    -
                    <text>
                      {endDate.getHours()}:
                      {endDate.getMinutes() < 9
                        ? endDate.getMinutes() + "0"
                        : endDate.getMinutes()}
                    </text>
                  </div>
                </div>
                <div
                  style={{
                    width: "25%",
                    paddingInline: "20px",
                    paddingBlock: "15px",
                    background: "black",
                    color: "white",
                  }}
                >
                  {reservation.car}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className=" flex items-center flex-col  bg-white p-2 select-none z-10">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
        }}
      >
        <Link to="/admin-page">
          <MdArrowBack size={20} />
        </Link>
        <div style={{ width: "100%" }}></div>
        <button st>DOWNLOAD PDF</button>
        <div></div>
        <button></button>
      </div>

      <h3>Reservations</h3>
      <div>
        <button onClick={() => lastMonth()} className="p-2 ">
          LAST MONTH
        </button>
        <button onClick={() => nextMonth()} className="p-2 hover:">
          NEXT MONTH
        </button>
      </div>
      <button onClick={() => handlePrint()}>Download PDF</button>
      <div style={{ width: "100%" }}>
        <ReservationsList />
      </div>
      {/* <div style={{ visibility: "hidden" }}>
        <SpreadSheet />
      </div> */}
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
