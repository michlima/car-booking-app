import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../backend/firebase";
import { BookingCardAdmin } from "../BookCar/BookingCard";
import {
  AiFillCar,
  AiOutlineUser,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { IoChevronBackOutline } from "react-icons/io5";
import { useWindowSize } from "../utils/utils";
import { makeSuper, updateCarInfo } from "../../backend/utils";
import Switch from "react-switch";
import Input from "../Input";

const AdminPage = (props) => {
  const [updated, setUpdated] = useState(false);
  const [users, setUsers] = useState();
  const [viewingRes, setViewingRes] = useState(props.viewingRes);
  const [viewingID, setViewingID] = useState(null);
  const [showUsers, setShowUsers] = useState(true);
  const [carlist, setCarList] = useState();
  const [carID, setCarID] = useState();
  const [carInfos, setCarInfos] = useState({
    available: true,
    cost: "",
    fuel: "",
    id: "",
    kms: "",
    lightsStatus: "",
    lightsWorking: true,
    name: "",
    notes: "",
    status: "",
  });

  useEffect(() => {
    getData();
    getCarList();
  }, []);
  const getData = async () => {
    let data = [];
    let data2 = [];

    const querySnapshot = await getDocs(collection(db, "user-reservations"));
    const querySnapshot2 = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data.push(newData);
    });
    querySnapshot2.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data2.push(newData);
    });

    setUsers(data2);
    if (viewingID) {
      setViewingID((prev) => ({
        ...prev,
        isSuper: !viewingID.isSuper,
      }));
    }
  };

  const getCarList = async () => {
    let data = [];
    const querySnapshot = await getDocs(collection(db, "carlist"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const newData = { id: doc.id, data: doc.data() };
      data.push(newData);
    });
    setCarList(data);
  };

  if (!users) {
    return <div>Loading...</div>;
  }

  const setViews = async (id, firstName, lastName, isSuper) => {
    getMyRes(id);
    let name = firstName + " " + lastName;
    setViewingID({
      id: id,
      name: name,
      isSuper: isSuper,
    });
  };

  const getMyRes = async (id) => {
    let data = [];
    const querySnapshot = await getDocs(
      collection(db, "user-reservations", id, "my-reservations")
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
    console.log("getting my res");
    setViewingRes(data);
  };

  const saveSearch = () => {
    props.setViewingID(viewingID);
    props.setViewingRes(viewingRes);
  };
  console.log(viewingID);
  console.log(viewingRes);

  const buttonCls = "py-2 px-5 bg-white drop-shadow-lg m-4 duration-200";
  const buttonClickedCls =
    "py-2 px-5 bg-sky-800 text-white drop-shadow-lg m-4 duration-200 scale-125";

  const ShowUsers = () => {
    const [width, height] = useWindowSize();

    let grid = "grid grid-cols-2";

    if (width > 400) grid = "grid grid-cols-3";

    if (width > 600) grid = "grid grid-cols-2";

    if (width > 800) grid = "grid grid-cols-4";

    if (width > 1000) grid = "grid grid-cols-5";

    if (width > 1200) grid = "grid grid-cols-6";

    if (width > 1400) grid = "grid grid-cols-7";

    if (width > 1600) grid = "grid grid-cols-8";

    return (
      <div className={grid}>
        {users.map((e, index) => {
          return (
            <button
              key={index}
              onClick={() =>
                setViews(
                  e.id,
                  e.data.firstName,
                  e.data.lastName,
                  e.data.isSuper
                )
              }
              className="duration-500 bg-white hover:bg-blue-200 rounded-lg drop-shadow-md  p-2 py-3 border m-2 translate-y-2 "
            >
              {e.data.firstName + " " + e.data.lastName}
            </button>
          );
        })}
      </div>
    );
  };

  const upgradeAccount = async () => {
    await makeSuper(viewingID.id, viewingID.isSuper);
    getData();
  };

  const postInfos = async () => {
    await updateCarInfo(carID, carInfos);
    getCarList();
  };

  const handleInput = async (label, value) => {
    setCarInfos((prevData) => ({
      ...prevData,
      [label]: value,
    }));
  };

  console.log(carInfos);

  return (
    <div className="flex h-screen items-center bg-white flex-col p-2 pt-20 select-none z-10">
      <p className="text-lg my-2">Admin Page</p>
      <div className="gap-5">
        <button
          onClick={() => setShowUsers(true)}
          className={showUsers ? buttonClickedCls : buttonCls}
        >
          <AiOutlineUser size={50} />
        </button>
        <button
          onClick={() => setShowUsers(false)}
          className={showUsers ? buttonCls : buttonClickedCls}
        >
          <AiFillCar size={50} />
        </button>
      </div>
      {showUsers ? (
        <div>
          {viewingID ? (
            <div className=" w-screen px-5 bg-slate-300">
              <div className="flex flex-row p-6 w-full relative items-center justify-center">
                <button
                  className=" absolute left-2 mr-10 bg-white drop-shadow-md rounded-lg p-3"
                  onClick={() => setViewingID(null)}
                >
                  <IoChevronBackOutline size={30} />
                </button>
                <p className="text-2xl w-full text-center">{viewingID.name}</p>
                {!viewingID.isSuper ? (
                  <button
                    className=" duration-1000 absolute right-2 ml-10 bg-white drop-shadow-md rounded-lg p-3"
                    onClick={() => upgradeAccount()}
                  >
                    <AiOutlineStar size={30} />
                  </button>
                ) : (
                  <button
                    className=" duration-1000  absolute right-2 ml-10 bg-white text-yellow-400 drop-shadow-md rounded-lg p-3"
                    onClick={() => upgradeAccount(null)}
                  >
                    <AiFillStar size={30} />
                  </button>
                )}
              </div>
              <div className="flex flex-row overflow-x-auto w-full ">
                {viewingRes.map((o) => {
                  const e = o.data;
                  let date = new Date(e.startDate.seconds * 1000);
                  return (
                    <div className="flex h-[37rem]">
                      <BookingCardAdmin
                        data={e}
                        e={o}
                        date={date}
                        userid={viewingID.id}
                        carlist={props.carlist}
                        from="/admin-page"
                        updateData={() => getMyRes()}
                        saveSearch={() => saveSearch()}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <ShowUsers />
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          <div className="w-full flex flex-row items-center justify-center">
            {carlist.map((e, index) => {
              console.log(e);
              return (
                <button
                  onClick={() => {
                    setCarInfos(e.data);
                    setCarID(e.id);
                    setUpdated(false);
                  }}
                  key={index}
                  className={
                    e.id === carID
                      ? "duration-200 bg-sky-800 text-white rounded-lg drop-shadow-md  p-2 py-3 border m-2 "
                      : "duration-200 bg-white hover:bg-blue-200 rounded-lg drop-shadow-md  p-2 py-3 border m-2 "
                  }
                >
                  {" "}
                  {e.data.name}{" "}
                </button>
              );
            })}
          </div>
          <div className="m-5 flex flex-col gap-7 items-start">
            <div className="flex flex-row">
              <div className="flex flex-row">
                {" "}
                <p className="text-lg mx-2">Available</p>
                <Switch
                  // height={28}
                  // width={56}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onChange={(e) =>
                    setCarInfos((prev) => ({ ...prev, available: e }))
                  }
                  checked={carInfos.available}
                />
              </div>
              <div className="flex flex-row">
                {" "}
                <p className="text-lg mx-2">Lights</p>
                <Switch
                  uncheckedIcon={false}
                  checkedIcon={false}
                  onChange={(e) =>
                    setCarInfos((prev) => ({ ...prev, lightsWorking: e }))
                  }
                  checked={carInfos.lightsWorking}
                />
              </div>
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">Cost:</p>
              <Input
                startValue={carInfos.cost}
                class={"editInfo"}
                label="cost"
                placeholder={carInfos.cost}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">Fuel:</p>
              <Input
                startValue={carInfos.fuel}
                class={"editInfo"}
                label="fuel"
                placeholder={carInfos.fuel}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">id:</p>
              <Input
                startValue={carInfos.id}
                class={"editInfo"}
                label="id"
                placeholder={carInfos.id}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">Lights:</p>
              <Input
                startValue={carInfos.lightsStatus}
                class={"editInfo"}
                label="lightsStatus"
                placeholder={carInfos.lightsStatus}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">status:</p>
              <Input
                startValue={carInfos.status}
                class={"editInfo"}
                label="status"
                placeholder={carInfos.status}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
            <div className="flex flex-row">
              <p className="text-lg mx-2 w-20">Notes:</p>
              <Input
                startValue={carInfos.notes}
                class={"editInfo"}
                label="notes"
                placeholder={carInfos.notes}
                handleInput={(label, value) => handleInput(label, value)}
              />
            </div>
          </div>
          {updated ? (
            <div
              onClick={() => {
                postInfos();
                setUpdated(!updated);
              }}
              className="duration-200 text-center bg-emerald-600 w-[50%] text-white rounded-lg drop-shadow-md  p-2 py-3 border m-2  "
            >
              Updated
            </div>
          ) : (
            <button
              onClick={() => {
                postInfos();
                setUpdated(!updated);
              }}
              className="duration-200 bg-sky-800 w-[50%] text-white rounded-lg drop-shadow-md  p-2 py-3 border m-2  "
            >
              Save
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
