const LEVEL_SELECT_SEP = 2;
const LEVEL_SELECT_W = 78;
const LEVEL_SELECT_H = 38;
const BUTTON_W = 100;
const BUTTON_H = 50;
var levelEditor = {
	undoManager: new UndoManager(),
	enabled: false,
	selectedBrickType: BRICK_TYPES.onehit,
	pencilDown: false,
	mousePos: {x: 0, y: 0, col: 0, row: 0},
	currentLevelKey: '0',
	editableLevels: Object.keys(LEVELS),
	buttonAreaY: 500,
	buttons: {
		create: {
			x: 0,
			text: 'NEW LEVEL',
			color: 'white',
			textColor: 'black',
			active: true,
			action: newLevel
		},
		remove: {
			x: 0,
			text: 'REMOVE',
			color: '#ac3232',
			textColor: 'white',
			active: true,
			action: removeLevel
		},
		clear: {
			x: 0,
			text: 'CLEAR',
			color: '#fbf236',
			textColor: 'black',
			active: true,
			action: clearLevel
		},
		download: {
			x: 0,
			text: 'DOWNLOAD',
			color: '#37946e',
			textColor: 'white',
			active: true,
			action: writeLevelData
		}
	}
}

function initLevelEditor() {
	levelEditor.currentLevelKey = LEVEL_SEQ[currentLevelIndex].toString();
	levelEditor.buttonAreaY = canvas.height - BUTTON_H;
	levelEditor.buttons.remove.active = levelEditor.editableLevels.length > 1;
	var buttons = Object.keys(levelEditor.buttons);
	buttons.forEach(function(key, i) {
		let button = levelEditor.buttons[key];
 		button.x = i*(canvas.width/buttons.length) + BUTTON_W/2;
	});
}


function drawEditorButtons() {
	var buttons = Object.keys(levelEditor.buttons).filter(key => levelEditor.buttons[key].active);
	buttons.forEach(function(key, i) {
		let button = levelEditor.buttons[key];
		colorRect(button.x, levelEditor.buttonAreaY, BUTTON_W, BUTTON_H, button.color);
		colorText(button.text, button.x + 2, levelEditor.buttonAreaY + BUTTON_H/2 + 2, button.textColor);
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

	//For the undo manager
	const action = new ActionObject(levelEditor.currentLevelKey, levelEditor.selectedBrickType, Action.Set, null, brickIndex);
	levelEditor.undoManager.tookAction(action);
}

function removeBrick() {
	const brickIndex = brickToTileIndex(levelEditor.mousePos.col, levelEditor.mousePos.row);
	if((brickIndex < 0) || (brickIndex >= LEVELS[levelEditor.currentLevelKey].length)) {return;}

	const brickType = LEVELS[levelEditor.currentLevelKey][brickIndex];
	if(brickType != BRICK_TYPES.empty) {

		brickGrid[brickIndex] = BRICK_TYPES.empty;
		LEVELS[levelEditor.currentLevelKey][brickIndex] = BRICK_TYPES.empty;

		const action = new ActionObject(levelEditor.currentLevelKey, brickType, Action.Remove, brickIndex, null);
		levelEditor.undoManager.tookAction(action);
	}
}

function undo() {
	const undoAction = levelEditor.undoManager.undoAction();
	if(undoAction == undefined) {return;}//no more actions can be undone, may want to provide notification to user
	if(undoAction.action == Action.Set) {//undo an "Set" => remove the brick
		brickGrid[undoAction.newIndex] = BRICK_TYPES.empty;
		LEVELS[undoAction.level][undoAction.newIndex] = BRICK_TYPES.empty;
	} else if(undoAction.action == Action.Remove) {//undo a "Remove" => add the brick back
		brickGrid[undoAction.oldIndex] = undoAction.brickType;
		LEVELS[undoAction.level][undoAction.oldIndex] = undoAction.brickType;
	} else if(undoAction.action == Action.Move) {
		//not implemented yet
	}
}

function redo() {
	const redoAction = levelEditor.undoManager.redoAction();
	if(redoAction == undefined) {return;}//no more actions can be redone, may want to provide a notification to user
	if(redoAction.action == Action.Set) {//undo an "Set" => remove the brick
		brickGrid[redoAction.newIndex] = redoAction.brickType;
		LEVELS[redoAction.level][redoAction.newIndex] = redoAction.brickType;
	} else if(redoAction.action == Action.Remove) {//undo a "Remove" => add the brick back
		brickGrid[redoAction.oldIndex] = BRICK_TYPES.empty;
		LEVELS[redoAction.level][redoAction.oldIndex] = BRICK_TYPES.empty;
	} else if(redoAction.action == Action.Move) {
		//no implemented yet
	}
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
	var output = 'var LEVEL_SEQ = ' + LEVEL_SEQ.toSource() + ';\nvar LEVELS = {\n';
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

function newLevel() {
	if (!levelEditor.enabled) {
		return;
	}
	var newLevelKey;
	var newLevel = [];
	var promptText = "What's the name of this new shiny level?";

	do {
		newLevelKey = prompt(promptText);
		if (newLevelKey == null) {
			return;
		}
		promptText = "Oops, that name's taken. You can come up with a better one!";
	} while (levelEditor.editableLevels.indexOf(newLevelKey) > 0);
	
	for (let i=0; i<BRICK_COLS*BRICK_ROWS; i++) {
		newLevel[i] = BRICK_TYPES.empty;
	}

	LEVELS[newLevelKey] = newLevel;
	LEVEL_SEQ.push(newLevelKey);
	currentLevelIndex = LEVEL_SEQ.length - 1;
	levelEditor.editableLevels = Object.keys(LEVELS);
	initLevelEditor();
	resetBricks(LEVELS[newLevelKey]);
}

function removeLevel() {
	if (!levelEditor.enabled || levelEditor.editableLevels.length <= 1) {
		return;
	}
	if (confirm('For real?')) {
		delete LEVELS[levelEditor.currentLevelKey];
		LEVEL_SEQ = LEVEL_SEQ.filter(key => key != levelEditor.currentLevelKey);
		levelEditor.editableLevels = Object.keys(LEVELS);
		currentLevelIndex = LEVEL_SEQ.length - 1;
		initLevelEditor();		
	}
}

function selectLevelOnMouseDown(evt) {
	didInteract = true;
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
		if (x > button.x && x < button.x + BUTTON_W && y > levelEditor.buttonAreaY && y < levelEditor.buttonAreaY + BUTTON_H) {
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
