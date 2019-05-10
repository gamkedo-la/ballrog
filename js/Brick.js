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
	unbreakable: 4
};
const BRICK_IMAGES = {
	[BRICK_TYPES.onehit]: brick1Pic,
	[BRICK_TYPES.twohit]: brick2Pic,
	[BRICK_TYPES.threehit]: brick3Pic,
	[BRICK_TYPES.unbreakable]: brick4Pic
};

var activePills = 0;
var waitForLastPills = false;

var brickInfo = [];
var bricksInPlace = false;
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;

var brickShineEffect = new ShineFX(shinePic); // a glint animation on hit

function getBrickInfo() {
	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brick = getBrickAtTileCoord(eachCol, eachRow);
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

function drawBricks() {
	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brick = getBrickAtTileCoord(eachCol, eachRow);
			if (!bricksInPlace) {
				//colorRect(0, 0, canvas.width, canvas.height, 'rgb(75,105,47 )');
				easeBricksbricksInPlace();
				return;
			} else {
				if(typeof(brick) != "undefined" && brick != BRICK_TYPES.empty) {
					// TODO: get brick index here to find brick type
					var brickLeftEdgeX = getColXCoord(eachCol);
					var brickTopEdgeY = getRowYCoord(eachRow);
					if (typeof(BRICK_IMAGES[brick]) == "undefined") {
						console.log("BAD IMAGE FOR", brick);
					}
					drawBitMap(BRICK_IMAGES[brick], brickLeftEdgeX, brickTopEdgeY);
				}
		  	}
		}
	}
	brickShineEffect.draw();
}

function easeBricksbricksInPlace() {
	for (var b = 0; b < brickInfo.length; b++) {
		var brick = brickInfo[b];
		if (b % BRICK_COLS == 0) {
			setTimeout(function(){},200);
		}
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

function resetBricks() {
	brickGrid = LEVELS[LEVEL_SEQ[currentLevelIndex]].slice();
	brickInfo = [];
	getBrickInfo();
	bricksInPlace = false;
	bricksLeft = brickGrid.filter(
		brick => brick != BRICK_TYPES.empty && brick != BRICK_TYPES.unbreakable
	).length;
}

function getBrickAtTileCoord(brickTileCol, brickTileRow) {
	var brickIndex = brickToTileIndex(brickTileCol, brickTileRow);
	return brickGrid[brickIndex];
}

function brickToTileIndex(tileCol, tileRow) {
	return tileCol + BRICK_COLS * tileRow;
}

function getColXCoord(col) {
	return col*COL_W;
}

function getRowYCoord(row) {
	return row*ROW_H + TOP_MARGIN;
}

function handleBrickHit(evt) {
	var brick = brickGrid[evt.detail.index];
	if (brick != BRICK_TYPES.empty && brick != BRICK_TYPES.unbreakable) {
		brickGrid[evt.detail.index] -= 1;
		if (brickGrid[evt.detail.index] == BRICK_TYPES.empty) {
			bricksLeft--;
			// resetBricksOnNextPaddleHit = bricksLeft <= 0;
			let brickRemovedEvent = new CustomEvent('brickRemoved', {
				detail: evt.detail
			});
			if (bricksLeft <= 0) {
				canvas.dispatchEvent(brickRemovedEvent);
				checkPillsLive();
				//console.log(activePills);
				if (activePills <= 0) {
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
		else { // did not get destroyed
			var effectX = evt.detail.col * BRICK_W;
			var effectY = evt.detail.row * BRICK_H + BRICK_H + BRICK_H;
			brickShineEffect.trigger(effectX,effectY);
		}
	}
}

function isValidBrick(brickValue) {
	return (brickValue === BRICK_TYPES.onehit ||
			brickValue === BRICK_TYPES.twohit ||
			brickValue === BRICK_TYPES.threehit ||
			brickValue === BRICK_TYPES.unbreakable);
}
