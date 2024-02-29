import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCarAlt, FaSignOutAlt } from "react-icons/fa";
import { BsFillCalendar2DayFill } from "react-icons/bs";
import { BiTrip } from "react-icons/bi";
import { auth } from "../backend/firebase";
import { slide as Menu } from "react-burger-menu";
import logo from "./pictures/ywam-logo.png";
import "./nav.css";

const Navigation = (props) => {
  console.log(props);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  let buttoncls =
    "duration-200 text-white w-48 flex justify-center  h-full flex items-center justify-center";

  const signOut = () => {
    navigate("/");
    auth.signOut();
  };
  const showSettings = (event) => {
    event.preventDefault();
  };
  const menuText =
    "text-xl pb-5  hover:bg-blue-500 w-full py-5 px-10 hover:pl-20 duration-500";
  var isMenuOpen = function (state) {
    return false;
  };

  const whenHome = () => {
    setMenuOpen(!menuOpen);
    props.getData(new Date());
  };

  return (
    <div className=" z-40 fixed top-0 duration-200 w-screen flex bg-slate-800 h-20  bg-white">
      <Menu
        className="no-scrollbar"
        isOpen={menuOpen}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
      >
        <Link onClick={() => whenHome()} to="/" className={menuText + " mt-20"}>
          <p>Reserve Car</p>
        </Link>
        <Link
          onClick={() => setMenuOpen(!menuOpen)}
          to="/my-reservations"
          className={menuText}
        >
          <p>My reservations</p>
        </Link>
        {props.userInfo.isSuper ? (
          <Link
            onClick={() => setMenuOpen(!menuOpen)}
            to="/admin-page"
            className={menuText}
          >
            <p>Admin</p>
          </Link>
        ) : (
          <></>
        )}

        <div className="w-full flex items-center justify-center mt-[100%]">
          <img src={logo} className=" w-full px-28" />
          <p className="text-slate-200 font-semibold text-center">bb carpool</p>
        </div>
        <div className="absolute bottom-3 w-full">
          <a className="text-[0.7rem] text-gray-400 w-full flex justify-center italic text-center">
            beta version- 3.0.0
          </a>
        </div>
      </Menu>
      <button className={buttoncls + " absolute right-0 "} onClick={signOut}>
        Log out
        <FaSignOutAlt className="ml-4" size={20} />
      </button>
    </div>
  );
};

export default Navigation;
