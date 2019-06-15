const DEGREES_TO_RADS = Math.PI/180;

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function lerp(startPos, endPos, value) {
	return (endPos - startPos) * value + startPos;
}

function norm(value, min, max) {
	return (value - min) / (max - min);
}

function map(value, sourceMin, sourceMax, destMin, destMax) {
	return lerp(destMin, destMax, norm(value, sourceMin, sourceMax));
}
