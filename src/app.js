// src/app.js
// Main app logic - setting things up and making it go!

import * as rendering from './rendering.js';
import { initializeTabData, getTabData, setTabData, addMeasure, clearTab } from './tab-data.js';
import { setupToolBar, handleFretInput, showNumberCircle } from './ui-elements.js';
import { playTab, stopPlayback, exportMIDI } from './audio.js';
import config from '../config.js';

console.log("app.js: Starting app.js");

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
