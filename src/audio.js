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

let audioContext = Tone.context;
let fretboardNode;

// Load the AudioWorkletProcessor
async function setupAudioWorklet() {
    try {
        await audioContext.audioWorklet.addModule('fretboard-processor.js'); // Path to the processor file
        fretboardNode = new AudioWorkletNode(audioContext, 'fretboard-processor'); // Use the processor's registered name

        // Connect the AudioWorkletNode to the destination
        fretboardNode.connect(Tone.getDestination());
        //fretboardNode.parameters.get('detune').value = 0;
    } catch (error) {
        console.error('Failed to initialize AudioWorklet:', error);
        alert('Failed to initialize audio playback.  Please check your browser settings and the console.');
    }
}

setupAudioWorklet();
const sixteenthNoteDuration = (60 / 120) / 4; // Default Tempo.  Adjust for the BPM.

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
    Tone.Transport.stop(); // Stop the Tone.js transport if it's running
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

export { playTab, stopPlayback, exportMIDI };
