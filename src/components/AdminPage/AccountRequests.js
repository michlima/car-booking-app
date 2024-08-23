import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { Link } from "react-router-dom";
import {
  accountRequestAccept,
  accountRequestDelete,
  accountResquetsGet,
} from "../../backend/utils";

const AccountRequests = () => {
  const [accountRequests, setAccountRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState({});
  const getData = async () => {
    let data = await accountResquetsGet();
    console.log(data);
    setAccountRequests(data);
  };
  useEffect(() => {
    getData();
  }, []);

  const rejectAccountCreation = async (id) => {
    let res = await accountRequestDelete(id);
    if (res) {
      getData();
      setErrorMessage({
        message: "Request removed",
        cls: "text-green-500", // succefull process
      });
    } else {
      setErrorMessage({
        message:
          "Could not delete request, check you internet connection and try again later",
        cls: "text-rose-500", // error  in process
      });
    }
  };

  const acceptAccountCreation = async (userInfo, id) => {
    try {
      let res = await accountRequestAccept(userInfo);
      console.log(res);
      if (res) {
        await accountRequestDelete(id);
        getData();
        setErrorMessage({
          message: "Request Aprroved, user can now log in",
          cls: "text-green-500", // error  in process
        });
      } else {
        setErrorMessage({
          message:
            "Error on approving request, please check internet connection and try again",
          cls: "text-rose-500", // error  in process
        });
      }
    } catch (error) {
      return false;
    }
    return true;
  };

  const RequestTicket = ({ userInfo, id }) => {
    return (
      <div className="w-100 flex flex-row  p-5 border-b-4 border-grey-400">
        <div className="flex flex-col">
          <text className="text-lg">
            {userInfo.firstName} {userInfo.lastName}
          </text>
          <text>{userInfo.email}</text>
        </div>
        <div className="w-full"></div>
        <div className="gap-10 flex flex-row">
          <button
            onClick={() => acceptAccountCreation(userInfo, id)}
            className="text-green-600"
          >
            Aprove
          </button>
          <button
            onClick={() => rejectAccountCreation(id)}
            className="text-rose-600"
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className=" w-screen flex items-center flex-col  bg-white p-2 select-none z-10">
      <div className="flex flex-row align-center w-full">
        <div className="w-full">
          <Link to="/admin-page" className=" flex mt-4">
            <MdArrowBack size={20} />
          </Link>
        </div>
        <h3 className="w-full  text-center">Account Requests</h3>
        <div className="w-full"></div>
      </div>
      <text className={errorMessage.cls}>{errorMessage.message}</text>
      <div className="w-full">
        {accountRequests.map((e, index) => {
          return <RequestTicket key={index} id={e.id} userInfo={e.data} />;
        })}
      </div>
    </div>
  );
};

export default AccountRequests;
