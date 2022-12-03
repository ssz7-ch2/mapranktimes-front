import { useEffect, useRef, useState } from "react";
import BeatmapList from "../components/Beatmap/BeatmapSetList";
import ToggleSwitch from "../components/ToggleSwitch";
import TimeLeft from "../components/TimeLeft";
import Head from "next/head";
import FilterTextBox from "../components/FilterTextBox";
import Dialog from "../components/Dialog";
import { audioPlayer } from "../utils/audio";
import Slider from "../components/Slider";
import { debounce } from "lodash";
import { secToDate } from "../utils/timeString";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultVolume, setDefaultVolume] = useState(70);
  const [showEarly, setShowEarly] = useState(null);
  const volumeSliderRef = useRef();

  const getLocalBeatmapSets = () => {
    const localBeatmapSets = localStorage.getItem("beatmapSets");
    if (localBeatmapSets) {
      const beatmapSets = JSON.parse(localBeatmapSets);
      if (beatmapSets[0].rd) {
        setBeatmapSets(
          beatmapSets.filter(
            (beatmapSet) => Date.now() - secToDate(beatmapSet.rd).getTime() < 10 * 60000
          )
        );
      } else {
        // remove old version
        localStorage.removeItem("beatmapSets");
        console.log("removed old beatmapsets");
      }
      console.log("local beatmapsets loaded");
    }
  };

  const newVisitor = () => {
    const visited = localStorage.getItem("visited");
    if (visited === null) {
      localStorage.setItem("visited", "");
      setDialogOpen(true);
    }
  };

  const connectServer = () => {
    let events = new EventSource("https://mapranktimes.onrender.com/beatmapsets?stream");

    events.onmessage = (event) => {
      const updatedBeatmapSets = JSON.parse(event.data);
      if (updatedBeatmapSets.length > 0) {
        setBeatmapSets(updatedBeatmapSets);
        localStorage.setItem("beatmapSets", event.data);
        console.log("beatmapsets updated", new Date().toISOString());
      }
    };

    const handleError = async (event) => {
      switch (event.target.readyState) {
        case EventSource.CONNECTING:
          console.log(
            "An error occurred while attempting to connect to server. Reconnecting in 10 sec..."
          );
          await new Promise((resolve) => setTimeout(resolve, 10000));
          break;
        case EventSource.CLOSED:
          console.log(
            "An error occurred while attempting to connect to server. Trying again in 1 min..."
          );
          await new Promise((resolve) => setTimeout(resolve, 60000));
          events = new EventSource("https://mapranktimes.onrender.com/beatmapsets?stream");
          events.onerror = handleError;
          break;
      }
    };

    events.onerror = handleError;

    return events;
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
    if (showEarly !== null) localStorage.setItem("showEarly", showEarly);
  }, [showEarly]);

  useEffect(() => {
    // First attempt to get beatmapSets from localStorage
    getLocalBeatmapSets();

    const showEarly = localStorage.getItem("showEarly");
    if (showEarly) {
      setShowEarly(showEarly == "true");
    } else {
      setShowEarly(false);
    }

    // set up SSE connection and get beatmapSets
    const events = connectServer();

    // add event listener for detecting if user is on touch device
    detectMediaChange("(pointer:coarse)", setTouchDevice);
    detectMediaChange("(min-width:48em)", setLargeScreen, (value) => {
      if (value === false) setFilterOn(true);
    });

    audioSetup();

    newVisitor();

    return () => {
      events.close();
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
        <TimeLeft
          beatmapSets={beatmapSets}
          filter={filterOn && filter.applyFilter ? filter.applyFilter : () => true}
          setBeatmapSets={setBeatmapSets}
          className="mt-12 mb-6 md:mt-16 md:mb-9"
          onClick={() => setDialogOpen(!dialogOpen)}
          showEarly={showEarly}
        />
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
            <h1>Server dead or restarting (takes like 1 min if restarting)</h1>
          ) : (
            <BeatmapList
              beatmapSets={beatmapSets}
              filter={filterOn && filter.applyFilter ? filter.applyFilter : () => true}
              touchDevice={touchDevice}
              largeScreen={largeScreen}
              showEarly={showEarly}
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

      <Dialog
        className={`w-full max-w-[576px] max-h-[65%] overflow-y-scroll bg-scroll pointer-fine:hide-scroll text-center
          bg-neutral-800 mx-3 px-2 py-3 md:px-5 md:py-4 rounded-md shadow-2xl shadow-black`}
        opacity={0.7}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      >
        <h1 className="font-bold text-4xl mt-4 leading-none">Info</h1>
        <div className="text-xs text-neutral-500 mb-1">
          Contact:{" "}
          <a href="https://osu.ppy.sh/users/sometimes" target="_blank" rel="noreferrer">
            osu!
          </a>{" "}
          - <span className="select-all cursor-pointer">sometimes#9353</span>
        </div>
        <p className="text-sm font-normal mb-1 text-yellow">
          *Click on timer to open this info dialog again*
        </p>
        <hr className="border-neutral-400 mt-3" />
        <div className="font-extralight text-center">
          <div className="px-2">
            <h2 className="text-xl mt-3 font-medium">Timer</h2>
            <p>
              If timer is <span className="text-[#1FA009] font-normal">green</span>, then the next
              map is being ranked. Map will disappear from page when map is ranked.
            </p>
            <hr className="border-neutral-400 mt-3" />
            <h2 className="text-xl mt-3 font-medium">Filter</h2>
            <p>
              <span className="text-neutral-300">Filter terms: </span>
              <b>spin</b>, <b>stars</b>, <b>len</b>
            </p>
            <div>
              <span className="text-sm text-neutral-300">Example: </span>
              <div className="font-mono bg-black my-0.5 py-0.5 px-2 rounded inline-block">
                spin{">"}0 stars{"<="}3 len{"<"}120
              </div>
            </div>
            <p>
              will show mapsets with map(s) that have more than 0 spinners, are at most 3 stars, and
              are shorter than 2 min.
            </p>
            <hr className="border-neutral-400 mt-3" />
            <h2 className="text-xl mt-3 font-medium">Rank Early</h2>
            <p>
              Maps with <span className="text-yellow font-medium">*</span> are likely to be ranked
              early. The number after <span className="text-yellow font-medium">*</span> is the
              probability. Note - the rank early time shown is the earliest possible time the map
              can get ranked, not the exact time.
            </p>
            <hr className="border-neutral-400 mt-3" />
            <h2 className="text-xl mt-3 font-medium text-center">More Info</h2>
            <div className="mx-auto text-left text-sm">
              <ul className="list-disc ml-4 marker:text-neutral-400">
                <li>All times are in local time</li>
                <li>
                  Page usually auto updates within 5 sec of rank event and within 5 min for other
                  events
                </li>
                <li>Most maps are ranked within 8 minutes (~99% of maps)</li>
                <li>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1bCgPBLKmHQkkviqOc3UJVy2NMggSeo8zhMVP7Yde97M/edit?usp=sharing"
                    target="_blank"
                    className="text-neutral-400"
                    rel="noreferrer"
                  >
                    Old Google Sheets Link
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/ssz7-ch2/mapranktimes-back/blob/main/README.md"
                    target="_blank"
                    className="text-neutral-400"
                    rel="noreferrer"
                  >
                    In depth explanation of how rank times are calculated
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex justify-center mt-2">
              <ToggleSwitch
                switchWidth={35}
                color="#FFDD55"
                value={showEarly}
                setValue={setShowEarly}
                content={<p className="select-none text-sm">Show Early Time</p>}
                className="whitespace-nowrap gap-2"
                textAfter
              />
            </div>
          </div>
        </div>
      </Dialog>

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
