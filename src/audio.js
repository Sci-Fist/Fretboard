// audio.js

// This module handles audio playback using AudioWorkletNode.
// It provides functions to initialize the audio context, play individual notes,
// play a complete tab, and stop playback.

import { getNote } from "./tab-data.js"; // Import getNote function

let isPlaying = false;
let currentMeasureIndex = 0;
let currentFretIndex = 0;
let playbackInterval;

let actx; // Audio context
let fretboardNode; // AudioWorkletNode

let bpm = 120; // Default BPM
const NUMBER_OF_STRINGS = 6;

// Initialize audio context and AudioWorklet
export async function initializeAudio() { // Added export
  try {
    actx = new AudioContext();

    // Add a function to resume the AudioContext on user interaction
    // Attach the event listeners for user interaction *after* context is created
    // Use { once: true } so they only fire once per type
    async function resumeAudioContextOnInteraction() {
      console.log("resumeAudioContextOnInteraction called. actx is:", actx); // Add this log
      // Check if actx is initialized *and* suspended before resuming
      if (actx && actx.state === "suspended") {
        try {
          console.log("Attempting to resume AudioContext...");
          await actx.resume();
          console.log("AudioContext resumed successfully");
        } catch (error) {
          console.error("Error resuming AudioContext:", error);
        }
      }
    }

    document.addEventListener("touchstart", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("click", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("keydown", resumeAudioContextOnInteraction, { once: true });
    console.log("Audio resume listeners attached.");

    if (!actx || actx === null) {
      console.error("AudioContext is not initialized.");
      alert("AudioContext is not initialized. Please check the console for details.");
      return;
    async function createAudioWorkletNode() {
      try {
        await actx.audioWorklet.addModule("src/fretboard-processor.js"); // Path to the processor file
        fretboardNode = new AudioWorkletNode(
          actx,
          "fretboard-processor",
        ); // Use the processor's registered name

        // Connect the AudioWorkletNode to the destination
        fretboardNode.connect(actx.destination);

        // Create a gain node
        const gainNode = actx.createGain();
        gainNode.gain.value = 0.5; // Set initial gain value
        fretboardNode.connect(gainNode);
        gainNode.connect(actx.destination);

        console.log("AudioWorkletNode connected to destination with gain control");

      } catch (error) {
        console.error(new Date().toISOString(), "Failed to add audio worklet module:", error.name, error.message, error.stack);
        alert(
          "Failed to add audio worklet module. Please check the console for details.",
        );
        // Retry after a delay
        setTimeout(createAudioWorkletNode, 1000); // Retry after 1 second
      }
    }

    await createAudioWorkletNode();

    // Attach the event listeners for user interaction *after* context is created
    // Use { once: true } so they only fire once per type
    document.addEventListener("touchstart", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("click", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("keydown", resumeAudioContextOnInteraction, { once: true });
    console.log("Audio resume listeners attached.");

    console.log("Audio initialized successfully");

  } catch (error) {
    console.error("Failed to initialize audio:", error);
    alert(
      "Failed to initialize audio playback. Please check your browser settings and the console.",
    );
  }
}

/**
 * Loads a sound (not currently used).
 */
export async function loadSound() { // Added export
  // Placeholder function for loading a sound
  // In a future version, this function would handle loading a sound file.
  alert("Sound loading not yet implemented.");
}

/**
 * Plays a single note using the AudioWorkletNode.
 * @param {string} note - The note to play (e.g., "E4").
 * @param {number} duration - The duration of the note in seconds (not fully implemented).
 */
function playNote(note, duration) {
  //console.log("audio.js: playNote called with", note, duration);

  if (!fretboardNode) {
    console.warn("AudioWorkletNode not initialized.");
    return;
  }

  fretboardNode.port.postMessage({
    type: "noteOn",
    note: note,
    velocity: 0.75, // Example: Set velocity
  });
}

/**
 * Plays a sound (not currently used).
 */
export function playSound() { // Added export
  // Placeholder function for playing a sound
  // In a future version, this function would handle playing a sound.
  alert("Sound playing not yet implemented.");
}

/**
 * Stops the audio playback.
 */
export function stopPlayback() { // Added export
  console.log("audio.js: stopPlayback called");
  if (!isPlaying) {
    console.log("No playback in progress, ignoring.");
    return;
  }
  isPlaying = false;
  clearInterval(playbackInterval);
  currentMeasureIndex = 0;
  currentFretIndex = 0;

  if (fretboardNode) {
    fretboardNode.port.postMessage({ type: "allNotesOff" }); // Send message to stop all notes
  }
}

/**
 * Exports the tab data as a MIDI file (placeholder).
 */
export function exportMIDI() { // Added export
  // Placeholder function for MIDI export
  // In a future version, this function would handle MIDI file generation and download.
  //alert("MIDI export not yet implemented.");

  // Basic MIDI export implementation (placeholder)
  const tabData = getTabData();
  if (!tabData || !tabData.measures || tabData.measures.length === 0) {
    alert("No tab data to export.");
    return;
  }

  // Create a basic MIDI file (this is a simplified example and may not be fully functional)
  let midiContent = "data:audio/midi;base64,TVRoZAAAAAYAAAABN..."; // Replace with actual MIDI data

  // Create a download link
  const link = document.createElement("a");
  link.href = midiContent;
  link.download = "guitar_tab.mid";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Plays the entire tab.
 * @param {object} tabData - The tab data object.
 */
export async function playTab(tabData) { // Added export and kept async
  console.log("audio.js: playTab called");

  // Ensure the AudioContext is running
  if (actx.state === "suspended") {
    try {
      await actx.resume();
      console.log("AudioContext resumed successfully");
    } catch (error) {
      console.error("Error resuming AudioContext:", error);
      alert("Failed to resume AudioContext. The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page. Please interact with the page and try again.");
      return;
    }
  }

  if (isPlaying) {
    stopPlayback();
  }

  if (!tabData || !tabData.measures || tabData.measures.length === 0) {
    alert("No tab data to play.");
    return;
  }

  bpm = tabData.bpm || 120; // Use tabData BPM or default
  const sixteenthNoteDuration = 60 / bpm / 4; // Recalculate based on BPM
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
      if (fretValue !== "" && fretValue !== undefined) {
        const note = getNote(
          stringIndex,
          parseInt(fretValue),
          tabData.tuning,
        );
        playNote(note, sixteenthNoteDuration); // Play the note
      }
    }

    function playNextFret() {
      if (!isPlaying) {
        return;
      }
      if (fretIndex < 4) {
        // Assuming 4 frets per beat (0,1,2,3)
        fretIndex++;
        for (let stringIndex = 0; stringIndex < NUMBER_OF_STRINGS; stringIndex++) {
          playFret(stringIndex);
        }
        setTimeout(playNextFret, sixteenthNoteDuration * 1000); // Play each fret for the duration
      } else {
        currentFretIndex = 0;
        playNextMeasure();
      }
    }

    // Start playing the first fret of the measure
    for (let stringIndex = 0; stringIndex < NUMBER_OF_STRINGS; stringIndex++) {
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

// Removed combined export block at the end
