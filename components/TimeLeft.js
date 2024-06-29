import { useEffect, useState } from "react";
import { msToTime, secToDate } from "../utils/timeString";

const TimeLeft = ({
  beatmapSets,
  filter,
  setBeatmapSets,
  className,
  onClick,
  showEarly,
  probability,
}) => {
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
      let updateBeatmapSets = false;
      for (const beatmapSet of beatmapSets) {
        if (date < secToDate(beatmapSet.rank_date_early ?? beatmapSet.rank_date)) break;

        // if 12 minutes have passed since the ranking process started
        // the map can't be ranked early anymore
        if (
          beatmapSet.probability &&
          beatmapSet.probability >= probability &&
          date > Math.ceil((beatmapSet.rank_date_early * 1000) / 600000) * 600000 + 120000
        ) {
          beatmapSet.probability = 0;
          beatmapSet.rank_date_early = beatmapSet.rank_date;
          updateBeatmapSets = true;
        }
      }
      if (updateBeatmapSets) setBeatmapSets([...beatmapSets]);

      // filter out unresolved maps
      const filteredSets = beatmapSets
        .filter(filter)
        .filter((beatmapSet) => !beatmapSet.unresolved);

      if (filteredSets.length === 0) {
        setTimeLeft(NaN);
        return;
      }

      let beatmapSet = filteredSets[0];

      let rankDate = beatmapSet.rank_date * 1000;
      if (showEarly && beatmapSet.probability !== null && beatmapSet.probability >= probability)
        rankDate = beatmapSet.rank_date_early * 1000;

      setTimeLeft(Math.floor(rankDate / 60000) * 60000 - date);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [beatmapSets, setBeatmapSets, filter, showEarly, probability]);

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
