import React, { useState, useEffect, useRef } from "react";
import Bookcar from "./components/BookCar/Bookcar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./backend/firebase";
import { bookTime } from "./backend/utils";
import Navigation from "./components/Navigations";
import Authentication from "./components/Authentication/Authentication";
import CompleteRegistration from "./components/Authentication/CompleteRegistration";
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { GiCarWheel } from "react-icons/gi";
import { AiOutlineLoading } from "react-icons/ai";
import CompleteBooking from "./components/BookCar/CompleteBooking";
import CurrentBookings from "./components/BookCar/CurrentBookings";
import FocusReservation from "./components/BookCar/FocusReservation";
import Backend from "./components/Backend";
import Receit from "./components/BookCar/Receit";
import ViewCost from "./components/BookCar/ViewCost";
import AdminPage from "./components/AdminPage/AdminPage";
import Admin from "./components/AdminPage/Admin";
import StaffPage from "./components/AdminPage/StaffPage";
import AddStaff from "./components/AdminPage/AddStaffPage";
import MonthReservations from "./components/AdminPage/MonthReservations";
import AccountRequests from "./components/AdminPage/AccountRequests";
import AccountRequestFeedback from "./components/Authentication/AccountRequestFeedback";
import AccountsManage from "./components/AdminPage/AccountsManage";
import AddNewCar from "./components/AdminPage/AddNewCar";
function App() {
  let today = new Date();
  const [car, setCar] = useState();
  const [user, loading] = useAuthState(auth);
  const currentMonth = useRef(new Date());
  const [userInfo, setUserInfo] = useState({
    firstName: "null",
  });
  const init = React.useRef(true);
  const [schedule, setSchedule] = useState(null);
  const [carlist, setCarlist] = useState(null);
  const [viewingRes, setViewingRes] = useState([]);
  const [viewingID, setViewingID] = useState([]);
  const getData = async (month) => {
    let data = [];
    let dataTimeframe = `${month.getFullYear()}-${convertMonth(
      month.getMonth(),
    )}`;
    const querySnapshot = await getDocs(
      collection(db, "data-timeframe", dataTimeframe, "reservations"),
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data.push(newData);
    });
    currentMonth.current = month;
    today = month;
    setSchedule(data);
  };

  const getCarList = async () => {
    let data = [];
    const querySnapshot = await getDocs(collection(db, "carlist"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data.push(newData);
    });
    setCarlist(data);
  };

  const getUserInfo = async () => {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    if (!window.localStorage.getItem("driver")) {
      window.localStorage.setItem("driver", "");
    }
  };
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="animate-bounce">
          <GiCarWheel className="animate-spin" size={100} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/complete-booking" element={<Authentication />} />
          <Route path="/current-reservations" element={<Authentication />} />
          <Route path="/focus-reservation" element={<Authentication />} />
          <Route path="/back-work" element={<Authentication />} />
          <Route path="/my-reservations" element={<Authentication />} />
          <Route path="/admin-page" element={<Authentication />} />
          <Route path="/receit" element={<Authentication />} />
          <Route path="/admin-car" element={<Authentication />} />
          <Route path="/staff-page" element={<Authentication />} />
          <Route path="/add-staff" element={<Authentication />} />
          <Route
            path="/account-request-feedback"
            element={<AccountRequestFeedback />}
          />
          <Route
            path="/complete-registration"
            element={<CompleteRegistration />}
          />
        </Routes>
      </Router>
    );
  }

  if (init.current) {
    getCarList();
    getUserInfo();
    getData(today);
    init.current = false;
  }

  const bookTimeF = async (data) => {
    await bookTime(data);
  };

  const removeFromSchedule = (id) => {
    let arr = schedule;
    let index;
    for (let i = 0; i < schedule.length; i++) {
      if (schedule[i].id == id) {
        index = i;
        break;
      }
    }
    arr.splice(index, 1);
    setSchedule(arr);
  };

  const updateFocusing = async (id, booking) => {
    let data = [];
    let month = new Date(booking.data.startDate.seconds * 1000);

    await updateData(month);

    let dataTimeframe = `${month.getFullYear()}-${convertMonth(
      month.getMonth(),
    )}`;

    const querySnapshot = await getDocs(
      collection(db, "data-timeframe", dataTimeframe, "reservations"),
    );
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data.push(newData);
    });

    let y = data.filter((e) => {
      return e.id == id;
    });

    return new Promise((resolve) => {
      resolve(y[0]);
    });
  };

  const updateData = (month) => {
    today = month;
    getData(month);
  };

  const getDataRange = async (dates) => {
    setSchedule([]);
    let currentMonth = dates[0];
    let data = [];
    let months = [];
    while (dates[1].getMonth() + 1 !== currentMonth.getMonth()) {
      months.push(currentMonth);
      currentMonth = currentMonth.addMonths(1);
    }
    months.forEach(async (element) => {
      let dataTimeframe = `${element.getFullYear()}-${convertMonth(
        element.getMonth(),
      )}`;
      const querySnapshot = await getDocs(
        collection(db, "data-timeframe", dataTimeframe, "reservations"),
      );
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const newData = { id: doc.id, data: doc.data() };
        data.push(newData);
      });
      if (element.getMonth() == dates[1].getMonth()) {
        setSchedule(data);
      }
    });
  };

  const updateDataRange = (dates) => {
    if (
      dates[0].getMonth() == currentMonth.current.getMonth() ||
      currentMonth.current.getMonth() == dates[1].getMonth()
    ) {
      getDataRange(dates);
    }
  };

  if (userInfo.firstName == "null" && carlist === null) {
    return (
      <div>
        <div className="w-screen h-screen bg-white flex items-center justify-center">
          <div className>
            <AiOutlineLoading
              className="animate-spin text-primary-2"
              size={40}
            />
          </div>
        </div>
      </div>
    );
  }
  console.log("loop count");

  return (
    <Router className="w-screen overflow-hidden h-screen">
      <Navigation userInfo={userInfo} getData={(month) => getData(month)} />
      <Routes>
        <Route
          path="/"
          element={
            <Bookcar
              setCar={(name) => setCar(name)}
              schedule={schedule}
              userid={user.uid}
              userInfo={userInfo}
              bookTimeF={(data) => bookTimeF(data)}
              carlist={carlist}
              today={new Date()}
              updateData={() => updateData(today)}
              resetDate={(date) => getData(date)}
            />
          }
        />
        <Route
          path="/complete-booking"
          element={
            <CompleteBooking
              schedule={schedule}
              car={car}
              user={user}
              userInfo={userInfo}
              updateData={(month) => updateData(month)}
              getDataRange={(months) => updateDataRange(months)}
            />
          }
        />
        <Route
          path="/current-reservations"
          element={<CurrentBookings schedule={schedule} />}
        />
        <Route
          path="/focus-reservation"
          element={
            <FocusReservation
              updateData={() => updateData(today)}
              userid={user.uid}
              updateFocusing={(id, data) => updateFocusing(id, data)}
              viewingID={viewingID}
            />
          }
        />
        <Route path="/back-work" element={<Backend schedule={schedule} />} />
        <Route
          path="/receit"
          element={<Receit updateData={() => updateData(new Date())} />}
        />
        <Route path="/manage-accounts" element={<AccountsManage />} />
        <Route
          path="/my-reservations"
          element={
            <ViewCost
              user={user}
              carlist={carlist}
              userid={user.uid}
              updateData={() => updateData(today)}
            />
          }
        />
        <Route
          path="/admin-page"
          element={
            <Admin
              user={user}
              carlist={carlist}
              userid={user.uid}
              updateData={() => updateData(today)}
              viewingID={viewingID}
              viewingRes={viewingRes}
              setViewingID={(id) => setViewingID(id)}
              setViewingRes={(res) => setViewingRes(res)}
            />
          }
        />
        <Route
          path="/admin-car"
          element={
            <AdminPage
              user={user}
              carlist={carlist}
              userid={user.uid}
              updateData={() => updateData(today)}
              viewingID={viewingID}
              viewingRes={viewingRes}
              setViewingID={(id) => setViewingID(id)}
              setViewingRes={(res) => setViewingRes(res)}
            />
          }
        />
        <Route
          path="/month-reservations"
          element={
            <MonthReservations
              user={user}
              userid={user.uid}
              carlist={carlist}
              updateData={() => updateData(today)}
              viewingID={viewingID}
              viewingRes={viewingRes}
              setViewingID={(id) => setViewingID(id)}
              setViewingRes={(res) => setViewingRes(res)}
            />
          }
        />
        AccountRequests
        <Route
          path="/complete-registration"
          element={
            <Bookcar
              setCar={(name) => setCar(name)}
              schedule={schedule}
              userid={user.uid}
              userInfo={userInfo}
              bookTimeF={(data) => bookTimeF(data)}
              carlist={carlist}
              today={today}
              updateData={() => updateData(today)}
            />
          }
        />
        <Route path="/staff-page" element={<StaffPage />} />
        <Route path="/account-requests" element={<AccountRequests />} />
        <Route path="/add-staff" element={<AddStaff />} />
        <Route path="/admin-new-car" element={<AddNewCar />} />
      </Routes>
    </Router>
  );
}

Date.prototype.addMonths = function (months) {
  var date = new Date(this.valueOf());
  date.setMonth(date.getMonth() + months);
  return date;
};

const convertMonth = (month) => {
  switch (month) {
    case 0:
      return "january";
    case 1:
      return "february";
    case 2:
      return "march";
    case 3:
      return "april";
    case 4:
      return "may";
    case 5:
      return "june";
    case 6:
      return "july";
    case 7:
      return "august";
    case 8:
      return "september";
    case 9:
      return "october";
    case 10:
      return "november";
    default:
      return "december";
  }
};
export default App;
