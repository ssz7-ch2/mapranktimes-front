import React, { createRef, useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import Tooltip from "../Tooltip";
import { secToDate, secToTime } from "../../utils/timeString";
import BeatmapsInfo from "./BeatmapsInfo";
import { debounce } from "lodash";
import { audioPlayer } from "../../utils/audio";
import ModeIcon from "../ModeIcon";

const formatDate = (date) => {
  return `${date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })}`;
};

const getDiffString = (beatmapSet) =>
  `${beatmapSet.beatmaps.filter((beatmap) => beatmap.spin > 0).length} / ${
    beatmapSet.beatmaps.length
  } Diff${beatmapSet.beatmaps.length == 1 ? "" : "s"}`;

const handleMouse = debounce((setMoreInfo, value) => {
  setMoreInfo(value);
}, 300);

const BeatmapSet = ({ beatmapSet, touchDevice, showEarly, allModes, probability }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const ref = createRef();
  const date =
    beatmapSet.probability !== null && beatmapSet.probability >= probability && showEarly
      ? beatmapSet.rank_date_early
      : beatmapSet.rank_date;
  const tooltipDate =
    beatmapSet.probability !== null && beatmapSet.probability >= probability && !showEarly
      ? beatmapSet.rank_date_early
      : beatmapSet.rank_date;

  const handleMouseEnter = () => {
    if (!touchDevice) {
      handleMouse(setMoreInfo, true);
    }
  };

  const handleMouseLeave = () => {
    if (!touchDevice) {
      handleMouse(setMoreInfo, false);
    } else {
      setMoreInfo(false);
    }
  };

  const handleClick = () => {
    if (touchDevice) setMoreInfo(!moreInfo);
  };

  useEffect(() => {
    audioPlayer.setState(ref.current, `https://b.ppy.sh/preview/${beatmapSet.id}.mp3`);
  }, []);

  return (
    <div
      className="relative"
      onMouseLeave={() => {
        handleMouse.cancel();
        setMoreInfo(false);
      }}
    >
      <div
        className="flex flex-row w-full h-28 md:h-36 overflow-hidden rounded-[12px]"
        style={{ filter: beatmapSet.unresolved ? "brightness(0.5)" : null }}
      >
        {/* List Square Image */}
        <div
          className="relative flex-shrink-0 w-28 md:w-36 cursor-pointer"
          ref={ref}
          onClick={() => {
            audioPlayer.playAudio(ref.current, `https://b.ppy.sh/preview/${beatmapSet.id}.mp3`);
          }}
          data-audio-state="paused"
        >
          <img
            className="h-full select-none object-cover"
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
            alt="beatmap image"
          />
          <div className="absolute flex items-center justify-center bg-[rgba(0,0,0,0.6)] top-0 left-0 w-full h-full play-icon">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="play"
              className="w-6 md:w-7 absolute play-button"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="pause"
              className="w-[23px] md:w-[27px] absolute pause-button"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path
                fill="currentColor"
                d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="relative w-full h-full text-left bg-neutral-900 overflow-hidden">
          {/* Background Cover Image */}
          <a
            href={touchDevice ? undefined : `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
            target={touchDevice ? undefined : "_blank"}
            rel="noreferrer"
          >
            <img
              className="absolute z-0 object-cover w-full h-full blur-lg brightness-[0.3] select-none"
              src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
              alt="beatmap cover"
            />
          </a>

          <div className="flex flex-col h-full w-full justify-between absolute z-10 px-1.5 md:px-2.5 pt-1 md:pt-2 pb-1.5 md:pb-2 max-w-full pointer-events-none">
            {/* Title & Artist */}
            <a
              href={`https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
              target={"_blank"}
              className={touchDevice ? "pointer-events-auto" : undefined}
              rel="noreferrer"
            >
              <div className="flex flex-col gap-[1.6px]">
                <div className="flex gap-1">
                  {allModes && (
                    <div className="flex items-center gap-[3px] shrink-0">
                      {beatmapSet.beatmaps
                        .reduce(
                          (modes, beatmap) =>
                            modes.includes(beatmap.mode) ? modes : [...modes, beatmap.mode],
                          []
                        )
                        .sort()
                        .map((mode, i) => (
                          <ModeIcon
                            mode={mode}
                            key={`${mode}${i}`}
                            width={15}
                            height={15}
                            className="select-none overflow-hidden"
                          />
                        ))}
                    </div>
                  )}
                  <h1 className="w-min max-w-full font-bold truncate leading-min">
                    {beatmapSet.title}
                  </h1>
                </div>

                <h1 className="w-min max-w-full font-light text-xs truncate leading-min">
                  {beatmapSet.artist}
                </h1>
              </div>
            </a>

            {/* Mapper */}
            <h2 className="w-min font-extralight text-[10px] whitespace-nowrap text-neutral-300 pointer-events-auto leading-min">
              mapped by{" "}
              <a
                href={`https://osu.ppy.sh/users/${beatmapSet.mapper_id}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="font-medium opacity-100 text-neutral-50">{beatmapSet.mapper}</span>
              </a>
            </h2>

            {/* Rank Date */}
            <Tooltip
              theme="black"
              content={
                <p className="text-center text-xs">
                  {beatmapSet.unresolved
                    ? "Will be ranked when mapper resolves mod"
                    : `*Rank Early Probability: ${
                        beatmapSet.probability === null
                          ? "Unknown"
                          : (beatmapSet.probability * 100).toFixed(2) + "%"
                      }`}
                  <br />
                  <b>
                    {secToDate(tooltipDate).toLocaleDateString("default", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </b>{" "}
                  <span style={{ color: "#B8D3E0" }}>
                    {secToDate(tooltipDate)
                      .toLocaleTimeString("default", {
                        hour: "numeric",
                        minute: "numeric",
                        timeZoneName: "shortOffset",
                      })
                      .replace("GMT", "UTC")}
                  </span>
                </p>
              }
            >
              <h1
                data-for={`${beatmapSet.id}`}
                data-tip
                className="w-min text-yellow font-bold text-xl whitespace-nowrap pointer-events-auto leading-min my-0.5"
              >
                {beatmapSet.unresolved ? "Unresolved mod" : formatDate(secToDate(date))}
                {beatmapSet.probability !== null && beatmapSet.probability >= probability ? (
                  <>
                    *
                    <div className="text-[11px] font-light inline-block pl-[1px] pt-[2px] align-top">
                      {(beatmapSet.probability * 100).toFixed(probability == 0 ? 2 : 0)}%
                    </div>
                  </>
                ) : (
                  ""
                )}
              </h1>
            </Tooltip>

            {/* Diffs & Length */}
            <a
              className="flex md:flex-col gap-2 md:gap-1 w-full pointer-events-auto"
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              href={touchDevice ? undefined : `https://osu.ppy.sh/beatmapsets/${beatmapSet.id}`}
              target={touchDevice ? undefined : "_blank"}
              rel="noreferrer"
            >
              {/* Diffs */}
              <div className="flex items-center gap-1.5 min-w-[88px] w-max">
                <svg
                  width={18}
                  height={18}
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

                <h2 className="w-min whitespace-nowrap text-xs">{getDiffString(beatmapSet)}</h2>
              </div>

              {/* Length */}
              <div className="flex items-center gap-1.5 w-max pr-3">
                <svg
                  width={18}
                  height={18}
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
                <h2 className="w-min text-xs">{secToTime(beatmapSet.beatmaps[0].len)}</h2>
              </div>
            </a>
          </div>

          {/* More Info Button */}
          {touchDevice ? (
            <div
              className="absolute text-lg flex items-center justify-center w-[28.8px] md:w-9 h-[28.8px] md:h-9 right-0 bottom-0 leading-4 opacity-50"
              style={{ zIndex: moreInfo ? 31 : 20 }}
              onClick={() => setMoreInfo(!moreInfo)}
              onMouseLeave={() => setMoreInfo(false)}
            >
              <span className="leading-none">ⓘ</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Beatmap Hover More Info */}
      <BeatmapsInfo
        beatmaps={beatmapSet.beatmaps}
        moreInfo={moreInfo}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        allModes={allModes}
        unresolved={beatmapSet.unresolved}
      />
    </div>
  );
};

export default BeatmapSet;
