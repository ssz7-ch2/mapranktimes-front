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
