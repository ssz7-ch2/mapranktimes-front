import React from "react";
import { secToTime } from "../../utils/timeString";
import useDelayUnmount from "../useDelayUnmount";
import mapDiffColor from "../../utils/mapDiffColor";
import ModeIcon from "../ModeIcon";

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
                    <svg
                      width={14}
                      height={14}
                      className="select-none overflow-hidden"
                      role="img"
                      version="1.1"
                      viewBox="0 0 300 300"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="scale(1 -1)">
                        <path
                          d="m256.25-150c0-58.594-47.656-106.25-106.25-106.25s-106.25 47.656-106.25 106.25 47.656 106.25 106.25 106.25 106.25-47.656 106.25-106.25zm43.75 0c0 82.813-67.187 150-150 150-82.812 0-150-67.187-150-150 0-82.812 67.188-150 150-150 82.813 0 150 67.188 150 150z"
                          fill="#fd5"
                        />
                        <path
                          d="m144.02-156.58c-13.911-1.211-23.305-9.657-29.227-21.491-6.749-13.487-7.421-29.052 1.312-43.255 4.075-7.332 8.734-11.547 15.455-14.67 3.388-1.573 6.748-2.561 11.001-3.237 2.148-0.342 4.235-0.551 6.62-0.666 0.909-0.044 2.279-0.056 3.629-0.054 32.086 0.983 59.945 18.76 75.083 44.837l-0.06-0.036c-17.555-9.603-39.566-9.689-55.573-1.679-14.34 7.175-25.715 22.08-28.24 40.251zm-39.173-71.246c-9.603 17.555-9.689 39.566-1.679 55.573 7.175 14.34 22.08 25.715 40.251 28.24-1.211 13.911-9.657 23.305-21.491 29.227-13.487 6.749-29.052 7.421-43.255-1.312-7.332-4.075-11.547-8.734-14.67-15.455-1.574-3.388-2.561-6.748-3.237-11.001-0.342-2.148-0.551-4.235-0.666-6.62-0.044-0.909-0.056-2.279-0.054-3.629 0.983-32.086 18.76-59.945 44.837-75.083-0.012 0.02-0.024 0.04-0.036 0.06zm-32.674 122.99c17.555 9.603 39.566 9.689 55.573 1.679 14.34-7.175 25.715-22.08 28.24-40.251 13.911 1.211 23.305 9.657 29.227 21.491 6.749 13.487 7.421 29.052-1.312 43.255-4.075 7.332-8.734 11.547-15.455 14.67-3.388 1.573-6.748 2.561-11.001 3.237-2.148 0.342-4.235 0.551-6.62 0.666-0.909 0.044-2.279 0.056-3.629 0.054-32.086-0.983-59.945-18.76-75.083-44.837l0.06 0.036zm122.99 32.674c9.603-17.555 9.689-39.566 1.679-55.573-7.175-14.34-22.08-25.715-40.251-28.24 1.211-13.911 9.657-23.305 21.491-29.227 13.487-6.749 29.052-7.421 43.255 1.312 7.332 4.075 11.547 8.734 14.67 15.455 1.573 3.388 2.561 6.748 3.237 11.001 0.342 2.148 0.551 4.235 0.666 6.62 0.044 0.909 0.056 2.279 0.054 3.629-0.983 32.086-18.76 59.945-44.837 75.083 0.012-0.02 0.024-0.04 0.036-0.06z"
                          fill="#fd5"
                        />
                      </g>
                    </svg>
                    <p>{beatmap.spin}</p>
                  </div>
                  <div className="flex flex-row gap-1 items-center">
                    <svg
                      width={14}
                      height={14}
                      version="1.1"
                      viewBox="0 0 300 300"
                      className="select-none overflow-hidden"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g transform="scale(1 -1)">
                        <path
                          d="m175-81.25c0 3.516-2.734 6.25-6.25 6.25h-12.5c-3.516 0-6.25-2.734-6.25-6.25v-68.75h-43.75c-3.516 0-6.25-2.734-6.25-6.25v-12.5c0-3.516 2.734-6.25 6.25-6.25h62.5c3.516 0 6.25 2.734 6.25 6.25v87.5zm81.25-68.75c0-58.594-47.656-106.25-106.25-106.25s-106.25 47.656-106.25 106.25 47.656 106.25 106.25 106.25 106.25-47.656 106.25-106.25zm43.75 0c0 82.813-67.187 150-150 150-82.812 0-150-67.187-150-150 0-82.812 67.188-150 150-150 82.813 0 150 67.188 150 150z"
                          fill="#fd5"
                        />
                      </g>
                    </svg>
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
                      <ModeIcon
                        mode={beatmap.mode}
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
