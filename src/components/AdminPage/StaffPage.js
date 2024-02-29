import React from "react";
import { Link } from "react-router-dom";

const StaffPage = () => {
  return (
    <div className=" w-screen flex items-center flex-col  bg-white p-2 pt-20 select-none z-10">
      <p className="text-lg my-2">Staffs</p>
      <Link
        to="/add-staff"
        className="m-20 bg-slate-700 px-6 py-3 text-white rounded-lg"
      >
        Add Staff
      </Link>
    </div>
  );
};

export default StaffPage;
