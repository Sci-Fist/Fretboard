// audio.js
// Handles audio playback with Tone.js

import { getNote } from './tab-data.js'; // Import getNote function

let synth;
let playbackInterval;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let isPlaying = false;

function playTab(tabData) {
    console.log('playTab called');
    if (isPlaying) return; // Prevent multiple playbacks
    isPlaying = true;
    try {
        // Initialize Tone.js
        if (!synth) {
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
        console.error('Playback initialization failed:', error);
        alert('Failed to initialize audio playback. Please check your browser settings.');
        stopPlayback(); // Ensure playback stops if initialization fails
    }
}

function playBeat(tabData, synth) {
    console.log('playBeat called');
    if (!tabData.measures[currentMeasureIndex]) return;
    const measure = tabData.measures[currentMeasureIndex];
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
        const fretValue = measure.strings[stringIndex][currentFretIndex];
        const fretNumber = parseInt(fretValue);
        if (!isNaN(fretNumber)) {
            const note = getNote(stringIndex, fretNumber, tabData.tuning);
            try {
                synth.triggerAttackRelease(note, '16n'); // Play for a 16th note
            } catch (error) {
                console.error('Error triggering note:', error);
            }
        }
    }
}

function stopPlayback() {
    console.log('stopPlayback called');
    if (!isPlaying) return;
    isPlaying = false;
    clearInterval(playbackInterval);
    if (synth) {
        synth.releaseAll(); // Stop any lingering notes
        synth.dispose(); // Dispose of the synth to free up resources
        synth = null; // Set synth to null to prevent further use
    }
    currentMeasureIndex = 0;
    currentFretIndex = 0;
}

function exportMIDI() {
    // Placeholder for MIDI export
    alert('MIDI export not yet implemented.');
}

export { playTab, stopPlayback, exportMIDI };
