import React from "react";
import { useNavigate, Link } from "react-router-dom";

const Admin = () => {
  return (
    <div className=" w-screen flex items-center flex-col  bg-white p-2 pt-20 select-none z-10">
      <p className="text-lg my-2">Admin Page</p>
      <div>
        <Link
          to="/staff-page"
          className="py-2 px-5 bg-white drop-shadow-lg m-4 duration-200 hover:text-white hover:bg-sky-800"
        >
          Staffs
        </Link>
        <Link
          to="/admin-car"
          className="py-2 px-5 bg-white drop-shadow-lg m-4 duration-200 hover:text-white hover:bg-sky-800"
        >
          Car Bookings
        </Link>
        <Link
          to="/month-reservations"
          className="py-2 px-5 bg-white drop-shadow-lg m-4 duration-200 hover:text-white hover:bg-sky-800"
        >
          This Month
        </Link>
      </div>
    </div>
  );
};

export default Admin;
