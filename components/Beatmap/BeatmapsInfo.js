import React from "react";
import Image from "next/image";
import { secToTime } from "../../utils/timeString";
import { scaleLinear } from "d3-scale";
import { interpolateRgb } from "d3-interpolate";
import useDelayUnmount from "../useDelayUnmount";

const difficultyColourSpectrum = scaleLinear()
  .domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
  .clamp(true)
  .range([
    "#4290FB",
    "#4FC0FF",
    "#4FFFD5",
    "#7CFF4F",
    "#F6F05C",
    "#FF8068",
    "#FF4E6F",
    "#C645B8",
    "#6563DE",
    "#18158E",
    "#000000",
  ])
  .interpolate(interpolateRgb.gamma(2.2));

const mapDiffColor = (difficulty) => {
  if (difficulty < 0.1) return "#AAAAAA";
  if (difficulty >= 9) return "#000000";
  return difficultyColourSpectrum(difficulty);
};

const BeatmapsInfo = ({ beatmaps, moreInfo, handleMouseEnter, handleMouseLeave }) => {
  const shouldRender = useDelayUnmount(moreInfo, 150);

  const mountedStyle = {
    opacity: 1,
    animation: "fadeIn 200ms ease-in-out",
  };
  const unmountedStyle = {
    opacity: 0,
    transition: "opacity 150ms ease-in-out",
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
            {beatmaps.map((beatmap, i) => (
              <React.Fragment key={`${i}${beatmap.id}`}>
                <div className="flex flex-row gap-1 items-center">
                  <img
                    src="/icons/spinners.svg"
                    alt="spinner icon"
                    width={14}
                    height={14}
                    className="select-none"
                  />
                  <p>{beatmap.s}</p>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <img
                    src="/icons/length.svg"
                    alt="length icon"
                    width={14}
                    height={14}
                    className="select-none"
                  />
                  <p>{secToTime(beatmap.l)}</p>
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
                <p className="font-normal truncate">{beatmap.v}</p>
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
