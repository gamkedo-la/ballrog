var LEVEL_SEQ = [0, 1, 2, 3, 4, "5", "tunneling", "roses", "iceDelight", "blimp", "volcano"];
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
	5: [
		4,4,4,4,4,4,4,4,4,4,
		5,0,0,0,0,0,0,0,0,6,
		5,0,0,0,0,0,0,0,0,6,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,0,0,3,1,3,1,
		1,3,1,3,1,1,3,1,3,1,
		1,1,1,1,3,3,1,1,1,1
	],
	blimp: [
		0,0,0,0,2,2,0,0,0,0,
		0,0,0,2,7,7,2,0,0,0,
		0,0,2,3,3,3,3,2,0,0,
		4,2,3,3,3,3,3,3,2,4,
		4,2,1,1,1,1,1,1,2,4,
		4,2,1,1,1,1,1,1,2,4,
		4,2,0,0,0,0,0,0,2,4,
		4,2,0,0,0,0,0,0,2,4,
		4,2,1,1,1,1,1,1,2,4,
		4,2,1,1,1,1,1,1,2,4,
		4,2,3,3,3,3,3,3,2,4,
		0,0,2,3,3,3,3,2,0,0,
		0,0,0,2,7,7,2,0,0,0,
		0,0,0,0,2,2,0,0,0,0
	],
	roses: [
		1,1,1,1,3,3,1,1,1,1,
		4,3,3,4,1,1,4,3,3,4,
		3,0,0,3,3,3,3,0,0,3,
		0,2,2,0,3,3,0,2,2,0,
		0,2,2,0,0,0,0,2,2,0,
		0,2,2,0,4,4,0,2,2,0,
		2,0,0,2,0,0,2,0,0,2,
		2,0,0,2,0,0,2,0,0,2,
		0,2,2,0,4,4,0,2,2,0,
		0,2,2,0,0,0,0,2,2,0,
		0,2,2,0,3,3,0,2,2,0,
		3,0,0,3,3,3,3,0,0,3,
		4,3,3,4,1,1,4,3,3,4,
		1,1,1,1,3,3,1,1,1,1
	],
	tunneling: [
		4,4,7,4,4,7,4,4,7,4,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		1,6,0,5,6,0,5,6,0,5,
		4,4,0,4,4,0,4,4,0,4,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	iceDelight: [
		0,0,0,0,4,4,0,0,0,0,
		0,1,1,1,4,4,1,1,1,0,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		2,2,2,2,0,0,2,2,2,2,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		4,0,2,2,2,2,2,2,0,4,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0,
		3,3,3,3,4,4,3,3,3,3,
		6,7,4,4,4,4,4,4,7,5,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	],
	volcano: [
		0,0,0,4,4,0,0,0,0,0,
		0,0,0,0,4,4,0,0,0,0,
		0,0,0,0,0,2,0,0,0,0,
		0,0,0,0,2,2,0,0,0,0,
		0,0,0,0,2,2,2,0,0,0,
		0,0,0,2,3,3,2,0,0,0,
		0,0,0,2,3,7,3,0,0,0,
		0,0,0,3,7,7,7,2,0,0,
		0,0,3,3,7,7,7,3,0,0,
		0,0,3,7,7,7,7,3,0,0,
		3,3,3,7,7,4,7,7,3,0,
		7,7,7,7,4,4,4,7,3,3,
		0,0,0,0,0,0,0,0,0,0,
		0,0,0,0,0,0,0,0,0,0
	]
};