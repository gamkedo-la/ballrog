const creditsManager = new (function() {
	const BASE_SPEED = 32;
	const BG_COLOR = '#222034';
	const SPACE = 42;
	const LINE_HEIGHT = 16;
	const RAINBOW_SPEED = BASE_SPEED/1.88;
	const BOB_SPEED = BASE_SPEED/5;

	var scroll = 0;
	var speed = BASE_SPEED;
	var lastSpeed = BASE_SPEED;
	var rainbowSpeed = BASE_SPEED/1.88;

	var rainbowPos = 0;
	var paddleBob = 0;

	this.rolling = false;

	this.roll = function() {
	    this.rolling = true;
	    allBalls[0].Y = 0;
	    allBalls[0].X = 20;
	    paddleX = 20;
	    paddleY = 16;
		sounds.creditsMusic.play();
	};

	this.stop = function() {
	    this.rolling = false;
	    scroll = 0;
	    paddleY = PADDLE_ORIGINAL_Y;
		sounds.creditsMusic.stop();
	}
	this.update = function(dt) {
		if (this.rolling) {
		    scroll -= speed*dt;
		    rainbowPos += RAINBOW_SPEED*dt;
			paddleBob += BOB_SPEED*dt;
			paddleY += Math.sin(paddleBob)/2;
		}
	};

	this.speedUp = function() {
		speed += 10;
		if (speed > 100) {
			speed = 100;
		}
	};

	this.speedDown = function() {
		speed -= 10;
		if (speed < 2) {
			speed = 2;
		}
	};

	this.togglePause = function() {
		console.log('Toggling pause');
		if (speed == 0) {
			speed = lastSpeed;
		} else {
			lastSpeed = speed;
			speed = 0;
		}
	};

	this.draw = function() {
		if (!this.rolling) {
			return;
		}
	    colorRect(0, 0, canvas.width, canvas.height, BG_COLOR);
		for (let i=0; i<(canvas.height - (20 + paddlePic.height)); i++) {
			// drawBitMap(nyanPic, 20, 20 + paddlePic.height + i*nyanPic.height);
			let width = nyanPic.width + map(Math.sin(i + rainbowPos), -1, 1, -6, 8);
			canvasContext.save();
			if (width > nyanPic.width) {
				canvasContext.globalAlpha = 1;
			} else if (width <= 0) {
				canvasContext.globalAlpha = 0.3;
			} else {
				canvasContext.globalAlpha = 0.7;
			}
			canvasContext.translate(20, 20 + paddlePic.height + i*nyanPic.height);
			canvasContext.drawImage(nyanPic, 0, 0, nyanPic.width, nyanPic.height, -width/2 + paddlePic.width/2, 0, width, nyanPic.height);
			canvasContext.restore();
		}
		// TODO: animate nyan rainbow
		canvasContext.save();
		canvasContext.translate(0, scroll);
		let line = 0;
		const X = canvas.width/2;
		const Y = canvas.height;
		colorTextCentered("Ballrog was made by the following awesome people (in alphabetical order)", X, Y + line*LINE_HEIGHT);
		line++;
		CREDITS_DATA.sort(function (a, b) {
			return a.name < b.name ? -1 : 1;
		}).forEach(function(data, i) {
			colorTextCentered("★ " + data.name + " ★", X, Y + (i+1)*SPACE + line*LINE_HEIGHT, "white", "20px Arial Black");
			data.credits.forEach(function(credit, j) {
				line++;
				colorTextCentered(credit, X, Y + (i+1)*SPACE + line*LINE_HEIGHT);
			});
			line++;
		});
		canvasContext.restore();
		drawPaddle();
	};
})();

const CREDITS_DATA = [
    {
	name: "Chris DeLeon",
	credits: [
	    'Authored "Hands-On Intro to Game Programming" book.',
	    "Set git repository up for project..",
	    "Compiled credits.",
	],
    },
    {
	name: "Gonzalo Delgado",
	credits: [
	    "Implemented initial prototype and led project.",
	    "Created game enemies sprites and programming.",
	    "Added multiple level support.",
	    "Improved ball trail effect.",
	    "Implemented level editor.",
	    "Created frozen paddle and bricks sprites.",
	    'Authored "Ice delight" level.',
	    "Created credits roll screen.",
	    "Implemented boss battle stage."
	]
    },
    {
	name: 'Christer "McFunkypants" Kaitila',
	credits: [
	    "Created paddle's blinking googly eyes.",
	    "Created ball motion blur trail effect.",
	    "Created brick hit shine effect.",
	    "Added game browser title.",
	    "Created animated plasma backgrounds.",
	    "Co-implemented multiball.",
	    "Improved GUI.",
	    "Colored GAMKEDO letter pills.",
	    "Revamped title screen.",
	    "Championed invaders mode as main gameplay idea.",
	    "Bugfixed game over screen",
	    "Added controller and touchscreen support.",
	    "Increased background sound layers.",
	    "Mobile screen support.",
	    "Added turbo mode (for internal use)."
	],
    },
    {
	name: "Cyriel De Neve",
	credits: [
	    "Added extra life power-up (art and code).",
	    "Improved shrink power pill.",
	    "Authored level 5.",
	    'Authored "Roses" level.',
	    "Bugfixed ball-brick collisions.",
	    'Authored "Blimp" level.',
	    "Added boss defeated score bonus."
	],
    },
    {
	name: "Vince McKeown",
	credits: [
	    "Implemented animated pause screen.",
	    "Created pause screen bricks sprites.",
	    "Created shrink power pill sprite.",
	    "Created elevate power pill sprite.",
	    "Created accelerate power pill sprite.",
	    "Created jump power pill sprite.",
	    "Added high score display.",
	    "Implemented sticky ball power-up.",
	    "Added random ball angle after collision.",
	    "Created ball collisions sound effects.",
	    "Game Over sound effect.",
	    "Life lost sound effect.",
	    "Letter pills sprites.",
	    "Letter (GAMKEDO) Pills.",
	    "Demo/Attract mode implementation.",
	    "Color text helper function.",
	    "Game over screen implementation.",
	    "Implemented window focus lock.",
	    "Created hat pill sprite."
	],
    },
    {
	name: "Brian Nielsen",
	credits: [
	    "Implemented mute game key.",
	    "Implemented multiball.",
	    "Fixed restart bug."
	],
    },
    {
	name: "Terrence McDonnell",
	credits: [
	    "Created brick easing effect on level load.",
	    "Improved level loading.",
	    "Implemented jump power pill.",
	    "Fixed infinite stretch/shrink bug.",
	    "Implemented new level and game over pill powers logic.",
	    "Added death key.",
	    "Authored level 4",
	    "Implemented invader brick movement.",
	    "Created invader movement sound effects.",
	    "Programmed detection of active power up.",
	    "Enhanced demo screen.",
	    "Improved ball-paddle interactions.",
	    "Implemented accelerate ball power pill.",
	    "Bugfixed sound creation code.",
	    "Implemented debug ball mode.",
	    "Improved sticky ball power pill.",
	    "Narrowed ball serve angle.",
	    "Bugfixed invading brick-ball collision.",
	    "Added paddle wobble effect.",
	    "Improved paddle googly eyes.",
	    "Animated game over screen.",
	    "Improved ice enemy slide state."
	],
    },
    {
	name: "Tyler Funk",
	credits: [
	    "Adjusted ball speed.",
	    "Improved paddle stretch power up.",
	],
    },
    {
	name: "H Trayford",
	credits: [
	    "Refactored brick code.",
	    "Fixed letters and font glitches.",
	    "Improved demo mode.",
	    "Crated velocity-altering brick types.",
	    "Improved ball-paddle gameplay.",
	    "Added level editor delete brick key.",
	    "Implemented level editor undo/redo.",
	    "Implemented volume adjustment controls.",
	    "Added credits screen access from title screen."
	],
    },
    {
	name: "Stebs",
	credits: [
	    "Implemented brick hit multisound.",
	    "Automated increasing gameplay music play rate with level progression.",
	    "Balanced music volume.",
	    "Created pitch-shifted collision sounds.",
	    "Implemented and enhanced background music.",
	    "Created level complete sound effect.",
	    "Created multiball spawn sound effect.",
	    "Created pitch-shifted paddle jump sound effect.",
	    "Created power pill sounds (stick, shrink, stretch, freeze, points, magnet, ghost, jump)",
	    "Created power pill swallow sound effects.",
	    "Created wiz enemy sound effects.",
	    "Tweaked multiball power up.",
	    "Implemented buses for audio volume control.",
	    "Voiced letter pills.",
	    "Randomized gameplay background music.",
	    "Created magnet pill sprite."
	],
    },
    {
	name: "Alan Zaring",
	credits: [
	    "Created boss battle music.",
	    "Created title screen music.",
	    "Created gameplay music (x3).",
	    "Balanced music volume.",
	],
    },
    {
	name: "Michelly Oliveira",
	credits: [
	    "Implemented magnet pill.",
	],
    },
    {
	name: 'Jeff "Axphin" Hanlon',
	credits: [
	    "Authored game over song.",
	    "Created menu sound effects.",
	    "Created brick hit steel sound effect.",
	    "Created bullet sprite for gun power up.",
	    "Created credits/game over music.",
	    "Converted power up sound effect to MP3.",
	],
    },
    {
	name: "Bilal A. Cheema",
	credits: [
	    'Authored "Volcano" level.',
	    "Created gun power up, with fire sprite.",
	    "Added change brick button to level editor."
	],
    }
];
