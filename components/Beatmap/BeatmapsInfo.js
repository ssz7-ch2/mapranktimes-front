import React from "react";
import Image from "next/image";
import { secToTime } from "../../utils/timeString";
import useDelayUnmount from "../useDelayUnmount";
import mapDiffColor from "../../utils/mapDiffColor";

const BeatmapsInfo = ({
  beatmaps,
  moreInfo,
  handleMouseEnter,
  handleMouseLeave,
  allModes,
  unresolved,
}) => {
  const shouldRender = useDelayUnmount(moreInfo, 150);

  const mountedStyle = {
    opacity: 1,
    animation: "fadeIn 200ms ease-in-out",
    filter: unresolved ? "brightness(0.5)" : null,
  };
  const unmountedStyle = {
    opacity: 0,
    transition: "opacity 150ms ease-in-out",
    filter: unresolved ? "brightness(0.5)" : null,
  };

  return (
    shouldRender && (
      <React.Fragment>
        <span
          className="absolute bottom-0 left-0 w-full h-3 bg-[#353535] -z-20"
          style={moreInfo ? mountedStyle : unmountedStyle}
        ></span>
        <div
          className="absolute top-28 md:top-36 w-full z-30 opacity-0 pointer-course:pointer-events-none"
          style={moreInfo ? mountedStyle : unmountedStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className=" bg-[#353535] rounded-b-[12px] p-2 text-xs font-light text-left grid grid-cols-[max-content_max-content_max-content_auto] gap-y-0.5 gap-x-2">
            {beatmaps
              .sort((a, b) => a.mode - b.mode)
              .map((beatmap, i) => (
                <React.Fragment key={`${i}${beatmap.id}`}>
                  <div className="flex flex-row gap-1 items-center">
                    <img
                      src="/icons/spinners.svg"
                      alt="spinner icon"
                      width={14}
                      height={14}
                      className="select-none overflow-hidden"
                    />
                    <p>{beatmap.spin}</p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <img
                      src="/icons/length.svg"
                      alt="length icon"
                      width={14}
                      height={14}
                      className="select-none overflow-hidden"
                    />
                    <p>{secToTime(beatmap.len)}</p>
                  </div>
                  <p
                    className="rounded-full pl-1 pr-1.5 font-bold"
                    style={{
                      backgroundColor: mapDiffColor(beatmap.sr),
                      color: beatmap.sr < 6.5 ? "black" : "#FFD966",
                    }}
                  >
                    ★ {beatmap.sr.toFixed(2)}
                  </p>
                  <div className="flex flex-row gap-1 items-center overflow-hidden">
                    {allModes && (
                      <img
                        src={`/icons/mode${beatmap.mode}.svg`}
                        alt="spinner icon"
                        width={14}
                        height={14}
                        className="select-none overflow-hidden"
                      />
                    )}
                    <p className="font-normal truncate">{beatmap.ver}</p>
                  </div>
                </React.Fragment>
              ))}
          </div>
          <div className="absolute top-0 flex flex-col h-full w-full pointer-events-auto rounded-b-[12px] p-2 justify-between">
            {beatmaps.map((beatmap, i) => (
              <a
                key={`${i}${beatmap.id}`}
                href={`https://osu.ppy.sh/beatmaps/${beatmap.id}`}
                target="_blank"
                className="w-full h-[18px]"
                rel="noreferrer"
              ></a>
            ))}
          </div>
        </div>
      </React.Fragment>
    )
  );
};

export default BeatmapsInfo;
