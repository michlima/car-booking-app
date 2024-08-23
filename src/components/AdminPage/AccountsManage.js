import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usersGet } from "../../backend/utils";
import { MdArrowBack } from "react-icons/md";

const AccountsManage = () => {
  const [users, setUsers] = useState([]);
  const getUsersInfo = async () => {
    let usersInfo = await usersGet();
    console.log(usersInfo);
    setUsers(usersInfo);
  };

  useEffect(() => {
    getUsersInfo();
  }, []);

  const UserDiv = ({ userInfo, id }) => {
    console.log(userInfo);
    return (
      <div className=" p-10 border-b-4 border-grey-400">
        {" "}
        <h5>
          {userInfo.firstName} {userInfo.lastName}
        </h5>
      </div>
    );
  };

  return (
    <div className="w-100 flex flex-col p-5 h-screen">
      <div className="flex flex-row align-center w-full">
        <div className="w-full">
          <Link to="/admin-page" className=" flex mt-4">
            <MdArrowBack size={20} />
          </Link>
        </div>
        <h3 className="w-full  text-center">Manage Accounts</h3>
        <div className="w-full"></div>
      </div>
      <div className="h-80 overflow-scroll">
        {users.map((e) => {
          return <UserDiv userInfo={e.data} />;
        })}
      </div>
    </div>
  );
};

export default AccountsManage;
