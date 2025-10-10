import { useEffect, useRef } from 'react';

// Web Audio API bağlamı
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Temel ton oluşturma fonksiyonu
const createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  return { oscillator, gainNode };
};

// Taş seçme sesi
export const playTileSelectSound = () => {
  try {
    const { oscillator } = createTone(800, 0.1, 'triangle');
    oscillator.start();
    oscillator.stop(getAudioContext().currentTime + 0.1);
  } catch (error) {
    console.warn('Tile select sound failed:', error);
  }
};

// Taş çekme sesi
export const playTileDrawSound = () => {
  try {
    const { oscillator } = createTone(400, 0.2, 'sine');
    oscillator.start();
    oscillator.stop(getAudioContext().currentTime + 0.2);
  } catch (error) {
    console.warn('Tile draw sound failed:', error);
  }
};

// Taş atma sesi
export const playTileDiscardSound = () => {
  try {
    const { oscillator } = createTone(200, 0.3, 'sawtooth');
    oscillator.start();
    oscillator.stop(getAudioContext().currentTime + 0.3);
  } catch (error) {
    console.warn('Tile discard sound failed:', error);
  }
};

// Pas geçme sesi
export const playButtonClickSound = () => {
  try {
    const { oscillator } = createTone(600, 0.05, 'square');
    oscillator.start();
    oscillator.stop(getAudioContext().currentTime + 0.05);
  } catch (error) {
    console.warn('Button click sound failed:', error);
  }
};

// Kazanma sesi (basit melodi)
export const playGameWinSound = () => {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C

    notes.forEach((note, index) => {
      setTimeout(() => {
        const { oscillator } = createTone(note, 0.3, 'sine');
        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.3);
      }, index * 100);
    });
  } catch (error) {
    console.warn('Game win sound failed:', error);
  }
};

// Hata sesi
export const playErrorSound = () => {
  try {
    const { oscillator } = createTone(150, 0.2, 'sawtooth');
    oscillator.start();
    oscillator.stop(getAudioContext().currentTime + 0.2);
  } catch (error) {
    console.warn('Error sound failed:', error);
  }
};
