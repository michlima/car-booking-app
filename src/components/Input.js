import React, { useEffect, useState } from "react";

// props needed: label, type, handleInput
const Input = (props) => {
  const [value, setValue] = useState("");
  const [cls, setCls] = useState(props.errors);

  const handleChange = (e) => {
    const { value } = e.target;
    setValue(value);
    props.handleInput(props.label, value);
  };

  useEffect(() => {
    const cls = props.error
      ? "px-2.5  backdrop-blur-xl bg-white border-rose-400 border w-full rounded-lg h-10 text-black"
      : "px-2.5  backdrop-blur-xl bg-white border w-full rounded-lg h-10 text-black";
    setCls(cls);
  }, [props]);

  return (
    <div className=" flex flex-col items-center justify-center w-68 max-w-xs  w-5/6 mb-5 lowercase ">
      <input
        className={cls}
        type={props.type}
        value={value}
        placeholder={props.placeholder}
        onChange={handleChange}
      />
    </div>
  );
};

export default Input;
