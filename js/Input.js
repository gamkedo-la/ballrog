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
  document.addEventListener('keyup', keyReleased);
}

function keyPressed(evt) {
  console.log(evt);
  var paused = KEY_P;
  if (evt.keyCode == paused) {
    if (gamePaused) {
      gamePaused = false;
    } else {
      gamePaused = true;
    }
  }
}
