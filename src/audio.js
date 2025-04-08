// src/audio.js
import * as Tone from '../node_modules/tone/build/esm/index.js';

let audioContext;
let fretboardSynth;

/**
 * Initializes the audio context and synth.
 */
async function initializeAudio() {
    if (audioContext && audioContext.state === 'running') {
        console.log("Audio context already initialized and running.");
        return;
    }

    try {
        audioContext = new AudioContext();
        await audioContext.resume(); // Ensure audio context is started
        console.log("Audio context state:", audioContext.state); // Should be 'running'

        await Tone.start(); // Start Tone.js context
        console.log("Tone.js started");

        // Register and create AudioWorklet node
        await audioContext.audioWorklet.addModule('src/fretboard-processor.js');
        fretboardSynth = new Tone.AudioWorkletNode('fretboard-processor');

        fretboardSynth.connect(audioContext.destination); // Connect to output
        console.log("AudioWorkletNode created and connected");


    } catch (error) {
        console.error("Error initializing audio:", error);
        alert("Error initializing audio. Please check the console for details.");
    }
}


/**
 * Plays a note based on string and fret.
 * @param {number} stringIndex - The string index (0-5, from E to e).
 * @param {number} fretNumber - The fret number (0-24).
 */
function playNote(stringIndex, fretNumber) {
    if (!audioContext || audioContext.state !== 'running' || !fretboardSynth) {
        console.warn("Audio system not ready to play note.");
        return;
    }

    const tuningNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4']; // Standard tuning base notes
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Calculate the MIDI note number
    const baseNote = tuningNotes[stringIndex];
    const baseNoteName = baseNote.slice(0, -1); // "E", "A", etc.
    const baseOctave = parseInt(baseNote.slice(-1), 10); // 2, 3, 4

    const baseNoteIndex = noteNames.indexOf(baseNoteName);
    const midiNoteNumber = baseNoteIndex + (baseOctave + 1) * 12 + fretNumber; // MIDI note number calculation

    // Convert MIDI note number to note name (e.g., "C4", "G3")
    const octave = Math.floor(midiNoteNumber / 12) - 1;
    const noteIndex = midiNoteNumber % 12;
    const note = noteNames[noteIndex] + octave;

    console.log(`Playing note: ${note}`);

    // Send noteOn message to AudioWorkletProcessor
    fretboardSynth.parameters.get('detune').value = 0; // Reset detune if needed
    fretboardSynth.port.postMessage({
        type: 'noteOn',
        note: note,
        velocity: 0.8, // Adjust velocity as needed
        oscillatorType: 'sine' // You can change oscillator type here if needed
    });

    // Automatically trigger noteOff after a short duration (e.g., 0.3 seconds)
    setTimeout(() => {
        stopNote();
    }, 300); // 300ms duration
}


/**
 * Stops the currently playing note.
 */
function stopNote() {
    if (!fretboardSynth) return;

    fretboardSynth.port.postMessage({
        type: 'allNotesOff'
    });
}


/**
 * Plays the entire tablature. (Placeholder - implementation needed)
 */
function playTab() {
    console.log("playTab function called (placeholder)");
    // TODO: Implement tab playback logic here
    alert("Playback not yet fully implemented."); // Placeholder message
}

/**
 * Stops tablature playback. (Placeholder - implementation needed)
 */
function stopPlayback() {
    console.log("stopPlayback function called (placeholder)");
    // TODO: Implement stop playback logic here
    stopNote(); // Stop any currently playing note
}


export { initializeAudio, playNote, stopNote, playTab, stopPlayback };
