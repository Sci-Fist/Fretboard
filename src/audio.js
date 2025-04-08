// src/audio.js
// This module handles audio context and playback functionalities.

let actx; // Audio context
let fretboardNode; // Custom AudioWorkletNode
let gainNode;     // Gain node for volume control (if needed later)

export async function initializeAudio() { // Added export
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();

    // --- Define resumeAudioContextOnInteraction here, before it's used ---
    async function resumeAudioContextOnInteraction() {
      console.log("resumeAudioContextOnInteraction called. actx is:", actx); // Add this log
      // Check if actx is initialized *and* suspended before resuming
      if (actx && actx.state === "suspended") {
        try {
          await actx.resume();
          console.log("AudioContext resumed successfully.");
        } catch (resumeError) {
          console.error("Error resuming AudioContext:", resumeError);
        }
      } else {
        console.log("AudioContext state was not suspended, or context not initialized.");
      }
      // Detach listeners after first successful resume attempt
      document.removeEventListener("mousedown", resumeAudioContextOnInteraction);
      document.removeEventListener("touchstart", resumeAudioContextOnInteraction);
      document.removeEventListener("keydown", resumeAudioContextOnInteraction);
    }

    // Attach event listeners for user interaction *after* context is created
    // Use { once: true } so they only fire once per type
    document.addEventListener("mousedown", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("touchstart", resumeAudioContextOnInteraction, { once: true });
    document.addEventListener("keydown", resumeAudioContextOnInteraction, { once: true });

    console.log("Audio resume listeners attached.");


    async function createAudioWorkletNode() {
      try {
        await actx.audioWorklet.addModule("src/fretboard-processor.js"); // Path to the processor file
          fretboardNode = new AudioWorkletNode(
            actx,
          "fretboard-processor",
        ); // Use the processor's registered name

        // Connect the AudioWorkletNode to the destination
        fretboardNode.connect(actx.destination);

        console.log("AudioWorkletNode created and connected.");
      } catch (workletError) {
        console.error("Error creating AudioWorkletNode:", workletError);
      }
    }

    await createAudioWorkletNode();


  } catch (error) {
    console.error("Error initializing audio system:", error);
  }
}


export async function playTab(tabData) {
  if (!actx || !fretboardNode) {
    console.error("Audio system not initialized or AudioWorkletNode missing.");
    return;
  }

  // Basic error checks - expand as needed
  if (!tabData || !tabData.measures || tabData.measures.length === 0) {
    console.warn("No tab data to play or tabData is invalid.");
    return;
  }

  // --- Simple Playback Logic ---
  const bpm = tabData.bpm || 120;
  const secondsPerBeat = 60 / bpm;
  const notesPerMeasure = 4; // Assuming 4 notes per measure for simplicity
  const secondsPerNote = secondsPerBeat / notesPerMeasure;

  let currentTime = actx.currentTime; // Start at current audio context time

  for (const measure of tabData.measures) {
    for (let stringIndex = 0; stringIndex < measure.strings.length; stringIndex++) {
      for (let fretIndex = 0; fretIndex < measure.strings[stringIndex].length; fretIndex++) {
        const fretValue = measure.strings[stringIndex][fretIndex];
        if (fretValue !== '') {
          const note = getNote(stringIndex, parseInt(fretValue), tabData.tuning); // Assuming getNote is available
          if (note) {
            // Schedule note on message
            fretboardNode.port.postMessage({
              type: 'noteOn',
              note: note,
              velocity: 0.8, // Example velocity
            });

            // Schedule note off message (after note duration) -  For now, just a fixed duration
            const noteOffTime = currentTime + secondsPerNote * 0.9; // Shorten note slightly
            const noteDuration = secondsPerNote * 0.9; // Example duration

            // Basic note off implementation - sending 'allNotesOff' might be too abrupt for individual notes
             setTimeout(() => {
                fretboardNode.port.postMessage({ type: 'allNotesOff' }); // Send note off message
             }, noteDuration * 1000); // setTimeout in milliseconds


            currentTime += secondsPerNote; // Advance time for next note
          }
        } else {
          currentTime += secondsPerNote; // Still advance time even if no note
        }
      }
    }
  }
}


export function stopPlayback() {
  if (fretboardNode) {
    fretboardNode.port.postMessage({ type: 'allNotesOff' });
    console.log("Playback stopped and notes turned off.");
  } else {
    console.warn("stopPlayback called but AudioWorkletNode is not initialized.");
  }
}


export async function exportMIDI() {
    alert("MIDI Export functionality is not yet implemented."); // Placeholder
    console.log("exportMIDI() called - functionality not implemented yet.");
    // Future MIDI export logic here
}

// Placeholder getNote function - replace with actual implementation from tab-data.js
function getNote(stringIndex, fretNumber, tuning) {
    const notes = ['E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#'];
    const baseNote = tuning[stringIndex];
    const baseIndex = notes.indexOf(baseNote);
    const noteIndex = (baseIndex + fretNumber) % 12;
    const octave = Math.floor((baseIndex + fretNumber) / 12) + 2; // Determine octave
    return notes[noteIndex] + octave;
}
