import React from "react";
import useDelayUnmount from "./useDelayUnmount";

const Dialog = ({ opacity = 0.5, className, children, dialogOpen, setDialogOpen }) => {
  const shouldRender = useDelayUnmount(dialogOpen, 100);
  const mountedStyle = {
    opacity: 1,
    animation: "fadeIn 150ms ease-in-out",
  };
  const unmountedStyle = {
    opacity: 0,
    transition: "opacity 100ms ease-in-out",
  };
  return (
    shouldRender && (
      <div
        className="fixed flex items-center justify-center top-0 left-0 w-screen h-screen z-[1000]"
        style={dialogOpen ? mountedStyle : unmountedStyle}
      >
        <div
          className="absolute w-full h-full bg-black cursor-pointer"
          style={{ opacity: opacity }}
          onClick={() => setDialogOpen(false)}
        ></div>
        <div className={`z-[1001] ${className}`}>{children}</div>
      </div>
    )
  );
};

export default Dialog;
