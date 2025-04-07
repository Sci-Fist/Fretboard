// audio.js
// This module handles audio playback using the Web Audio API.
// It provides functions to initialize the audio context, play individual notes,
// play a complete tab, and stop playback.

import { getNote } from './tab-data.js'; // Import getNote function

let audioContext;
let oscillator;
let gainNode;
let isPlaying = false;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let playbackInterval;

/**
 * Plays a single note.
 * @param {string} note - The note to play (e.g., "E4").
 * @param {number} duration - The duration of the note in seconds.
 * @param {number} [startTime=0] - The start time of the note in seconds.
 */
function playNote(note, duration, startTime = 0) {
    console.log('audio.js: playNote called with', note, duration, startTime);
    if (!audioContext) {
        console.error('audio.js: Uh oh, audio context not initialized!');
        return;
    }

    const match = note.match(/([a-gA-G#b]+)(\d+)/);
    if (!match) {
        console.error(`audio.js: Invalid note format received in playNote - Note was: ${note}`);
        return; // Exit if the note format is not recognized
    }
    const [_, pitch, octaveStr] = match; // Use descriptive names
    const octave = parseInt(octaveStr);

    // Add validation for parsed pitch and octave if necessary, though getFrequency should handle basic note names
    const frequency = getFrequency(pitch, octave);
    if (isNaN(frequency)) {
        console.error(`audio.js: Could not calculate frequency for note ${note}`);
        return;
    }

    oscillator = audioContext.createOscillator();
    oscillator.type = 'sine'; // You can change the waveform here (sine, square, sawtooth, triangle)
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);

    gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + startTime); // Set initial gain
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + duration); // Fade out

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
}

/**
 * Converts a note name and octave to a frequency.
 * @param {string} pitch - The pitch of the note (e.g., "C", "C#").
 * @param {number} octave - The octave of the note (e.g., 4).
 * @returns {number} The frequency of the note in Hz.
 */
function getFrequency(pitch, octave) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const noteIndex = notes.indexOf(pitch);
    const frequency = 440 * Math.pow(2, (noteIndex - 9 + (octave - 4) * 12) / 12);
    return frequency;
}

/**
 * Plays the tab data using the Web Audio API.
 * @param {object} tabData - The tab data object.
 */
async function playTab(tabData) {
    console.log('audio.js: playTab called');
    initializeAudioContext(); // Ensure audio context is initialized
    if (isPlaying) {
        console.log('audio.js: Already playing, chill out.');
        return; // Prevent multiple playbacks
    }
    // Moved audioContext initialization here to address autoplay policy
    function initializeAudioContext() {
        if (!audioContext) {
            console.log('audio.js: Initializing AudioContext');
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.error("Error initializing AudioContext:", e);
                alert("AudioContext initialization failed. Audio playback may not work.");
            }
        }
    }
    //initializeAudioContext(); // Ensure audio context is initialized
    if (audioContext.state === 'suspended') {
        console.log('audio.js: Trying to resume AudioContext');
        try {
            await audioContext.resume();
            console.log('audio.js: AudioContext resumed successfully');
        } catch (err) {
            console.error('audio.js: Failed to resume AudioContext:', err);
            alert('Failed to resume audio playback. Please check your browser settings.');
            return;
        }
    }
    console.log('audio.js: AudioContext state:', audioContext.state);

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
    if (oscillator) {
        try {
            oscillator.stop(0);
            oscillator.disconnect();
        } catch (e) {
            // Oscillator might already be stopped or disconnected
            console.warn("audio.js: Error stopping/disconnecting oscillator:", e.message);
        } finally {
             oscillator = null;
        }
    }
    if (gainNode) {
        try {
           gainNode.disconnect();
        } catch (e) {
            console.warn("audio.js: Error disconnecting gainNode:", e.message);
        } finally {
             gainNode = null;
        }
    }
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
