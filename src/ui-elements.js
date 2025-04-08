// src/ui-elements.js
// This module handles the user interface elements and their interactions.
// It sets up the toolbar, handles fret input, and displays the number circle for fret selection.

/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 * @param {object} dependencies - Object containing functions from other modules.
 */
function setupToolBar(dependencies) {
  const {
    addMeasure,
    clearTab,
    exportTab,
    showBPMInput,
    playTab,
    stopPlayback,
    saveTab,
    loadTab,
    exportMIDI,
    renderTab,
    getTabData,
    setTabData,
  } = dependencies;

  // Select buttons by their specific IDs
  const addMeasureButton = document.getElementById("addMeasureBtn");
  const clearTabButton = document.getElementById("clearTabBtn");
  const exportTabButton = document.getElementById("exportTabBtn");
  const showBPMInputButton = document.getElementById("setBPMBtn");
  const playTabButton = document.getElementById("playTabBtn");
  const stopTabButton = document.getElementById("stopTabBtn");
  const saveTabButton = document.getElementById("saveTabBtn");
  const loadTabButton = document.getElementById("loadTabBtn");
  const exportMIDButton = document.getElementById("exportMIDIBtn");

  // Add event listeners only if the button exists
  if (addMeasureButton) {
    addMeasureButton.addEventListener("click", () => {
      addMeasure();
      renderTab(getTabData());
    });
  } else {
    console.error("Button with ID 'addMeasureBtn' not found.");
  }

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
    exportTabButton.addEventListener("click", exportTab);
  } else {
    console.error("Button with ID 'exportTabBtn' not found.");
  }

  if (showBPMInputButton) {
    showBPMInputButton.addEventListener("click", showBPMInput);
  } else {
    console.error("Button with ID 'setBPMBtn' not found.");
  }

  if (playTabButton) {
    playTabButton.addEventListener("click", () => {
      try {
        playTab(getTabData());
        playTabButton.style.display = "none";
        playTabButton.setAttribute("aria-pressed", "false");
        if (stopTabButton) {
          stopTabButton.style.display = "inline-block";
          stopTabButton.setAttribute("aria-pressed", "true");
          stopTabButton.focus(); // Move focus to stop button
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
        if (stopTabButton) {
          stopTabButton.style.display = "none";
          stopTabButton.setAttribute("aria-pressed", "false");
        }
      }
    });
  } else {
    console.error("Button with ID 'playTabBtn' not found.");
  }

  if (stopTabButton) {
    stopTabButton.addEventListener("click", () => {
      try {
        stopPlayback();
      } finally {
        // Ensure button states are reset regardless of stopPlayback success/failure
        stopTabButton.style.display = "none";
        stopTabButton.setAttribute("aria-pressed", "false");
        if (playTabButton) {
          playTabButton.style.display = "inline-block";
          playTabButton.setAttribute("aria-pressed", "false"); // Ensure play is not pressed
          playTabButton.focus(); // Move focus back to play button
        }
      }
    });
  } else {
    console.error("Button with ID 'stopTabBtn' not found.");
  }

  if (saveTabButton) {
    saveTabButton.addEventListener("click", saveTab);
  } else {
    console.error("Button with ID 'saveTabBtn' not found.");
  }

  if (loadTabButton) {
    loadTabButton.addEventListener("click", loadTab);
  } else {
    console.error("Button with ID 'loadTabBtn' not found.");
  }

  if (exportMIDButton) {
    exportMIDButton.addEventListener("click", exportMIDI);
  } else {
    console.error("Button with ID 'exportMIDIBtn' not found.");
  }

  console.log("ui-elements.js: Toolbar setup complete");
}

function generateTablature(tabData) {
  if (!tabData || !tabData.measures || tabData.measures.length === 0) {
    return "No tab data.";
  }

  let tabString = "";
  const tuning = tabData.tuning;
  const stringLabels = tuning
    .map((_, i) => ["E", "A", "D", "G", "B", "e"][i] || "")
    .join("\n");

  tabData.measures.forEach((measure, measureIndex) => {
    tabString += `${measureIndex + 1}. Measure:\n`;
    for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
      tabString += `${stringLabels.split("\n")[stringIndex]}|`;
      for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
        tabString += measure.strings[stringIndex][fretIndex] || "-";
        tabString += "|";
      }
      tabString += "\n";
    }
    tabString += "\n";
  });

  return tabString;
}

/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 * @param {function} getTabData - Function to get tab data.
 * @param {function} setTabData - Function to set tab data.
 * @param {function} renderTab - Function to render the tab.
 */
function handleFretInput(e, getTabData, setTabData, renderTab) {
  let shouldUpdateDisplay = false;
  const fretElement = e.target;
  const measureIndex = parseInt(fretElement.dataset.measure);
  const stringIndex = parseInt(fretElement.dataset.string);
  const fretIndex = parseInt(fretElement.dataset.fret);
  let value = fretElement.textContent.replace(/[^0-9]/g, "").slice(0, 2); // Allow only numbers, max 2 digits

  const tabData = getTabData();
  if (tabData.measures[measureIndex]) {
    // Only update and re-render if the value actually changed
    if (
      tabData.measures[measureIndex].strings[stringIndex][fretIndex] !== value
    ) {
      tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
      setTabData(tabData);
      shouldUpdateDisplay = true;
    }
  }

  if (shouldUpdateDisplay) {
    renderTab(getTabData()); // Re-render the tab after data update
    // Find the specific fret element again after re-render to set its text content
    const updatedFretElement = document.querySelector(
      `.fret[data-measure='${measureIndex}'][data-string='${stringIndex}'][data-fret='${fretIndex}']`,
    );
    if (updatedFretElement) {
      updatedFretElement.textContent = value; // Update displayed text on the *newly rendered* element
      // Optionally set focus back if needed
      // updatedFretElement.focus();
      // Move cursor to end (complex, might not be needed for simple numeric input)
    } else {
      console.warn(
        "handleFretInput: Could not find fret element after re-render.",
      );
    }
  } else if (fretElement.textContent !== value) {
    // If only the display text needs correction (e.g., invalid chars removed)
    fretElement.textContent = value;
  }
}

/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */
function showNumberCircle(fret) {
  // Remove any existing number circle
  removeOpenNumberCircle();

  const circle = document.createElement("div");
  circle.className = "number-circle";
  const radius = 50;
  const centerX = fret.offsetWidth / 2;
  const centerY = fret.offsetHeight / 2;

  const numbers = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "1x",
    "2x",
  ];

  numbers.forEach((num, i) => {
    const angle = (i / numbers.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const number = document.createElement("div");
    number.className = "number";
    number.textContent = num;
    number.style.left = `${x}px`;
    number.style.top = `${y}px`;
    number.style.animationDelay = `${i * 0.1}s`;

    number.onclick = () => {
      if (num === "1x" || num === "2x") {
        removeOpenNumberCircle();
        showSecondNumberCircle(fret, num);
      } else {
        fret.textContent = num; // Set the text first
        // Dispatch an input event so handleFretInput updates the data model and handles re-rendering
        fret.dispatchEvent(
          new Event("input", { bubbles: true, cancelable: true }),
        );
        removeOpenNumberCircle(); // Remove the circle after dispatching, using the dedicated function
      }
    };
    circle.appendChild(number);
  });

  if (typeof document !== "undefined") {
    document.body.appendChild(circle);
    positionNumberCircle(circle, fret);
  }
}

/**
 * Removes any open number circle from the DOM.
 */
function removeOpenNumberCircle() {
  const openCircle = document.querySelector(".number-circle");
  if (openCircle) {
    openCircle.remove();
  }
}

/**
 * Positions the number circle relative to the fret element.
 * @param {HTMLElement} circle - The number circle element.
 * @param {HTMLElement} fret - The fret element.
 */
function positionNumberCircle(circle, fret) {
  const fretRect = fret.getBoundingClientRect();
  circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`;
  circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`;
}

/**
 * Displays the second number circle for bends and slides.
 * @param {HTMLElement} fret - The fret element.
 * @param {string} firstDigit - The first digit selected ("1x" or "2x").
 */
function showSecondNumberCircle(fret, firstDigit) {
  removeOpenNumberCircle(); // Remove any existing number circle

  const circle = document.createElement("div");
  circle.className = "number-circle";
  circle.classList.add("second-number-circle");
  const radius = 50;
  const centerX = fret.offsetWidth / 2;
  const centerY = fret.offsetHeight / 2;

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  numbers.forEach((num, i) => {
    const angle = (i / numbers.length) * 2 * Math.PI;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const number = document.createElement("div");
    number.className = "number";
    number.textContent = num;
    number.style.left = `${x}px`;
    number.style.top = `${y}px`;
    number.style.animationDelay = `${i * 0.1}s`;

    number.onclick = () => {
      fret.textContent = firstDigit.replace(/x/, num); // Set the text first
      // Dispatch an input event so handleFretInput updates the data model and handles re-rendering
      fret.dispatchEvent(
        new Event("input", { bubbles: true, cancelable: true }),
      );
      removeOpenNumberCircle(); // Remove the circle after dispatching, using the dedicated function
    };
    circle.appendChild(number);
  });

  if (typeof document !== "undefined") {
    document.body.appendChild(circle);
    positionNumberCircle(circle, fret);
  }
}

// Close number circle when clicking outside
if (typeof document !== "undefined") {
  document.addEventListener("click", function (event) {
    const numberCircle = document.querySelector(".number-circle");
    if (numberCircle) {
      let isClickInside = numberCircle.contains(event.target);
      let isClickOnFret = event.target.classList.contains("fret");

      if (!isClickInside && !isClickOnFret) {
        setTimeout(() => {
          if (!event.target.closest(".number-circle")) {
            removeOpenNumberCircle(); // Use dedicated function to remove
          }
        }, 100);
      }
    }
  });
}

export {
  setupToolBar,
  handleFretInput,
  showNumberCircle,
  showSecondNumberCircle,
};
import { stopPlayback } from "./audio.js";
