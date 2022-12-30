import { chunk } from "lodash";
import BeatmapSet from "./BeatmapSet";
import VirtualList from "../VirtualList";

const beatmapSetList = ({ items, touchDevice, showEarly, allModes, probability }) => (
  <div>
    {items.map((row) => (
      <div
        key={row.map((beatmapSet) => beatmapSet.id).join("-")}
        className="flex flex-row w-full gap-3 md:gap-5 mb-3 md:mb-5"
      >
        {row.map((beatmapSet) => {
          return (
            <div key={beatmapSet.id} className="w-full md:w-1/2">
              <BeatmapSet
                beatmapSet={beatmapSet}
                touchDevice={touchDevice}
                showEarly={showEarly}
                allModes={allModes}
                probability={probability}
              />
            </div>
          );
        })}
      </div>
    ))}
  </div>
);

const BeatmapSetList = ({
  beatmapSets,
  filter,
  touchDevice,
  largeScreen,
  showEarly,
  allModes,
  probability,
}) => {
  const filteredBeatmapSets = beatmapSets?.filter((beatmapSet) => filter(beatmapSet)) ?? [];
  return (
    filteredBeatmapSets.length > 0 && (
      <VirtualList
        itemBuffer={5}
        itemHeight={largeScreen ? 164 : 124}
        items={chunk(filteredBeatmapSets, largeScreen ? 2 : 1)}
      >
        {({ items }) => beatmapSetList({ items, touchDevice, showEarly, allModes, probability })}
      </VirtualList>
    )
  );
};

export default BeatmapSetList;
