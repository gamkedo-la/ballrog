var audioFormat;

function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
    } else {
		audioFormat = ".ogg";
    }
}

function SoundOverlapsClass(filenameWithPath, name) {
    setFormat();
    var altSoundTurn = false;
    this.mainSound = new Audio(filenameWithPath + audioFormat);
    this.altSound = new Audio(filenameWithPath + audioFormat);

    this.name = name;

    this.play = function() {
    if(!didInteract) {return;}

		if(gameMuted == false){
			if (altSoundTurn) {
				this.altSound.currentTime = 0;
				this.altSound.play();
			} else {
				this.mainSound.currentTime = 0;
				this.mainSound.play();
			}
		}//end check for gameMuted
		altSoundTurn = !altSoundTurn;
    }// end play() function
}//End soundOverlapClass

function BackgroundMusicClass() {
    var musicSound = null;

    this.loopSong = function(filenameWithPath) {
		setFormat();
		if(gameMuted == false){
			if (musicSound != null) {
				musicSound.pause();
				musicSound = null;
			}
			musicSound = new Audio(filenameWithPath + audioFormat);
			musicSound.loop = true;
			musicSound.play();
		}//end check for gameMuted
    }

    this.startOrStopMusic = function() {

		if (musicSound.paused) {
			musicSound.play();
		} else {
			musicSound.pause();
		}
    }
}

function getRandomInt(min, max) {
  let randomInt = min + Math.floor(Math.random() * (max - min + 1));
  return randomInt;
}

//multisound is the name of the function from FMOD that is intended to add variety to repetitive sounds to help increase
//aural aesthetics and prevent ear fatigue, this is a basic version using pitch shifted audio files based on the original
//sound and volume randomization
function playMultiSound(arrayOfSoundsToVarietize) {
  let arrayLength = arrayOfSoundsToVarietize.length;
  let randomArrayIndex = getRandomInt(0, arrayLength - 1);
  let randomSoundFromArray = arrayOfSoundsToVarietize[randomArrayIndex];
  let randomVolume = getRandomInt(8,10);
  randomVolume = randomVolume/10;
  randomSoundFromArray.volume = randomVolume;
  randomSoundFromArray.play();
}

var testBackgroundMusic;
var musicSpeedIncrementForLevel;
var musicVolumeIncrementForLevel;

function calculateMusicSpeedUpPace(bricksAtStartOfLevel) {
  bricksAtStartOfLevel = bricksLeft;
  let percentIncreaseForMusicSpeed = 1/bricksAtStartOfLevel;
  let ratioForIncreaseMusicSpeedBasedOnPlaybackRateRange = 0.5;
  musicSpeedIncrementForLevel = percentIncreaseForMusicSpeed*ratioForIncreaseMusicSpeedBasedOnPlaybackRateRange;
}

function calculateMusicVolumeIncreasPace(bricksAtStartOfLevel) {
  bricksAtStartOfLevel = bricksLeft;
  musicVolumeIncrementForLevel = (2/bricksAtStartOfLevel)*0.05;
}

function levelCompleteSoundEvents() {
  testBackgroundMusic.pause();
  testBackgroundMusic.currentTime = 0;
  sounds.levelComplete.play();
  testBackgroundMusic.volume = 0.15;
  testBackgroundMusic.playbackRate = 1;
}
