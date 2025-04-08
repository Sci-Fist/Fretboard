// src/app.js
// Main app logic - setting things up and making it go!

import * as rendering from './rendering.js';
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab } from './tab-data.js';
import { setupToolBar, handleFretInput, showNumberCircle } from './ui-elements.js';
import { playTab, stopPlayback, exportMIDI } from './audio.js'; // Import audio functions
import { actx } from './audio.js'; // Import the AudioContext
import config from '../config.js'; // Import config

console.log("app.js: Starting app.js");

// Add a function to resume the AudioContext on user interaction
function resumeAudioContextOnInteraction() {
  if (actx.state === "suspended") {
    actx.resume().then(() => {
      console.log("AudioContext resumed successfully");
    });
  }
}

// Attach the event listeners for user interaction
document.addEventListener("touchstart", resumeAudioContextOnInteraction, false);
document.addEventListener("click", resumeAudioContextOnInteraction, false);
document.addEventListener("keydown", resumeAudioContextOnInteraction, false);

/**
 * Sets up the entire application.
 */
async function setupApp() {
  console.log("app.js: setupApp called");
  try {
    initializeTabData();
    rendering.renderTab(getTabData());
    setupUI();
    // Config variables and log are now inside setupUI.
  } catch (error) {
    console.error("app.js: Error during app setup:", error);
    alert("Failed to initialize the application. Please check the console for details.");
  }
  console.log("app.js: Finished setupApp");
}
