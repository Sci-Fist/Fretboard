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
let synth = new Tone.Synth().toDestination();

/**
 * Plays a single note using Tone.js.
 * @param {string} note - The note to play (e.g., "E4").
 * @param {number} duration - The duration of the note in seconds.
 * @param {number} [startTime=0] - The start time of the note in seconds.
 */
function playNote(note, duration, startTime = 0) {
    console.log('audio.js: playNote called with', note, duration, startTime);

    // Validate the note format
    const match = note.match(/([a-gA-G#b]+)(\d+)/);
    if (!match) {
        console.error(`audio.js: Invalid note format received in playNote - Note was: ${note}`);
        return; // Exit if the note format is not recognized
    }

    try {
        synth.triggerAttackRelease(note, duration, startTime);
    } catch (error) {
        console.error(`audio.js: Error triggering note ${note}:`, error);
    }
}

/**
 * Plays the tab data using Tone.js.
 * @param {object} tabData - The tab data object.
 */
async function playTab(tabData) {
    console.log('audio.js: playTab called');
    if (isPlaying) {
        console.log('audio.js: Playback already in progress, ignoring.');
        return; // Prevent multiple playbacks
    }

    isPlaying = true;

    try {
        const bpm = tabData.bpm || 120;
        const noteLength = (60 / bpm) * 4; // Duration of a 16th note in seconds
        currentMeasureIndex = 0;
        currentFretIndex = 0;
        let startTime = 0; // Start time for each note

        playbackInterval = setInterval(() => {
            playBeat(tabData, startTime);
            currentFretIndex++;
            startTime += noteLength / 4; // Increment start time
            if (currentFretIndex >= 4) {
                currentFretIndex = 0;
                currentMeasureIndex++;
                if (currentMeasureIndex >= tabData.measures.length) {
                    stopPlayback();
                }
            }
        }, noteLength / 4 * 1000); // Convert to milliseconds
    } catch (error) {
        console.error('audio.js: Playback initialization failed:', error);
        alert('Failed to initialize audio playback. Please check your browser settings.');
        stopPlayback(); // Ensure playback stops if initialization fails
    }
}

/**
 * Plays a single beat (set of notes) in the tab.
 * @param {object} tabData - The tab data object.
 * @param {number} startTime - The start time for the beat in seconds.
 */
function playBeat(tabData, startTime) {
    console.log('audio.js: playBeat called');
    if (!tabData.measures[currentMeasureIndex]) {
        console.log('audio.js: No measure at index', currentMeasureIndex);
        return;
    }
    const measure = tabData.measures[currentMeasureIndex];
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        const fretValue = measure.strings[stringIndex][currentFretIndex];
        const fretNumber = parseInt(fretValue);
        if (!isNaN(fretNumber)) {
            const note = getNote(stringIndex, fretNumber, tabData.tuning);
            if (note) { // Check if getNote returned a valid note string
                try {
                    playNote(note, 0.2, startTime); // Play for 0.2 seconds
                } catch (error) {
                    console.error(`audio.js: Error triggering note ${note}:`, error);
                }
            } else {
                 console.warn(`audio.js: Could not get note for string ${stringIndex}, fret ${fretNumber}`);
            }
        }
    }
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
