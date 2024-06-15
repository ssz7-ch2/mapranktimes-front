import { debounce } from "lodash";
import { useEffect, useState } from "react";

const comparisonOperators = {
  "<": (a, b) => a < b,
  ">": (a, b) => a > b,
  "<=": (a, b) => a <= b,
  ">=": (a, b) => a >= b,
  "=": (a, b) => {
    b = String(b);
    const decimalPlaces = b.split(".")[1]?.length ?? 0;
    return a >= b && a < parseFloat(b) + Math.pow(10, -decimalPlaces);
  },
};

// beatmap[paramMap[param]]
const paramMap = {
  spin: "spin",
  spinners: "spin",
  sr: "sr",
  stars: "sr",
  len: "len",
  length: "len",
};

const isNumeric = (str) => !isNaN(str) && !isNaN(parseFloat(str));

const stringToFilter = (line) => {
  const filterStrings = line.toLowerCase().trim().split(" ");
  const filters = [];
  let filterUnresolved = false;

  const validStrings = [];
  filterStrings.forEach((filterString) => {
    if (filterString.length < 4) return;
    if (filterString === "unresolved") {
      filterUnresolved = true;
      validStrings.push(filterString);
      return;
    }
    const operator = filterString.match(/[<>=]+/);
    if (operator && operator[0] in comparisonOperators) {
      const [param, value] = filterString.split(operator[0]);
      if (param in paramMap && isNumeric(value)) {
        validStrings.push(filterString);
        filters.push((beatmap) =>
          comparisonOperators[operator[0]](beatmap[paramMap[param]], value)
        );
      }
    }
  });

  if (validStrings.length !== 0 || line.length === 0)
    localStorage.setItem("filter", validStrings.join(" "));
  if (filters.length === 0 && !filterUnresolved) return { string: null, applyFilter: null };

  return {
    string: validStrings.join(" "),
    applyFilter: function (beatmapSet) {
      if (filterUnresolved) return beatmapSet.unresolved;
      return beatmapSet?.beatmaps.some((beatmap) => filters.every((filter) => filter(beatmap)));
    },
  };
};

const updateFilter = debounce((line, setFilter, setFilterOn) => {
  const filter = stringToFilter(line);
  setFilter((prev) => {
    if (prev.string == filter.string) return prev;
    return filter;
  });
  if (line.length > 0) setFilterOn(true);
}, 500);

const FilterTextBox = ({ className, setFilter, setFilterOn }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    const localFilter = localStorage.getItem("filter");
    if (localFilter !== null) {
      setValue(localFilter);
      setFilter(() => stringToFilter(localFilter));
    }
  }, [setFilter]);

  return (
    <div className={`font-mono2 ${className}`}>
      <input
        className={` text-neutral-400 focus:text-neutral-300 bg-inherit appearance-none border
      border-neutral-600 focus:border-neutral-400 placeholder-neutral-700 rounded-[4px] py-1.5 px-3.5
        focus:outline-none focus:shadow-outline lowercase w-full text-center md:text-left`}
        id="username"
        type="text"
        placeholder="Filter"
        spellCheck={false}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setValue(e.currentTarget.value);
          updateFilter(e.currentTarget.value, setFilter, setFilterOn);
        }}
      ></input>
    </div>
  );
};

export default FilterTextBox;
