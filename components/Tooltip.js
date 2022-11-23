import Tippy from "@tippyjs/react";
import { useState } from "react";

const isMobile = () => typeof matchMedia !== "undefined" && matchMedia("(pointer:coarse)").matches;

const Tooltip = ({ children, content, theme }) => {
  const [timeoutId, setTimeoutId] = useState(null);
  return (
    <Tippy
      content={content}
      animation="fade"
      theme={theme}
      offset={[0, 5]}
      duration={[200, 150]}
      delay={[500, null]}
      className="px-2 py-0.5"
      onTrigger={(instance) => {
        if (isMobile())
          setTimeoutId(
            setTimeout(() => {
              instance.hide();
            }, 3000)
          );
      }}
      onHide={() => {
        clearTimeout(timeoutId);
      }}
      trigger={isMobile() ? "click" : "mouseenter focus"}
    >
      {children}
    </Tippy>
  );
};

export default Tooltip;
