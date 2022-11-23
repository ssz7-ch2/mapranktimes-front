export const secToTime = (duration) => {
  let minutes = Math.floor(duration / 60),
    seconds = duration % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `${minutes}:${seconds}`;
};

export const msToTime = (milliseconds) => {
  if (isNaN(milliseconds)) return "00:00:00";
  milliseconds = Math.floor(milliseconds / 1000) * 1000;
  let negative = false;
  if (milliseconds < 0) {
    negative = true;
    milliseconds *= -1;
  }
  let hours = Math.floor(milliseconds / (1000 * 60 * 60)),
    minutes = Math.floor((milliseconds / (1000 * 60)) % 60),
    seconds = Math.floor((milliseconds / 1000) % 60);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return `${negative ? "-" : ""}${hours}:${minutes}:${seconds}`;
};

export const secToDate = (seconds) => new Date(seconds * 1000);
