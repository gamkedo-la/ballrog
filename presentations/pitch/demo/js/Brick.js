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
const masterGrid = [
	0, 0, 0, 0, 1, 1, 0, 0, 0, 0,
	0, 0, 0, 1, 1, 1, 1, 0, 0, 0,
	0, 0, 1, 1, 1, 1, 1, 1, 0, 0,
	0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	2, 0, 2, 0, 2, 2, 0, 2, 0, 2,
	0, 0, 0, 0, 0, 3, 0, 0, 0, 0,
	0, 0, 0, 4, 0, 3, 0, 0, 0, 0,
	0, 0, 0, 0, 4, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];
var brickGrid = new Array(BRICK_COLS * BRICK_ROWS);
var bricksLeft = 0;
var resetBricksOnNextPaddleHit = false;

function drawBricks() {
	for (var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
		for (var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
			var brick = getBrickAtTileCoord(eachCol, eachRow);
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

function resetBricks() {
	brickGrid = masterGrid.slice();
	bricksLeft = brickGrid.filter(
		brick => brick != BRICK_TYPES.empty && brick != BRICK_TYPES.unbreakable
	).length;
	// TODO fire bricksReset event and connect that to initPills
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
			resetBricksOnNextPaddleHit = bricksLeft <= 0;
			let brickRemovedEvent = new CustomEvent('brickRemoved', {
				detail: evt.detail
			});
			canvas.dispatchEvent(brickRemovedEvent);
		}
	}
}
