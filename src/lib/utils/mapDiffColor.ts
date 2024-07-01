import { scaleLinear } from 'd3-scale';
import { interpolateRgb } from 'd3-interpolate';

const difficultyColourSpectrum = scaleLinear<string>()
	.domain([0.1, 1.25, 2, 2.5, 3.3, 4.2, 4.9, 5.8, 6.7, 7.7, 9])
	.clamp(true)
	.range([
		'#4290FB',
		'#4FC0FF',
		'#4FFFD5',
		'#7CFF4F',
		'#F6F05C',
		'#FF8068',
		'#FF4E6F',
		'#C645B8',
		'#6563DE',
		'#18158E',
		'#000000'
	])
	.interpolate(interpolateRgb.gamma(2.2));

const mapDiffColor = (difficulty: number) => {
	if (difficulty < 0.1) return '#AAAAAA';
	if (difficulty >= 9) return '#000000';
	return difficultyColourSpectrum(difficulty);
};

export default mapDiffColor;
