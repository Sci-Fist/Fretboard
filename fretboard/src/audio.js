// audio.js
// Handles audio playback with Tone.js

import { getNote } from './tab-data.js'; // Import getNote function

let synth;
let playbackInterval;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let isPlaying = false;

/**
 * Plays the tab data using Tone.js.
 * @param {object} tabData - The tab data object.
 */
function playTab(tabData) {
    console.log('audio.js: playTab called');
    if (isPlaying) {
        console.log('audio.js: Playback already in progress, ignoring.');
        return; // Prevent multiple playbacks
    }
    isPlaying = true;
    try {
        // Initialize Tone.js
        if (!synth) {
            console.log('audio.js: Initializing Tone.js synth');
            synth = new Tone.PolySynth(Tone.Synth).toDestination();
        }
        const bpm = tabData.bpm || 120;
        const noteLength = (60 / bpm) * 4; // Duration of a 16th note in seconds
        currentMeasureIndex = 0;
        currentFretIndex = 0;

        playbackInterval = setInterval(() => {
            playBeat(tabData, synth);
            currentFretIndex++;
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
 * @param {Tone.PolySynth} synth - The Tone.js synthesizer.
 */
function playBeat(tabData, synth) {
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
            try {
                synth.triggerAttackRelease(note, '16n'); // Play for a 16th note
            } catch (error) {
                console.error('audio.js: Error triggering note:', error);
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
    if (synth) {
        console.log('audio.js: Releasing all notes');
        synth.releaseAll(); // Stop any lingering notes
        console.log('audio.js: Disposing of synth');
        synth.dispose(); // Dispose of the synth to free up resources
        synth = null; // Set synth to null to prevent further use
    }
    currentMeasureIndex = 0;
    currentFretIndex = 0;
}

/**
 * Exports the tab data as a MIDI file (placeholder).
 */
function exportMIDI() {
    // Placeholder for MIDI export
    alert('MIDI export not yet implemented.');
}

export { playTab, stopPlayback, exportMIDI };
