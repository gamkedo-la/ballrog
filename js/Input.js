const KEY_P = 80

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x: mouseX,
		y: mouseY
	}
}

function setupInput() {
  document.addEventListener('keydown', keyPressed);
}

function keyPressed(evt) {
  console.log(evt);
  var paused = KEY_P;
  if (evt.keyCode == paused) {
    if (gamePaused) {
      gamePaused = false;
	  resetLetters();
    } else {
		gamePaused = true;
		var letter = new letterP(200, 300); // Initiate letters P A U S E
		letters.push(letter);
		var letter = new letterA(300, 300);
		letters.push(letter);
		var letter = new letterU(400, 300);
		letters.push(letter);
		var letter = new letterS(500, 300);
		letters.push(letter);
		var letter = new letterE(600, 300);
		letters.push(letter);
    }
  }
}
