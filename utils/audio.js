export const audioPlayer = (function () {
  let audio;
  let target;
  let onPlay;
  let onPause;

  const handlePause = () => {
    if (target) target.dataset.audioState = "paused";
    if (onPause) onPause();
  };
  const handlePlay = () => {
    if (target) target.dataset.audioState = "playing";
    if (onPlay) onPlay();
  };

  return {
    setUp: function () {
      audio = new Audio();
      audio.onpause = handlePause;
      audio.onplay = handlePlay;
    },
    stop: function () {
      audio.pause();
    },
    // public interface
    playAudio: function (current, src) {
      if (audio.src == src) {
        if (!audio.paused) {
          audio.pause();
        } else {
          audio.play();
        }
      } else {
        if (target) target.dataset.audioState = "paused";
        audio.src = src;
        audio.load();
        audio.play();
        target = current;
      }
    },
    setState: function (current, src) {
      if (audio?.src == src) {
        target = current;
        if (!audio.paused) current.dataset.audioState = "playing";
      }
    },
    setVolume: function (volume) {
      audio.volume = volume / 100;
    },
    getVolume: function () {
      return (audio?.volume ?? 0.7) * 100;
    },
    setOnPlay: function (func) {
      onPlay = func;
    },
    setOnPause: function (func) {
      onPause = func;
    },
    isPlaying: function () {
      return !audio?.paused ?? false;
    },
  };
})();
