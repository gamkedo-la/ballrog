var LEVEL_SEQ = [0,1,2,3,4];
var LEVELS = {
	0: [
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		1,2,3,4,1,2,3,4,1,2,
		5,6,7,5,6,7,5,6,7,5,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	1: [
		3,3,3,3,3,3,3,3,3,3,
		2,2,2,2,2,2,2,2,2,2,
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	2: [
		0,0,0,0,1,1,0,0,0,0,
		0,0,0,1,1,1,1,0,0,0,
		0,0,1,1,1,1,1,1,0,0,
		0,1,1,1,1,1,1,1,1,0,
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		2,0,2,0,2,2,0,2,0,2,
		0,0,0,0,0,3,0,0,0,0,
		0,0,0,4,0,3,0,0,0,0,
		0,0,0,0,4,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	3: [
		1,1,1,1,1,1,1,1,1,1,
		1,1,1,1,1,1,1,1,1,1,
		2,2,2,2,2,2,2,2,2,2,
		2,2,2,2,2,2,2,2,2,2,
		3,3,3,3,3,3,3,3,3,3,
		3,3,3,3,3,3,3,3,3,3,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	4: [
		4,4,4,4,4,4,4,4,4,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,0,1,1,1,1,0,1,4,
		4,1,0,1,1,1,1,0,1,4,
		4,1,0,1,1,1,1,0,1,4,
		4,1,0,1,1,1,1,0,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,1,0,0,0,0,1,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,1,1,1,1,1,1,1,1,4,
		4,4,1,1,4,4,1,1,4,4
	],
};