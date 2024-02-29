import React, { useState } from "react";

const Clock = (props) => {
  const [value, setValue] = useState();

  const handleClock = (value) => {
    props.handleClock(value);
    setValue((value) => value + 1);
  };

  if (props.hour) {
    return (
      <div className="relative flex text-md w-40 h-40 items-center justify-center text-blue-800 rounded-full bg-white">
        <button
          onClick={() => handleClock(`12`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-lg left-50% top-1 "
        >
          {" "}
          {props.am ? props.hours[0] : props.hours[12]}
        </button>
        <button
          onClick={() => handleClock(`1`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           top-[20px] right-[30px]"
        >
          {" "}
          {props.am ? props.hours[1] : props.hours[13]}
        </button>
        <button
          onClick={() => handleClock(`2`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           top-[40px] right-[11px]"
        >
          {" "}
          {props.am ? props.hours[2] : props.hours[14]}
        </button>
        <button
          onClick={() => handleClock(`3`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute  text-lg  top-50% right-1"
        >
          {" "}
          {props.am ? props.hours[3] : props.hours[15]}
        </button>
        <button
          onClick={() => handleClock(`4`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           bottom-[40px] right-[11px]"
        >
          {props.am ? props.hours[4] : props.hours[16]}
        </button>
        <button
          onClick={() => handleClock(`5`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           bottom-[20px] right-[30px]"
        >
          {props.am ? props.hours[5] : props.hours[17]}
        </button>
        <button
          onClick={() => handleClock(`6`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute  text-lg  bottom-1 right-50%"
        >
          {" "}
          {props.am ? props.hours[6] : props.hours[18]}
        </button>
        <button
          onClick={() => handleClock(`7`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           bottom-[20px] left-[30px]"
        >
          {" "}
          {props.am ? props.hours[7] : props.hours[19]}
        </button>
        <button
          onClick={() => handleClock(`8`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           bottom-[40px] left-[11px]"
        >
          {" "}
          {props.am ? props.hours[8] : props.hours[20]}
        </button>
        <button
          onClick={() => handleClock(`9`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute  text-lg  top-50% left-1"
        >
          {" "}
          {props.am ? props.hours[9] : props.hours[21]}
        </button>
        <button
          onClick={() => handleClock(`10`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute          top-[40px] left-[11px]"
        >
          {" "}
          {props.am ? props.hours[10] : props.hours[22]}
        </button>
        <button
          onClick={() => handleClock(`11`)}
          className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute          top-[20px] left-[30px]"
        >
          {" "}
          {props.am ? props.hours[11] : props.hours[23]}
        </button>
        <button
          onClick={() => props.setIsAm()}
          className={
            props.am
              ? "duration-200 absolute bg-white shadow-lg w-12 rounded-lg"
              : "duration-200 absolute bg-gray-400 shadow-lg w-12 rounded-lg"
          }
        >
          {props.am ? "am" : "pm"}
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex text-md w-40 h-40 items-center justify-center text-blue-800 rounded-full bg-white">
      <button
        onClick={() => handleClock(`00`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute left-50% top-1 "
      >
        00
      </button>
      <button
        onClick={() => handleClock(`05`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           top-[20px] right-[30px]"
      >
        05
      </button>
      <button
        onClick={() => handleClock(`10`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute           top-[40px] right-[11px]"
      >
        10
      </button>
      <button
        onClick={() => handleClock(`15`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute top-50% right-1"
      >
        15
      </button>
      <button
        onClick={() => handleClock(`20`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm bottom-[40px] right-[11px]"
      >
        20
      </button>
      <button
        onClick={() => handleClock(`25`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm bottom-[20px] right-[30px]"
      >
        25
      </button>
      <button
        onClick={() => handleClock(`30`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute bottom-1 right-50%"
      >
        30
      </button>
      <button
        onClick={() => handleClock(`35`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm bottom-[20px] left-[30px]"
      >
        35
      </button>
      <button
        onClick={() => handleClock(`40`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm bottom-[40px] left-[11px]"
      >
        40
      </button>
      <button
        onClick={() => handleClock(`45`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute top-50% left-1"
      >
        45
      </button>
      <button
        onClick={() => handleClock(`50`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm top-[40px] left-[11px]"
      >
        50
      </button>
      <button
        onClick={() => handleClock(`55`)}
        className="duration-200 hover:bg-gray-100 w-8 rounded-full absolute text-sm top-[20px] left-[30px]"
      >
        55
      </button>
    </div>
  );
};

export default Clock;
