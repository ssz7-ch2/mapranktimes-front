import { useEffect, useState } from "react";

const ToggleSwitch = ({
  switchWidth,
  color,
  content,
  value,
  setValue,
  condition,
  className,
  textAfter = false,
}) => {
  const [isOn, setIsOn] = useState(value);
  const handleToggleClick = () => {
    setIsOn(!isOn);
    setValue(!isOn && (condition?.call() ?? true));
  };

  useEffect(() => {
    setIsOn(value);
  }, [value]);

  return (
    <div
      className={`flex flex-row items-center cursor-pointer ${className}`}
      onClick={handleToggleClick}
    >
      {!textAfter && content}
      <div
        style={{ width: switchWidth }}
        className="relative flex flex-row items-center justify-center"
      >
        <span
          style={{
            height: switchWidth * 0.37,
            width: switchWidth * 0.75,
            backgroundColor: color,
            opacity: isOn ? 0.5 : 0.4,
            filter: `saturate(${isOn ? 1 : 0})`,
          }}
          className="rounded-full transition-all duration-75"
        ></span>
        <span
          style={{
            height: switchWidth * 0.5,
            width: switchWidth * 0.5,
            backgroundColor: color,
            left: isOn ? switchWidth * 0.5 : 0,
            filter: `saturate(${isOn ? 1 : 0})`,
          }}
          className="absolute rounded-full z-10 transition-all duration-75"
        ></span>
      </div>
      {textAfter && content}
    </div>
  );
};

export default ToggleSwitch;
