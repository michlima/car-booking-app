import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";
import { GoSignOut } from "react-icons/go";
import { auth } from "../backend/firebase";
import "./nav.css";
import TopBarBmController from "./TopBarBmController";

const Navigation = (props) => {
  const [barOpen, setBarOpen] = useState(false);
  const [bmZIndez, setZIndex] = useState(-1);
  const [bmWidth, setBMWidth] = useState("0%");

  console.log(props);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  let buttoncls =
    "duration-200 text-white w-48 flex justify-center  h-full flex items-center justify-center";

  const signOut = () => {
    navigate("/");
    auth.signOut();
  };
  console.log(props);

  const menuText =
    "text-xl pb-5  hover:bg-blue-500 w-full py-5 px-10 hover:pl-20 duration-500";

  const whenHome = () => {
    setMenuOpen(!menuOpen);
    props.getData(new Date());
  };
  console.log(props.userInfo);
  const navigation = (path) => {
    closeMenu();
    navigate(path);
  };
  const BarMenu = () => {
    return (
      <div
        style={{
          color: barOpen ? "grey" : "white",
          height: "100%",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {[
          { name: "Home", path: "/", access: true },
          { name: "My Reservations", path: "/my-reservations", access: true },
          {
            name: "Admin",
            path: "/admin-page",
            access: props.userInfo.isSuper,
          },
        ].map((link) => {
          if (link.access) {
            return (
              <button
                style={{
                  textAlign: "left",
                  fontSize: "15px",
                  padding: "0.5rem",
                  minWidth: "10rem",
                }}
                onClick={() => navigation(link.path)}
              >
                {link.name}
              </button>
            );
          }
        })}
      </div>
    );
  };
  const closeMenu = () => {
    setBarOpen(false);
    setZIndex(-1);
    setBMWidth("0%");
  };
  const openBM = () => {
    setBarOpen(!barOpen);
    if (bmZIndez < 30) {
      setZIndex(50);
      setBMWidth("100%");
    } else {
      setZIndex(-1);
      setBMWidth("0%");
    }
  };

  return (
    <div className=" z-40  top-0 duration-200 w-full flex bg-white bg-white h">
      <div className="w-full bg-slate-800">
        <div className="flex text-white p-4">
          <button onClick={() => openBM()} style={{ zIndex: 99 }}>
            {barOpen ? (
              <IoCloseSharp size={20} className="text-black" />
            ) : (
              <RxHamburgerMenu size={20} />
            )}
          </button>
          <h4 style={{ width: "100%", textAlign: "center" }}>BB Carpool</h4>
          <button onClick={() => signOut()} style={{ zIndex: 99 }}>
            <GoSignOut size={20} />
          </button>
        </div>
        <div
          style={{
            position: "absolute",
            width: "75%",
            top: 0,
            left: 0,
            zIndex: bmZIndez,
            height: "100%",
            background: "white",
          }}
        >
          <TopBarBmController open={barOpen} widthGrowth={bmWidth}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
                background: "white",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <BarMenu />
            </div>
          </TopBarBmController>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
