import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/move1.wav';
    audio.load();
    audio.play();
  }

  playWinAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/win.wav';
    audio.load();
    audio.play();
  }

  playLoseAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/lose.wav';
    audio.load();
    audio.play();
  }

  playDrawAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/draw.wav';
    audio.load();
    audio.play();
  }

  playCorrectMoveAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/ping.mp3';
    audio.load();
    audio.play();
  }

  playWrongMoveAudio(): void {
    const audio = new Audio();
    audio.src = '../.././assets/audio/wrong.wav';
    audio.load();
    audio.play();
  }
}
