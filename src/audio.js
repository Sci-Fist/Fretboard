// audio.js

// This module handles audio playback using Tone.js.
// It provides functions to initialize the audio context, play individual notes,
// play a complete tab, and stop playback.

import { getNote } from './tab-data.js'; // Import getNote function
import * as Tone from 'tone';

let isPlaying = false;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let playbackInterval;

let audioContext = new AudioContext(); // Create a new AudioContext
let fretboardNode;

let bpm = 120; // Default BPM

// Add a function to resume the AudioContext on user interaction
function resumeAudioContextOnInteraction() {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully');
        });
    }
}

// Load the AudioWorkletProcessor
async function setupAudioWorklet() {
    try {
        await audioContext.audioWorklet.addModule('fretboard-processor.js'); // Path to the processor file
        fretboardNode = new AudioWorkletNode(audioContext, 'fretboard-processor'); // Use the processor's registered name

        // Connect the AudioWorkletNode to the destination
        fretboardNode.connect(audioContext.destination);
    } catch (error) {
        console.error('Failed to initialize AudioWorklet:', error);
        alert('Failed to initialize audio playback.  Please check your browser settings and the console.');
    }
}

setupAudioWorklet();
resumeAudioContextOnInteraction();
const sixteenthNoteDuration = (60 / bpm) / 4; // Default Tempo.  Adjust for the BPM.

/**
 * Plays a single note using the AudioWorkletNode.
 * @param {string} note - The note to play (e.g., "E4").
 * @param {number} duration - The duration of the note in seconds (not fully implemented).
 * @param {number} [startTime=0] - The start time of the note (not fully implemented).
 */
function playNote(note, duration, startTime = 0) {
    console.log('audio.js: playNote called with', note, duration, startTime);

    if (!fretboardNode) {
        console.warn('audio.js: AudioWorkletNode not initialized.');
        return;
    }
    fretboardNode.port.postMessage({
        type: 'noteOn',
        note: note,
        velocity: 0.75, // Example: Set velocity
    });
}

/**
 * Stops the audio playback.
 */
function stopPlayback() {
    console.log('audio.js: stopPlayback called');
    if (!isPlaying) {
        console.log('audio.js: No playback in progress, ignoring.');
        return;
    }
    isPlaying = false;
    clearInterval(playbackInterval);
    //Tone.Transport.stop(); // Stop the Tone.js transport if it's running
    currentMeasureIndex = 0;
    currentFretIndex = 0;

    if (fretboardNode) {
        fretboardNode.port.postMessage({ type: 'noteOff' });
    }
}

/**
 * Exports the tab data as a MIDI file (placeholder).
 */
function exportMIDI() {
    // Placeholder function for MIDI export
    // In a future version, this function would handle MIDI file generation and download.
    alert('MIDI export not yet implemented.');
}

/**
 * Plays the entire tab.
 * @param {object} tabData - The tab data object.
 */
function playTab(tabData) {
  console.log('audio.js: playTab called');
  if (isPlaying) {
    stopPlayback();
  }

  if (!tabData || !tabData.measures || tabData.measures.length === 0) {
    alert('No tab data to play.');
    return;
  }

  bpm = tabData.bpm || 120; // Use tabData BPM or default
  const sixteenthNoteDuration = (60 / bpm) / 4; // Recalculate based on BPM
  isPlaying = true;
  currentMeasureIndex = 0;
  currentFretIndex = 0;

  function playMeasure(measureIndex) {
    if (!isPlaying) {
      return; // Stop if playback is cancelled
    }

    const measure = tabData.measures[measureIndex];
    if (!measure) {
      stopPlayback();
      return;
    }

    let fretIndex = 0;
    function playFret(stringIndex) {
      if (!isPlaying) {
        return;
      }
      const fretValue = measure.strings[stringIndex][fretIndex];
      if (fretValue !== '' && fretValue !== undefined) {
        const note = getNote(stringIndex, parseInt(fretValue), tabData.tuning);
        playNote(note, sixteenthNoteDuration); // Play the note
      }
    }

    function playNextFret() {
      if (!isPlaying) {
        return;
      }
      if (fretIndex < 4) { // Assuming 4 frets per beat (0,1,2,3)
        fretIndex++;
        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
          playFret(stringIndex);
        }
        setTimeout(playNextFret, sixteenthNoteDuration * 1000); // Play each fret for the duration
      } else {
        currentFretIndex = 0;
        playNextMeasure();
      }
    }

    // Start playing the first fret of the measure
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      playFret(stringIndex);
    }
    setTimeout(playNextFret, sixteenthNoteDuration * 1000); // Play each fret for the duration
  }

  function playNextMeasure() {
    if (!isPlaying) {
      return;
    }
    currentMeasureIndex++;
    if (currentMeasureIndex < tabData.measures.length) {
      playMeasure(currentMeasureIndex);
    } else {
      stopPlayback(); // Stop when all measures are played
    }
  }

  // Start playing the first measure
  playMeasure(0);
}

export { playTab, stopPlayback, exportMIDI };
