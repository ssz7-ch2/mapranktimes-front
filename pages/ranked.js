import { useEffect, useRef, useState } from "react";
import BeatmapList from "../components/Beatmap/BeatmapSetList";
import ToggleSwitch from "../components/ToggleSwitch";
import Head from "next/head";
import FilterTextBox from "../components/FilterTextBox";
import { audioPlayer } from "../utils/audio";
import Slider from "../components/Slider";
import { debounce } from "lodash";
import supabase from "../utils/supabase";

const detectMediaChange = (mediaQuery, setValue, callback) => {
  const mql = matchMedia(mediaQuery);
  setValue && setValue(mql.matches);
  if (callback) callback(mql.matches);

  const onMediaChange = (e) => {
    setValue && setValue(e.matches);
    if (callback) callback(e.matches);
  };
  mql.addEventListener("change", onMediaChange);
};

const closeVolumeSlider = debounce((target) => {
  target.style.bottom = "-40px";
}, 1000);

let isOverSlider = false;

const Home = () => {
  const [beatmapSets, setBeatmapSets] = useState(null);
  const [touchDevice, setTouchDevice] = useState(false);
  const [largeScreen, setLargeScreen] = useState(true);
  const [filter, setFilter] = useState({ string: null, applyFilter: null });
  const [filterOn, setFilterOn] = useState(false);
  const [defaultVolume, setDefaultVolume] = useState(70);
  const [selectedMode, _setSelectedMode] = useState(0); // -1 All, 0 osu, 1 taiko, 2 catch, 3 mania
  const volumeSliderRef = useRef();

  const modeList = ["osu", "taiko", "catch", "mania"];

  const setSelectedMode = (mode) => {
    _setSelectedMode((prevMode) => {
      if (prevMode === mode && mode !== -1) {
        localStorage.setItem("mode", -1);
        return -1;
      } else {
        localStorage.setItem("mode", mode);
        return mode;
      }
    });
  };

  const audioSetup = () => {
    audioPlayer.setUp();
    audioPlayer.setOnPause(() => {
      if (!isOverSlider) closeVolumeSlider(volumeSliderRef.current);
    });
    audioPlayer.setOnPlay(() => {
      closeVolumeSlider.cancel();
      volumeSliderRef.current.style.bottom = "0px";
    });
    const volume = localStorage.getItem("volume");
    if (volume) {
      audioPlayer.setVolume(parseInt(volume));
      setDefaultVolume(parseInt(volume));
    }
  };

  useEffect(() => {
    const mode = localStorage.getItem("mode");
    if (mode) {
      _setSelectedMode(parseInt(mode));
    }

    const getBeatmapSets = async () => {
      const res = await fetch("/api/getranked");
      const data = await res.json();

      data.forEach((updatedBeatmapSet) => {
        updatedBeatmapSet.beatmaps = JSON.parse(updatedBeatmapSet.beatmaps);
      });

      const updatedBeatmapSets = data.sort((a, b) => b.rank_date - a.rank_date);

      setBeatmapSets(updatedBeatmapSets);

      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("R") &&
          updatedBeatmapSets.findIndex((beatmapSet) => beatmapSet.id === parseInt(key.slice(1))) ===
            -1
        ) {
          localStorage.removeItem(key);
        }
      });
    };

    getBeatmapSets();

    // add event listener for detecting if user is on touch device
    detectMediaChange("(pointer:coarse)", setTouchDevice);
    detectMediaChange("(min-width:48em)", setLargeScreen, (value) => {
      if (value === false) setFilterOn(true);
    });

    audioSetup();

    return () => {
      audioPlayer.stop();
    };
  }, []);

  return (
    <div>
      <Head>
        <title>Map Rank Times</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ffdd55" />
        <meta name="msapplication-TileColor" content="#603cba" />
        <meta name="theme-color" content="#ffdd55"></meta>
      </Head>
      <main className="min-h-screen font-sans flex flex-col w-full items-center text-center px-3 md:px-5 mx-auto md:max-w-[1024px] max-w-[448px]">
        <h1 className="font-mono font-bold text-3xl md:text-4xl mt-6 mb-3 md:mt-8 md:mb-4">
          Ranked Maps
        </h1>
        <div className="flex items-center leading-none mb-2 md:mb-3 gap-2 font-light text-[17px]">
          <button
            title={`${beatmapSets?.length ?? 0} maps`}
            className="opacity-60 hover:opacity-100 transition-opacity"
            style={{
              opacity: selectedMode === -1 ? 1 : undefined,
              color: selectedMode === -1 ? "#FFDD55" : undefined,
            }}
            onClick={() => setSelectedMode(-1)}
          >
            Any
          </button>
          {modeList.map((mode, i) => (
            <button
              title={`${
                beatmapSets?.filter((beatmapSet) =>
                  beatmapSet.beatmaps.some((beatmap) => beatmap.mode == i)
                ).length ?? 0
              } maps`}
              key={`${mode}${i}`}
              className="opacity-60 hover:opacity-100 transition-opacity"
              style={{
                opacity: selectedMode === i ? 1 : undefined,
                filter:
                  selectedMode === i
                    ? "brightness(0) saturate(100%) invert(75%) sepia(80%) saturate(326%) hue-rotate(358deg) brightness(101%) contrast(105%)"
                    : undefined,
              }}
              onClick={() => (selectedMode === i ? setSelectedMode(-1) : setSelectedMode(i))}
            >
              <img
                src={`/icons/mode${i}.svg`}
                alt="spinner icon"
                width={18}
                height={18}
                className="select-none overflow-hidden"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-row gap-5 mb-3 md:mb-5 w-full items-center justify-center">
          <div className="hidden md:block">
            <ToggleSwitch
              switchWidth={40}
              color="#FFDD55"
              value={filterOn}
              setValue={setFilterOn}
              condition={() => filter.string !== null}
              content={<p className="select-none pt-[1.6px]">Enable Filter</p>}
              className={`font-mono whitespace-nowrap gap-3`}
              textAfter={true}
            />
          </div>

          <FilterTextBox
            className="w-full md:w-96 text-lg"
            setFilter={setFilter}
            setFilterOn={setFilterOn}
          />
        </div>

        <div className="flex-grow w-full">
          {beatmapSets?.length === 0 ? (
            <h1>Server dead or restarting (takes like 5 min if restarting)</h1>
          ) : (
            <BeatmapList
              beatmapSets={
                selectedMode === -1
                  ? beatmapSets
                  : beatmapSets
                      ?.filter((beatmapSet) =>
                        beatmapSet.beatmaps.some((beatmap) => beatmap.mode == selectedMode)
                      )
                      .map((beatmapSet) => {
                        return {
                          ...beatmapSet,
                          beatmaps: beatmapSet.beatmaps.filter(
                            (beatmap) => beatmap.mode == selectedMode
                          ),
                        };
                      })
              }
              filter={filterOn && filter.applyFilter ? filter.applyFilter : () => true}
              touchDevice={touchDevice}
              largeScreen={largeScreen}
              showEarly={false}
              allModes={selectedMode === -1}
              probability={1}
            />
          )}
        </div>

        <footer className="mb-2 -mt-1 md:-mt-3 w-full">
          <div className="text-center text-xs text-neutral-600">
            <a href="https://osu.ppy.sh/users/sometimes" target="_blank" rel="noreferrer">
              osu!
            </a>{" "}
            - <span className="select-all cursor-pointer">sometimes#9353</span> -{" "}
            <a href="https://anilist.co/user/sometimes/" target="_blank" rel="noreferrer">
              AniList
            </a>{" "}
          </div>
        </footer>
      </main>

      <div
        className="fixed bottom-[-40px] h-min w-full flex flex-row justify-end z-[500] transition-all pointer-events-none"
        ref={volumeSliderRef}
        onMouseEnter={() => {
          if (!touchDevice) isOverSlider = true;
        }}
        onMouseLeave={() => {
          if (!touchDevice) {
            if (!audioPlayer.isPlaying()) closeVolumeSlider(volumeSliderRef.current);
            isOverSlider = false;
          }
        }}
      >
        <div
          className="w-full md:w-96 flex flex-row items-center bg-neutral-800 md:rounded-tl pl-3.5 pointer-events-auto"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,0.6)" }}
        >
          <span className="whitespace-nowrap font-medium text-sm">Audio Volume</span>
          <Slider
            setExternalValue={(value) => audioPlayer.setVolume(value)}
            saveValue={(value) => localStorage.setItem("volume", value)}
            defaultValue={defaultVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
