import React, { createRef, useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import Tooltip from "../Tooltip";
import { secToDate, secToTime } from "../../utils/timeString";
import BeatmapsInfo from "./BeatmapsInfo";
import { debounce } from "lodash";
import { audioPlayer } from "../../utils/audio";
import Image from "../Image";

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
          <Image
            className="h-full select-none object-cover"
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
            alt="beatmap image"
            storageId={beatmapSet.queue_date ? `Q${beatmapSet.id}` : `R${beatmapSet.id}`}
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
            <Image
              className="absolute z-0 object-cover w-full h-full blur-lg brightness-[0.3] select-none"
              src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
              alt="beatmap cover"
              storageId={beatmapSet.queue_date ? `Q${beatmapSet.id}` : `R${beatmapSet.id}`}
              delayed={true}
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
                          <img
                            key={`${mode}${i}`}
                            src={`/icons/mode${mode}.svg`}
                            alt="spinner icon"
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
                <img
                  src="/icons/spinners.svg"
                  alt="spinner icon"
                  width={18}
                  height={18}
                  className="select-none overflow-hidden"
                />

                <h2 className="w-min whitespace-nowrap text-xs">{getDiffString(beatmapSet)}</h2>
              </div>

              {/* Length */}
              <div className="flex items-center gap-1.5 w-max pr-3">
                <img
                  src="/icons/length.svg"
                  alt="length icon"
                  width={18}
                  height={18}
                  className="select-none overflow-hidden"
                />
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
