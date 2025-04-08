// src/audio.js
import * as Tone from '../node_modules/tone/build/esm/index.js';
import { createAudioContext } from 'standardized-audio-context';

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
        audioContext = new createAudioContext();
        await audioContext.resume();
        console.log("Audio context state:", audioContext.state);
        await Tone.start();
        console.log("Tone.js started");
        await audioContext.audioWorklet.addModule('src/fretboard-processor.js');
        fretboardSynth = new Tone.AudioWorkletNode('fretboard-processor');
        fretboardSynth.connect(audioContext.destination);
        console.log("AudioWorkletNode created and connected");
    } catch (error) {
        console.error("Error initializing audio:", error);
        alert("Error initializing audio. Please check the console for details.");
    }
}

function playNote(stringIndex, fretNumber) {
    if (!audioContext || audioContext.state !== 'running' || !fretboardSynth) {
        console.warn("Audio system not ready to play note.");
        return;
    }
    const tuningNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const baseNote = tuningNotes[stringIndex];
    const baseNoteName = baseNote.slice(0, -1);
    const baseOctave = parseInt(baseNote.slice(-1), 10);
    const baseNoteIndex = noteNames.indexOf(baseNoteName);
    const midiNoteNumber = baseNoteIndex + (baseOctave + 1) * 12 + fretNumber;
    const octave = Math.floor(midiNoteNumber / 12) - 1;
    const noteIndex = midiNoteNumber % 12;
    const note = noteNames[noteIndex] + octave;
    console.log(`Playing note: ${note}`);
    fretboardSynth.parameters.get('detune').value = 0;
    fretboardSynth.port.postMessage({
        type: 'noteOn',
        note: note,
        velocity: 0.8,
        oscillatorType: 'sine'
    });
    setTimeout(() => {
        stopNote();
    }, 300);
}

function stopNote() {
    if (!fretboardSynth) return;
    fretboardSynth.port.postMessage({
        type: 'allNotesOff'
    });
}

function playTab() {
    console.log("playTab function called (placeholder)");
    alert("Playback not yet fully implemented.");
}

function stopPlayback() {
    console.log("stopPlayback function called (placeholder)");
    stopNote();
}

export { initializeAudio, playNote, stopNote, playTab, stopPlayback };
