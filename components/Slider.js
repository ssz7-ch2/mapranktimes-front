import { useEffect, useState } from "react";
import ReactSlider from "react-slider";

const Slider = ({ setExternalValue, saveValue, defaultValue }) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="w-full flex px-2 items-center">
      <ReactSlider
        className="w-full h-10 slider flex items-center cursor-pointer"
        trackClassName="h-2 pointer-fine:h-1 slider-track"
        thumbClassName="h-4 w-4 pointer-fine:h-2 pointer-fine:w-4 bg-yellow rounded-full outline-none slider-thumb"
        onChange={(value) => {
          setValue(value);
          setExternalValue(value);
        }}
        onAfterChange={(value) => saveValue(value)}
        value={value}
      />
    </div>
  );
};

export default Slider;
