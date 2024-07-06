export const secToDate = (seconds: number) => new Date(seconds * 1000);

export const formatDate = (date: Date) => {
	return `${date.toLocaleString('default', {
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric'
	})}`;
};

export const secToTime = (duration: number) => {
	let minutes = Math.floor(duration / 60);
	let seconds: number | string = duration % 60;

	seconds = seconds < 10 ? '0' + seconds : seconds;

	return `${minutes}:${seconds}`;
};

export const msToTime = (milliseconds: number) => {
	if (isNaN(milliseconds)) return '00:00:00';
	milliseconds = Math.floor(milliseconds / 1000) * 1000;
	let negative = false;
	if (milliseconds < 0) {
		negative = true;
		milliseconds *= -1;
	}
	let hours: number | string = Math.floor(milliseconds / (1000 * 60 * 60)),
		minutes: number | string = Math.floor((milliseconds / (1000 * 60)) % 60),
		seconds: number | string = Math.floor((milliseconds / 1000) % 60);

	hours = hours < 10 ? '0' + hours : hours;
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;

	return `${negative ? '-' : ''}${hours}:${minutes}:${seconds}`;
};
