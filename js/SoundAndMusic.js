var audioFormat;

function setFormat() {
    var audio = new Audio();
    if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
    } else {
		audioFormat = ".ogg";
    }
}

function SoundOverlapsClass(filenameWithPath) {
    setFormat();
    var altSoundTurn = false;
    var mainSound = new Audio(filenameWithPath + audioFormat);
    var altSound = new Audio(filenameWithPath + audioFormat);

    this.play = function() {
		if(gameMuted == false){
			if (altSoundTurn) {
				altSound.currentTime = 0;
				altSound.play();
			} else {
				mainSound.currentTime = 0;
				mainSound.play();
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

function changeBackgroundMusicSpeed(currentBackgroundMusicObject, playbackRateForBackgroundMusic) {
  currentBackgroundMusicObject.playbackRate = playbackRateForBackgroundMusic;
}
