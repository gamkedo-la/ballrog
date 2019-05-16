const LEVEL_SELECT_SEP = 2;
const LEVEL_SELECT_W = 78;
const LEVEL_SELECT_H = 38;
const BUTTON_W = 100;
const BUTTON_H = 50;
var levelEditor = {
	enabled: false,
	selectedBrickType: BRICK_TYPES.onehit,
	pencilDown: false,
	mousePos: {x: 0, y: 0, col: 0, row: 0},
	currentLevelKey: '0',
	editableLevels: Object.keys(LEVELS),
	buttons: {
		download: {
			text: 'DOWNLOAD',
			x: 700, y: 500,
			color: '#37946e',
			action: writeLevelData
		},
		clear: {
			text: 'CLEAR',
			x: 0, y: 500,
			color: '#ac3232',
			action: clearLevel
		}
	}
}

function initLevelEditor() {
	levelEditor.currentLevelKey = LEVEL_SEQ[currentLevelIndex].toString();
	levelEditor.buttons.download.x = canvas.width - BUTTON_W;
	levelEditor.buttons.download.y = canvas.height - BUTTON_H;
	levelEditor.buttons.clear.x = 0;
	levelEditor.buttons.clear.y = canvas.height - BUTTON_H;
}

function drawEditorButtons() {
	Object.keys(levelEditor.buttons).forEach(function(key, i) {
		let button = levelEditor.buttons[key];
		colorRect(button.x, button.y, BUTTON_W, BUTTON_H, button.color);
		colorText(button.text, button.x + 2, button.y + BUTTON_H/2 + 2, 'white');
	});
}

function drawLevelSelector() {
	var color;
	var totalCols = Math.min(
		levelEditor.editableLevels.length,
		Math.floor(canvas.width/(LEVEL_SELECT_W+LEVEL_SELECT_SEP))
	);
	var totalRows = Math.ceil((levelEditor.editableLevels.length*LEVEL_SELECT_W)/canvas.width);
	var startAtY = BRICK_ROWS*BRICK_H + TOP_MARGIN + LEVEL_SELECT_SEP*10;
	canvasContext.fillText('Select Level', LEVEL_SELECT_SEP, startAtY);
	startAtY += LEVEL_SELECT_SEP*4;
	for (var col=0; col<totalCols; col++) {
		for (var row=0; row<totalRows; row++) {
			let key = levelEditor.editableLevels[col + totalCols*row];
			if (key == levelEditor.currentLevelKey) {
				color = '#6abe30';
			} else {
				color = '#5b6ee1';
			}
			let x = col*(LEVEL_SELECT_W + LEVEL_SELECT_SEP);
			let y = startAtY + row*(LEVEL_SELECT_H + LEVEL_SELECT_SEP);
			colorRect(x, y, LEVEL_SELECT_W, LEVEL_SELECT_H, color);
			canvasContext.fillStyle = 'black';
			canvasContext.fillText(
				key,
				x + LEVEL_SELECT_W/2.2,
				y + LEVEL_SELECT_H/1.7
			);
		}
	}
}

function setBrick() {
	if (!levelEditor.enabled) {
		return
	}
	var brickIndex = brickToTileIndex(levelEditor.mousePos.col, levelEditor.mousePos.row);
	brickGrid[brickIndex] = levelEditor.selectedBrickType;
	LEVELS[levelEditor.currentLevelKey][brickIndex] = levelEditor.selectedBrickType;
}

function handleEditorMouseMove(evt) {
	if (!levelEditor.enabled) {
		return;
	}
	var mousePos = calculateMousePos(evt);
	var tile = getTileForPixelCoord(mousePos.x, mousePos.y);
	levelEditor.mousePos.x = mousePos.x;
	levelEditor.mousePos.y = mousePos.y;
	levelEditor.mousePos.col = tile.col;
	levelEditor.mousePos.row = tile.row;
	if (levelEditor.pencilDown) {
		if (levelEditor.mousePos.col >= BRICK_COLS || levelEditor.mousePos.row >= BRICK_ROWS) {
		return
		}
		setBrick();
	}
}

function writeLevelData() {
	// TODO: write LEVEL_SEQ
	var output = 'var LEVEL_SEQ = [' + LEVEL_SEQ.toString() + '];\nvar LEVELS = {\n';
	for (var i=0; i<levelEditor.editableLevels.length; i++) {
		let level = LEVELS[levelEditor.editableLevels[i]];
		output += '\t' + levelEditor.editableLevels[i] + ': [\n';
		for (var row=0; row<BRICK_ROWS; row++) {
			output += '\t\t' + level.slice(BRICK_COLS*row, BRICK_COLS*(row +1)).toString();
			output += row < BRICK_ROWS - 1 ? ',\n' : '\n';
		}
		output += '\t]'
		output += i<levelEditor.editableLevels.length - 1 ? ',\n' : '\n';
	}
	output += '};'
	var el = document.createElement('a');
	el.setAttribute('href', 'data:application/javascript,' + encodeURIComponent(output));
	el.setAttribute('download', 'levelData.js');
	el.style.display = 'none';
	document.body.appendChild(el);
	el.click();
	document.body.removeChild(el);
}

function clearLevel() {
	for (var i=0; i<BRICK_COLS*BRICK_ROWS; i++) {
		LEVELS[levelEditor.currentLevelKey][i] = brickGrid[i] = BRICK_TYPES.empty;
	}
}

function selectLevelOnMouseDown(evt) {
	if (!levelEditor.enabled) {
		return;
	}
	var x = levelEditor.mousePos.x;
	var y = levelEditor.mousePos.y;
	var totalCols = Math.min(
		levelEditor.editableLevels.length,
		Math.floor(canvas.width/(LEVEL_SELECT_W+LEVEL_SELECT_SEP))
	);
	var totalRows = Math.ceil((levelEditor.editableLevels.length*LEVEL_SELECT_W)/canvas.width);
	var startAtY = BRICK_ROWS*BRICK_H + TOP_MARGIN + LEVEL_SELECT_SEP*14;
	if (y < startAtY || y > startAtY + totalRows*(LEVEL_SELECT_H + LEVEL_SELECT_SEP)) {
		return;
	}
	var col = Math.floor(x/(LEVEL_SELECT_W + LEVEL_SELECT_SEP));
	var row = Math.floor((y - startAtY)/(LEVEL_SELECT_H + LEVEL_SELECT_SEP));
	if (col >= totalCols) {
		return;
	}
	var selectedKey = levelEditor.editableLevels[col + totalCols*row];
	if (selectedKey != levelEditor.currentLevelKey) {
		levelEditor.currentLevelKey = selectedKey;
		resetBricks(LEVELS[levelEditor.currentLevelKey]);
	}
}

function pushEditorButton(evt) {
	var x = levelEditor.mousePos.x;
	var y = levelEditor.mousePos.y;
	if (!levelEditor.enabled || y < canvas.height - BUTTON_H) {
		return;
	}
	Object.keys(levelEditor.buttons).forEach(function(key, i) {
		let button = levelEditor.buttons[key];
		if (x > button.x && x < button.x + BUTTON_W && y > button.y && y < button.y + BUTTON_H) {
			button.action();
		}
	});	
}

function setEditorPencilDown(evt) {
	levelEditor.pencilDown = true;
	setBrick();
}

function setEditorPencilUp(evt) {
	levelEditor.pencilDown = false;
}

function drawSelectedBrickType() {
	var x = levelEditor.mousePos.x;
	var y = levelEditor.mousePos.y;
	if (y > canvas.height - LEVEL_SELECT_H*Math.ceil((levelEditor.editableLevels.length*LEVEL_SELECT_W)/canvas.width)) {
		return;
	}
	if (y > TOP_MARGIN && y < TOP_MARGIN + ROW_H*BRICK_ROWS) {
		x = getColXCoord(levelEditor.mousePos.col);
		y = getRowYCoord(levelEditor.mousePos.row);
	}
	if (levelEditor.selectedBrickType == 0) {
		drawBitMap(brickEraserPic, x, y);
	} else {
		canvasContext.save();
		canvasContext.globalAlpha = 0.7;
		drawSingleBrick(levelEditor.selectedBrickType, x, y);
		canvasContext.restore();
	}
}

function handleEditorMouseScroll(evt) {
	evt.preventDefault();
	var currentSelection = levelEditor.selectedBrickType;
	var brickTypeChoices = Object.values(BRICK_TYPES);
	if (evt.deltaY < 0) {
		let index = brickTypeChoices.indexOf(currentSelection) - 1;
		if (index < 0) {
			index = brickTypeChoices.length - 1;
		}
		levelEditor.selectedBrickType = brickTypeChoices[index];
	}
	if (evt.deltaY > 0) {
		let index = brickTypeChoices.indexOf(currentSelection) + 1;
		if (index >= brickTypeChoices.length) {
			index = 0;
		}
		levelEditor.selectedBrickType = brickTypeChoices[index];
	}
}
