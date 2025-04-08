// src/ui-elements.js
// This module handles the user interface elements and their interactions.
// It sets up the toolbar, handles fret input, and displays the number circle for fret selection.
import { stopPlayback } from "./audio.js"; // Moved import to the top

/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 * @param {object} dependencies - Object containing functions from other modules.
 */
function setupToolBar(dependencies) {
  const {
    addMeasure,
    clearTab,
    exportTab,
    // showBPMInput, // Removed showBPMInput
    playTab,
    pauseTab, // ADDED pauseTab
    stopPlayback, // Renamed to stopPlayback to match dependency name
    saveTab,
    loadTab,
    exportMIDI,
    renderTab,
    getTabData,
    setTabData,
    toggleMeasureRotation, // ADDED toggleMeasureRotation from dependencies
  } = dependencies;

  // Select buttons by their specific IDs
  const addMeasureButton = document.getElementById("addMeasureBtn");
  const clearTabButton = document.getElementById("clearTabBtn");
  const exportTabButton = document.getElementById("exportTabBtn");
  // const showBPMInputButton = document.getElementById("setBPMBtn"); // No longer a button
  const playTabButton = document.getElementById("playTabBtn");
  const pauseTabButton = document.getElementById("pauseTabBtn"); // Pause button
  const stopTabButton = document.getElementById("stopTabBtn");
  const saveTabButton = document.getElementById("saveTabBtn");
  const loadTabButton = document.getElementById("loadTabBtn");
  const exportMIDButton = document.getElementById("exportMIDIBtn");
  const rotateMeasureButton = document.getElementById("rotateMeasureBtn"); // Rotate measure button

  // Add event listeners only if the button exists
  if (addMeasureButton) {
    addMeasureButton.addEventListener("click", () => {
      addMeasure();
      renderTab(getTabData());
    });
  }
  // Removed duplicate Load Tab button logic block

  if (clearTabButton) {
    clearTabButton.addEventListener("click", () => {
      clearTab();
      addMeasure(); // Add an initial measure after clearing
      renderTab(getTabData());
    });
  } else {
    console.error("Button with ID 'clearTabBtn' not found.");
  }

  if (exportTabButton) {
    // Use the passed exportTab function directly
    exportTabButton.addEventListener("click", exportTab);
  } else {
    console.error("Button with ID 'exportTabBtn' not found.");
  }

  // BPM input is now handled directly in app.js
  // if (showBPMInputButton) {
  //     // Use the passed showBPMInput function directly
  //     showBPMInputButton.addEventListener("click", showBPMInput);
  // } else {
  //     console.error("Button with ID 'setBPMBtn' not found.");
  // }

  if (playTabButton) {
    playTabButton.addEventListener("click", () => {
      try {
        playTab(); // Use the playTab function passed as dependency
        playTabButton.style.display = "none";
        playTabButton.setAttribute("aria-pressed", "false");
        if (pauseTabButton) { // Show pause button instead of stop
          pauseTabButton.style.display = "inline-block";
          pauseTabButton.setAttribute("aria-pressed", "true");
          pauseTabButton.focus(); // Move focus to pause button
        }
        if (stopTabButton) {
          stopTabButton.style.display = "inline-block";
          stopTabButton.setAttribute("aria-pressed", "true");
        }
      } catch (err) {
        console.error("Error initiating playback:", err);
        alert(
          "There was an error playing the tab. Please check the console for more details.",
        ); // User-friendly message
        // Ensure UI is reset if playTab fails immediately
        stopPlayback(); // Call stopPlayback to clean up potentially partially started audio
        playTabButton.style.display = "inline-block";
        playTabButton.setAttribute("aria-pressed", "false");
        if (pauseTabButton) {
          pauseTabButton.style.display = "none";
          pauseTabButton.setAttribute("aria-pressed", "false");
        }
        if (stopTabButton) {
          stopTabButton.style.display = "none";
          stopTabButton.setAttribute("aria-pressed", "false");
        }
      }
    });
  } else {
    console.error("Button with ID 'playTabBtn' not found.");
  }

  if (pauseTabButton) { // Event listener for PAUSE button
    pauseTabButton.addEventListener("click", () => {
      if (pauseTab) {
        pauseTab(); // Call the pauseTab function passed as dependency
      }
      // Update button states for pause
      pauseTabButton.style.display = "none";
      pauseTabButton.setAttribute("aria-pressed", "false");
      if (playTabButton) {
        playTabButton.style.display = "inline-block";
        playTabButton.setAttribute("aria-pressed", "false"); // Ensure play is not pressed
        playTabButton.focus(); // Move focus back to play button
      }
    });
  } else {
    console.error("Button with ID 'pauseTabBtn' not found.");
  }


  if (stopTabButton) {
    stopTabButton.addEventListener("click", () => {
      if (stopPlayback) {
        stopPlayback(); // Use the stopPlayback function passed as dependency
      }
      // Update button states for stop
      stopTabButton.style.display = "none";
      stopTabButton.setAttribute("aria-pressed", "false");
      if (pauseTabButton) {
        pauseTabButton.style.display = "none";
        pauseTabButton.setAttribute("aria-pressed", "false");
      }
      if (playTabButton) {
        playTabButton.style.display = "inline-block";
        playTabButton.setAttribute("aria-pressed", "false");
        playTabButton.focus(); // Move focus to play button after stop
      }
    });
  } else {
    console.error("Button with ID 'stopTabBtn' not found.");
  }

  if (saveTabButton) {
    // Use the passed saveTab function directly
    saveTabButton.addEventListener("click", saveTab);
  } else {
    console.error("Button with ID 'saveTabBtn' not found.");
  }

  if (loadTabButton) {
    // Use the passed loadTab function directly
    loadTabButton.addEventListener("click", loadTab);
  } else {
    console.error("Button with ID 'loadTabBtn' not found.");
  }
  // Removed duplicate Load Tab button logic block

  if (exportMIDButton) {
    // Use the passed exportMIDI function directly
    exportMIDButton.addEventListener("click", exportMIDI);
  } else {
    console.error("Button with ID 'exportMIDIBtn' not found.");
  }
  // Removed duplicate Save Tab button logic blocks
  // Removed inline Export Tab button logic block (now uses dependency)

  if (rotateMeasureButton) {
    rotateMeasureButton.addEventListener("click", () => {
      toggleMeasureRotation(); // Call the toggle function from dependencies
      renderTab(getTabData()); // Re-render to apply/remove rotation
    });
  } else {
    console.error("Button with ID 'rotateMeasureBtn' not found.");
  }


  console.log("ui-elements.js: Toolbar setup complete");
}


/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 * @param {function} getTabData - Function to get tab data.
 * @param {function} setTabData - Function to set tab data.
 * @param {function} renderTab - Function to render the tab.
 */
// ... (rest of ui-elements.js is unchanged) ...


export {
  setupToolBar,
  handleFretInput,
  showNumberCircle,
  showSecondNumberCircle,
  removeOpenNumberCircle, // Add this export
  removeActiveFretClass // Export the function
};
