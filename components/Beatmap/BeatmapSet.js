import React, { createRef, useEffect, useState } from "react";
import "tippy.js/dist/tippy.css";
import Tooltip from "../Tooltip";
import { secToTime } from "../../utils/timeString";
import BeatmapsInfo from "./BeatmapsInfo";
import { debounce } from "lodash";
import { audioPlayer } from "../../utils/audio";

const formatDate = (date) => {
  return `${date.toLocaleString("default", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })}`;
};

const getDiffString = (beatmapSet) =>
  `${beatmapSet.b.filter((beatmap) => beatmap.s > 0).length} / ${beatmapSet.b.length} Diff${
    beatmapSet.b.length == 1 ? "" : "s"
  }`;

const handleMouse = debounce((setMoreInfo, value) => {
  setMoreInfo(value);
}, 300);

const BeatmapSet = ({ beatmapSet, touchDevice, showEarly }) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const ref = createRef();
  const date = beatmapSet.re && showEarly ? beatmapSet.rde : beatmapSet.rd;
  const tooltipDate = beatmapSet.re && !showEarly ? beatmapSet.rde : beatmapSet.rd;

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
      <div className="flex flex-row w-full h-28 md:h-36 overflow-hidden rounded-[12px]">
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
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
            alt="beatmap image"
          />
          <div className="absolute flex items-center justify-center bg-[rgba(0,0,0,0.6)] top-0 left-0 w-full h-full play-icon">
            <span className="play-button text-[28px] md:text-4xl"></span>
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
              src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/card.jpg`}
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
                <h1 className="w-min max-w-full font-bold truncate leading-min">{beatmapSet.t}</h1>

                <h1 className="w-min max-w-full font-light text-xs truncate leading-min">
                  {beatmapSet.a}
                </h1>
              </div>
            </a>

            {/* Mapper */}
            <h2 className="w-min font-extralight text-[10px] whitespace-nowrap text-neutral-300 pointer-events-auto leading-min">
              mapped by{" "}
              <a
                href={`https://osu.ppy.sh/users/${beatmapSet.mi}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="font-medium opacity-100 text-neutral-50">{beatmapSet.m}</span>
              </a>
            </h2>

            {/* Rank Date */}
            <Tooltip
              theme="black"
              content={
                <p className="text-center text-xs">
                  {beatmapSet.re
                    ? `*May be ranked early (${(beatmapSet.p * 100).toFixed(1)}% chance)`
                    : ""}
                  {beatmapSet.re ? <br /> : null}
                  <b>
                    {new Date(tooltipDate).toLocaleDateString("default", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </b>{" "}
                  <span style={{ color: "#B8D3E0" }}>
                    {new Date(tooltipDate)
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
                {formatDate(new Date(date))}
                {beatmapSet.re ? (
                  <>
                    *
                    <div className="text-[11px] font-light inline-block pl-[1px] pt-[2px] align-top">
                      {(beatmapSet.p * 100).toFixed(0)}%
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
                  className="select-none"
                />

                {/* change hover to use actual div instead of title */}
                <h2 className="w-min whitespace-nowrap text-xs">{getDiffString(beatmapSet)}</h2>
              </div>

              {/* Length */}
              <div className="flex items-center gap-1.5 w-max pr-3">
                <img
                  src="/icons/length.svg"
                  alt="length icon"
                  width={18}
                  height={18}
                  className="select-none"
                />
                <h2 className="w-min text-xs">{secToTime(beatmapSet.b[0].l)}</h2>
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
        beatmaps={beatmapSet.b /* TODO: filter beatmaps by mode */}
        moreInfo={moreInfo}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default BeatmapSet;
