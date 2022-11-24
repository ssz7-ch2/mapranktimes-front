import { useEffect, useState } from "react";
import { msToTime, secToDate } from "../utils/timeString";

const TimeLeft = ({ beatmapSets, filter, setBeatmapSets, className, onClick, showEarly }) => {
  const [timeLeft, setTimeLeft] = useState(NaN);
  const [time, setTime] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      setTime(new Date(Math.ceil(date.getTime() / 1000) * 1000));
      if (beatmapSets === null || beatmapSets.length === 0) {
        setTimeLeft(NaN);
        return;
      }

      // update rankEarly
      for (const beatmapSet of beatmapSets) {
        if (date < secToDate(beatmapSet.rde ?? beatmapSet.rd)) break;
        let updateBeatmapSets = false;
        if (beatmapSet.re && date > Math.ceil((beatmapSet.rde * 1000) / 600000) * 600000) {
          beatmapSet.re = false;
          updateBeatmapSets = true;
        }
        if (updateBeatmapSets) setBeatmapSets([...beatmapSets]);
      }

      let beatmapSet = beatmapSets[0];

      if (filter !== null) {
        const filteredSets = beatmapSets.filter(filter);

        if (filteredSets.length === 0) {
          setTimeLeft(NaN);
          return;
        }

        beatmapSet = filteredSets[0];
      }

      let rankDate = beatmapSet.rd * 1000;
      if (showEarly && beatmapSet.re) rankDate = beatmapSet.rde * 1000;

      setTimeLeft(Math.floor(rankDate / 60000) * 60000 - date);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [beatmapSets, setBeatmapSets, filter, showEarly]);

  return (
    <div className={className}>
      <div className={timeLeft < 0 ? `w-[268.63px] md:w-[345.38px] flex flex-row-reverse` : null}>
        <h1
          style={{ color: timeLeft <= 0 ? "#1FA009" : undefined }}
          className="font-mono text-[56px] md:text-7xl font-bold leading-none cursor-pointer"
          onClick={onClick}
        >
          {msToTime(timeLeft)}
        </h1>
      </div>
      <div>
        <h1 className="font-mono text-neutral-600 text-2xl md:text-4xl font-bold leading-none whitespace-nowrap -m-1.5 md:-m-3">
          {time?.toLocaleTimeString() ?? "\u00A0"}
        </h1>
      </div>
    </div>
  );
};

export default TimeLeft;
