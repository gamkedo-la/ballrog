const COL_W = 80;
const BRICK_W = COL_W;
const ROW_H = 20;
const BRICK_H = ROW_H;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;
const TOP_MARGIN = 2*BRICK_H;
const BRICK_TYPES = {
	empty: 0,
	onehit: 1,
	twohit: 2,
	threehit: 3,
	unbreakable: 4,
	speedright:5,
	speedleft:6,
	speedvertical:7
};
const BRICK_SPECIAL_STATES = {
	frozen: 100
};
const BRICK_IMAGES = {
	[BRICK_TYPES.onehit]: brick1Pic,
	[BRICK_TYPES.twohit]: brick2Pic,
	[BRICK_TYPES.threehit]: brick3Pic,
	[BRICK_TYPES.unbreakable]: brick4Pic,
	[BRICK_TYPES.speedright]: brickRightPic,
	[BRICK_TYPES.speedleft]: brickLeftPic,
	[BRICK_TYPES.speedvertical]: brickVertPic,
	[BRICK_SPECIAL_STATES.frozen]: brickFrozenPic
};

var brickInfo = [];
var bricksInPlace = false;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

var brickShineEffect = new ShineFX(shinePic); // a glint animation on hit

function getBrickInfo() {
	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brick = getBrickAtTileCoord(eachCol, eachRow) % 100;
		    if(typeof(brick) != "undefined" && brick != BRICK_TYPES.empty) {
				// TODO: get brick index here to find brick type
				var brickLeftEdgeX = getColXCoord(eachCol);
				var brickTopEdgeY = getRowYCoord(eachRow);
				let offscreenY = brickTopEdgeY - canvas.height;
				offscreenY -= Math.floor(Math.random() * (BRICK_H * BRICK_H));
				brickInfo.push({x:brickLeftEdgeX, y: offscreenY, homeY: brickTopEdgeY, image: BRICK_IMAGES[brick]});
			}
		} // end of for eachRow
	} // end of for eachCol
} // end of getbrickInfo

function drawSingleBrick(brick,leftEdgeX, topEdgeY) {
	var brickType = brick % 100;
	var brickState = brick - brickType;
	drawBitMap(BRICK_IMAGES[brickType], leftEdgeX, topEdgeY);
	if (brickState > 0) {
		drawBitMap(BRICK_IMAGES[brickState], leftEdgeX, topEdgeY);
	}
}

function drawBricks() {
	canvasContext.fillStyle = 'white';
	canvasContext.textAlign = 'left';

	if (levelEditor.enabled) {
		drawEditorGrid();
		drawLevelBricks();
	} else {
		if(!bricksInPlace) {
			easeBricksbricksInPlace();
		} else {
			drawLevelBricks();

			brickShineEffect.draw();
		}
	}
}

function drawLevelBricks() {
	if (spaceInvading && !levelEditor.enabled) {
		if (spaceInvadeY == BRICK_H && spaceInvadeX == 0) {
			invadeStepX *= -1;
			invadeStepY *= -1;
		}

		if (spaceInvadeY == 0 && spaceInvadeX == 0 && invadeStepX < 0) {
			if (!INVASION_MODE || levelEditor.enabled) spaceInvading = false;
			invadeStepX *= -1;
			invadeStepY *= -1;
		} else {
			if (invaderMovementTimer <= 0) {
				if (Math.abs(spaceInvadeX) == BRICK_W && !invaderSteppedDown) {
					spaceInvadeY += invadeStepY;
					invadingDirection *= -1;
					invaderSteppedDown = true;
				} else {
					spaceInvadeX += invadeStepX * invadingDirection;
					invaderSteppedDown = false;
				}

				playMultiSound(arrayOfInvaderSounds);
				invaderMovementTimer = invaderMovementTimerFull;

			} else {
				invaderMovementTimer--;
			}
		}
	} else {
		spaceInvadeX = 0;
		spaceInvadeY = 0;
	}

	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brickLeftEdgeX = getColXCoord(eachCol) + spaceInvadeX;
			var brickTopEdgeY = getRowYCoord(eachRow) + spaceInvadeY;
			var brick = getBrickAtTileCoord(eachCol, eachRow);
			let brickType = brick % 100;

			if(typeof(brick) != "undefined" && brick != BRICK_TYPES.empty) {
				if (typeof(BRICK_IMAGES[brick % 100]) == "undefined") {
					//console.log("BAD IMAGE FOR", brick);
				}
				drawSingleBrick(brick, brickLeftEdgeX, brickTopEdgeY);
			}
		}
	}
}

function drawEditorGrid() {
	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brickLeftEdgeX = getColXCoord(eachCol);
			var brickTopEdgeY = getRowYCoord(eachRow);

				canvasContext.fillText(eachRow, 2, brickTopEdgeY + ROW_H/2 + 4);
				drawEditorGridLine(0, brickTopEdgeY, canvas.width, brickTopEdgeY);
		}
			canvasContext.fillText(eachCol, brickLeftEdgeX + COL_W/2 - 2, TOP_MARGIN);
			drawEditorGridLine(brickLeftEdgeX, TOP_MARGIN, brickLeftEdgeX, TOP_MARGIN + BRICK_H*BRICK_ROWS);
	}

	drawEditorGridLine(0, TOP_MARGIN + BRICK_H*BRICK_ROWS, canvas.width, TOP_MARGIN + BRICK_H*BRICK_ROWS);
}

function drawEditorGridLine(startX, startY, endX, endY) {
	canvasContext.beginPath();
	canvasContext.moveTo(startX, startY);
	canvasContext.lineTo(endX, endY);
	canvasContext.stroke();
}

function easeBricksbricksInPlace() {
	for (var b = 0; b < brickInfo.length; b++) {
		var brick = brickInfo[b];
		brick.y = lerp(brick.y, brick.homeY, 0.2);
		if (b == brickInfo.length - 1) {
			if (Math.ceil(brick.y) == brick.homeY) {
				// FIXME: Possible future issue, brick.y isn't a round number
				bricksInPlace = true;
			}
		}
		drawBitMap(brick.image, brick.x, brick.y);
	} // end of for b < brickInfo.length
} // end of easeBricksbricksInPlace();


function resetBricks(grid) {
	if (battlingBoss || creditsManager.rolling) {
		return;
	}
	if (typeof(grid) == 'undefined') {
		brickGrid = LEVELS[LEVEL_SEQ[currentLevelIndex]].slice();
	} else {
		brickGrid = grid.slice();
	}
	brickInfo = [];
	getBrickInfo();
	bricksInPlace = false;
	bricksLeft = brickGrid.filter(
		brick => brick != BRICK_TYPES.empty && brick != BRICK_TYPES.unbreakable
	).length;
	//console.log(bricksLeft);
	calculateMusicSpeedUpPace();
	calculateMusicVolumeIncreasPace();
	testBackgroundMusic.playbackRate = 1;
	testBackgroundMusic.volume = 0.15;
}

function clearBricks() {
	for (let i=0; i<BRICK_ROWS*BRICK_COLS; i++) {
		brickGrid[i] = BRICK_TYPES.empty;
	}
}

function getTileForPixelCoord(pixelX, pixelY) {
	return {
		col: Math.floor(pixelX/COL_W),
		row: Math.floor((pixelY - TOP_MARGIN)/ROW_H)
	}
}

function checkBrickIndexWithPixelCoord(index, pixelX, pixelY) {
	var indexPosition = {
		left: ((index % BRICK_COLS) * COL_W),
		right: ((index % BRICK_COLS) * COL_W) + BRICK_W,
		top: (Math.floor(index / BRICK_COLS)) * ROW_H,
		bottom: ((Math.floor(index / BRICK_COLS)) * ROW_H) + BRICK_H,
	};
	//console.log(indexPosition);
	//console.log(pixelX + " , " + pixelY);
	if (indexPosition.right <= 0 || indexPosition.left >= canvas.width) {
		return false;
	}
	if (pixelX > indexPosition.left && pixelX < indexPosition.right &&
		pixelY > indexPosition.top && pixelY < indexPosition.bottom) {
		return true;
	}
	return false;
}

function getBrickAtTileCoord(brickTileCol, brickTileRow) {
	var brickIndex = brickToTileIndex(brickTileCol, brickTileRow);
	return brickGrid[brickIndex];
}

function brickToTileIndex(tileCol, tileRow) {
	return tileCol + BRICK_COLS * tileRow;
}

function getColXCoord(col) {
	return (col*COL_W);
}

function getRowYCoord(row) {
	return (row*ROW_H) + TOP_MARGIN;
}

function handleBrickHit(evt) {
	var brick = brickGrid[evt.detail.index];

	if(evt.detail.ball != null)
		processBallEffects(brick, evt.detail.ball);

	processBrickEffects(brick, evt);

	if (brickGrid[evt.detail.index] == BRICK_TYPES.empty) {
		bricksLeft--;
		testBackgroundMusic.playbackRate += musicSpeedIncrementForLevel;
		testBackgroundMusic.volume += musicVolumeIncrementForLevel;
		// resetBricksOnNextPaddleHit = bricksLeft <= 0;
		let brickRemovedEvent = new CustomEvent('brickRemoved', {
			detail: evt.detail
		});
		if (bricksLeft <= 0) {
			canvas.dispatchEvent(brickRemovedEvent);
			checkPillsLive();


			//console.log(activePills);
			if (activePills <= 0 && !battlingBoss) {
				setTimeout(function() {
					let noMoreBricksEvent = new CustomEvent('noMoreBricks');
					canvas.dispatchEvent(noMoreBricksEvent);
				}, 500)
			} else {
				waitForLastPills = true;
			}
			return;
		}
		canvas.dispatchEvent(brickRemovedEvent);
	}
}

function processBallEffects(brick, ball) {
	switch(brick) {
		case BRICK_TYPES.speedright:
			if(ball.VelX < 0) {
				ball.VelX = -ball.VelX;
			} else {
				ball.VelX = 1.5 * ball.VelX;
			}
			break;
		case BRICK_TYPES.speedleft:
			if(ball.VelX > 0) {
				ball.VelX = -ball.VelX;
			} else {
				ball.VelX = 1.5 * ball.VelX;
			}
			break;
		case BRICK_TYPES.speedvertical:
			ball.VelX = 0;
		default:
			break;
	}
}

function processBrickEffects(brick, evt) {
	var brickType = brick % 100;
	var brickState = brick - brickType;
	switch(brickState) {
	case BRICK_SPECIAL_STATES.frozen:
		brickGrid[evt.detail.index] -= BRICK_SPECIAL_STATES.frozen;
		return;
	}
	switch(brickType) {
		case BRICK_TYPES.empty:
			break;//do nothing for empty spaces
		case BRICK_TYPES.onehit:
			brickGrid[evt.detail.index] -= 1;
			playMultiSound(arrayOfBrickHitSounds);
			break;
		case BRICK_TYPES.twohit:
		case BRICK_TYPES.threehit:
			shineBrick(evt);
			brickGrid[evt.detail.index] -= 1;
			playMultiSound(arrayOfBrickHitSounds);
			break;
		case BRICK_TYPES.unbreakable:
			shineBrick(evt);
			sounds.brickHitSteel.play();
			break;
		case BRICK_TYPES.speedright:
		case BRICK_TYPES.speedleft:
		case BRICK_TYPES.speedvertical:
			//these bricks are destroyed in one hit
			brickGrid[evt.detail.index] = BRICK_TYPES.empty;
			playMultiSound(arrayOfBrickHitSounds);
			break;
	}
}

function shineBrick(evt) {
	// add an Arkanoid-inspired "shine" animation on hit bricks
	var effectX = (evt.detail.col * BRICK_W);
	var effectY = evt.detail.row * BRICK_H + BRICK_H + BRICK_H;
	brickShineEffect.trigger(effectX,effectY);
}

function isValidBrick(brickValue) {
	const validTypes = Object.entries(BRICK_TYPES).filter(function(entry) {
		let key = entry[0];
		return key != "empty";
	}).map(function(entry) {
		let value = entry[1];
		return value;
	});
	const brickType = brickValue % 100;
	return validTypes.includes(brickType);

	// for(let i = 0; i < typeKeys.length; i++) {
	// 	if(typeKeys[i] === "empty") continue; //want to ignore the "empty" brick type

	// 	if(brickType === BRICK_TYPES[typeKeys[i]]) return true;
	// }

	// return false;
}
