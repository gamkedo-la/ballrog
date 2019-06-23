function BusClass(arrayOfAudioFiles, name) {
  this.arrayOfAudioFiles = arrayOfAudioFiles;
  this.name = name;
  this.volume = 0.5;
  this.raiseVolume = function() {
    if (this.volume === 1.0) {
      this.volume = this.volume;
    } else {
    this.volume += 0.1;
    }
  }
  this.lowerVolume = function() {
    if (this.volume === 0.0) {
      this.volume = this.volume;
    } else {
    this.volume -= 0.1;
    }
  }
}

let arrayOfSFX = [];
let arrayOfBackgroundMusic = [];
let arrayOfMasterVolumeFiles = [];

function lowerSFXVolume() {
  
}
