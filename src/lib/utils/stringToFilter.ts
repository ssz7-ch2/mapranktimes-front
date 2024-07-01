import type { Beatmap, BeatmapSet } from '$lib/types/beatmap.types';

const comparisonOperators = {
	'<': (a: number, b: number) => a < b,
	'>': (a: number, b: number) => a > b,
	'<=': (a: number, b: number) => a <= b,
	'>=': (a: number, b: number) => a >= b,
	'=': (a: number, b: number) => {
		// we want a = 3.5 and b = 3.56 to return true
		const stringB = String(b);
		const decimalPlaces = stringB.split('.')[1]?.length ?? 0;
		return a >= b && a < parseFloat(stringB) + Math.pow(10, -decimalPlaces);
	}
};

// beatmap[paramMap[param]]
const paramMap = {
	spin: 'spin',
	spinners: 'spin',
	sr: 'sr',
	stars: 'sr',
	len: 'len',
	length: 'len'
};

const isNumeric = (str: any) => !isNaN(str) && !isNaN(parseFloat(str));

export const stringToFilter = (
	line: string
): { filterString: null | string; filter: null | ((beatmapSet: BeatmapSet) => boolean) } => {
	const filterStrings = line.toLowerCase().trim().split(' ');
	const filters: ((beatmap: Beatmap) => boolean)[] = [];
	let filterUnresolved = false;

	const validStrings: string[] = [];
	filterStrings.forEach((filterString) => {
		if (filterString.length < 4) return;
		if (filterString === 'unresolved') {
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
					// @ts-ignore idk how to typescript this part
					comparisonOperators[operator[0]](beatmap[paramMap[param]], value)
				);
			}
		}
	});

	if (validStrings.length !== 0 || line.length === 0)
		localStorage.setItem('filter', validStrings.join(' '));
	if (filters.length === 0 && !filterUnresolved) return { filterString: null, filter: null };

	return {
		filterString: validStrings.join(' '),
		filter: function (beatmapSet: BeatmapSet) {
			if (filterUnresolved) return beatmapSet.unresolved;
			return beatmapSet?.beatmaps.some((beatmap) => filters.every((filter) => filter(beatmap)));
		}
	};
};
