import React, { useEffect, useRef, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../backend/firebase";
import { BsFillSquareFill } from "react-icons/bs";
import { BookingCard } from "./BookingCard";
import { PieChart } from "react-minimal-pie-chart";

const colors = [
  "#F97316",
  "#005b96",

  "#6366F1",
  "#FCD34D",
  "#E11D48",
  "#FBBF24 ",
];

const ViewCost = (props) => {
  const [myReservations, setMyReservations] = useState(null);
  const [reservationsShow, setReservationsShow] = useState(null);
  const [pieData, setPieData] = useState();
  const [carFilter, setCarFilter] = useState(false);
  const [up, setUp] = useState(0);

  const getMyRes = async () => {
    let data = [];
    const querySnapshot = await getDocs(
      collection(db, "user-reservations", props.user.uid, "my-reservations"),
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = {
        id: doc.id,
        data: doc.data(),
        hardDate: doc.data().startDate.seconds,
      };
      data.push(newData);
    });
    for (let i = 0; i < data.length; i++) {
      let biggest = data[i].hardDate;
      let index = i;
      for (let j = i + 1; j < data.length; j++) {
        if (biggest < data[j].hardDate) {
          biggest = data[j].hardDate;
          index = j;
        }
      }
      if (biggest !== i) {
        let aux = data[i];
        data[i] = data[index];
        data[index] = aux;
      }
    }
    getStats(data);
    setMyReservations(data);
    setReservationsShow(data);
  };

  const getStats = (allData) => {
    let count = [];
    for (let i = 0; i < props.carlist.length; i++) {
      count[i] = 0;
    }
    allData.map((o) => {
      const e = o.data;
      for (let i = 0; i < props.carlist.length; i++) {
        if (e.car == props.carlist[i].data.name) {
          count[i] = count[i] + 1;
        }
      }
    });
    let pie = [];
    props.carlist.map((e, index) => {
      pie.push({
        title: e.data.name,
        value: count[index],
        color: colors[index],
      });
    });
    setPieData(pie);
  };

  useEffect(() => {
    getMyRes();
  }, []);

  if (!reservationsShow) {
    return (
      <div className=" bg-white-400 h-screen w-screen flex flex-col items-center">
        <p>Loading...</p>
      </div>
    );
  }
  console.log("updating..");

  const updatePage = () => {
    setUp(up + 1);
    getMyRes();
  };

  const filterCar = async (selectedCar, index) => {
    setPieData([
      {
        title: "title",
        value: 0,
        color: colors[index],
      },
      {
        title: "title",
        value: 1,
        color: colors[index],
      },
    ]);

    if (selectedCar == carFilter) {
      setCarFilter(false);
      getStats(myReservations);
    } else {
      setCarFilter(selectedCar);
    }

    let newRes = [];
    await myReservations.map((data) => {
      if (selectedCar == data.data.car) {
        newRes.push(data);
      }
    });
    setReservationsShow(newRes);
  };

  return (
    <div className=" bg-white-400 h-screen w-screen flex flex-col items-center">
      <h3 style={{ paddingBlock: "2rem" }}>My Reservations</h3>
      <div className="w-24 ">
        <PieChart
          data={pieData}
          lineWidth={30}
          animate={true}
          animationDuration={500}
        />
      </div>
      <div className="flex flex-row gap-5 m-3">
        {props.carlist.map((e, index) => {
          if (carFilter == e.data.name) {
            return (
              <button
                onClick={() => filterCar(e.data.name, index)}
                className="flex flex-row m-3 items-center justify-center bg-slate-200 px-2 py-1 rounded-lg"
              >
                <BsFillSquareFill className="mx-2" color={colors[index]} />
                <p>{e.data.name}</p>
              </button>
            );
          }
          return (
            <button
              onClick={() => filterCar(e.data.name, index)}
              className="flex flex-row m-3 items-center justify-center px-2 py-1"
            >
              <BsFillSquareFill className="mx-2" color={colors[index]} />
              <p>{e.data.name}</p>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col flex-wrap w-full items-center">
        {reservationsShow.map((o, index) => {
          const e = o.data;
          let date = new Date(e.startDate.seconds * 1000);
          return (
            <div className="w-screen flex items-center justify-center">
              <BookingCard
                data={e}
                e={o}
                date={date}
                userid={props.userid}
                carlist={props.carlist}
                from="/my-reservations"
                updateData={() => updatePage()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewCost;
