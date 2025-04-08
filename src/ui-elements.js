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
    addMeasure, // Now handleAddMeasureWithInput from app.js
    clearTab,
    exportTab,
    playTab,
    pauseTab, // ADDED pauseTab
    stopPlayback, // Renamed to stopPlayback to match dependency name
    saveTab,
    loadTab,
    renderTab,
    getTabData,
    setTabData,
    toggleMeasureRotation, // ADDED toggleMeasureRotation from dependencies
  } = dependencies;

  // Select buttons by their specific IDs
  const addMeasureButton = document.getElementById("addMeasureBtn");
  const clearTabButton = document.getElementById("clearTabBtn");
  const exportTabButton = document.getElementById("exportTabBtn");
  const playTabButton = document.getElementById("playTabBtn");
  const pauseTabButton = document.getElementById("pauseTabBtn"); // Pause button
  const stopTabButton = document.getElementById("stopTabBtn");
  const saveTabButton = document.getElementById("saveTabBtn");
  const loadTabButton = document.getElementById("loadTabBtn");
  const rotateMeasureButton = document.getElementById("rotateMeasureBtn"); // Rotate measure button

  // Add event listeners only if the button exists
  if (addMeasureButton) {
    addMeasureButton.addEventListener("click", addMeasure);
    addMeasureButton.title = "Add a new measure (Ctrl+M)"; // Tooltip
  }
  // Removed duplicate Load Tab button logic block

  if (clearTabButton) {
    clearTabButton.addEventListener("click", () => {
      clearTab();
      addMeasure(); // Add an initial measure after clearing
      renderTab(getTabData());
    });
    clearTabButton.title = "Clear the entire tab (Ctrl+Shift+C)"; // Tooltip
  } else {
    console.error("Button with ID 'clearTabBtn' not found.");
  }

  if (exportTabButton) {
    // Use the passed exportTab function directly
    exportTabButton.addEventListener("click", exportTab);
    exportTabButton.title = "Export tab as text file (Ctrl+E)"; // Tooltip
  } else {
    console.error("Button with ID 'exportTabBtn' not found.");
  }

  if (playTabButton) {
    playTabButton.addEventListener("click", playTab); // Use the playTab function passed as dependency
    playTabButton.title = "Play the tab (Spacebar)"; // Tooltip
  } else {
    console.error("Button with ID 'playTabBtn' not found.");
  }

  if (pauseTabButton) { // Event listener for PAUSE button
    pauseTabButton.addEventListener("click", () => {
      if (pauseTab) {
        pauseTab(); // Call the pauseTab function passed as dependency
      }
    });
    pauseTabButton.title = "Pause the tab (Spacebar)"; // Tooltip
  } else {
    console.error("Button with ID 'pauseTabBtn' not found.");
  }


  if (stopTabButton) {
    stopTabButton.addEventListener("click", () => {
      if (stopPlayback) {
        stopPlayback(); // Use the stopPlayback function passed as dependency
      }
    });
    stopTabButton.title = "Stop playback (Esc)"; // Tooltip
  } else {
    console.error("Button with ID 'stopTabBtn' not found.");
  }

  if (saveTabButton) {
    // Use the passed saveTab function directly
    saveTabButton.addEventListener("click", saveTab);
    saveTabButton.title = "Save tab to local storage (Ctrl+S)"; // Tooltip
  } else {
    console.error("Button with ID 'saveTabBtn' not found.");
  }

  if (loadTabButton) {
    // Use the passed loadTab function directly
    loadTabButton.addEventListener("click", loadTab);
    loadTabButton.title = "Load tab from local storage (Ctrl+O)"; // Tooltip
  } else {
    console.error("Button with ID 'loadTabBtn' not found.");
  }
  // Removed duplicate Load Tab button logic block

  if (rotateMeasureButton) {
    rotateMeasureButton.addEventListener("click", () => {
      toggleMeasureRotation(); // Call the toggle function from dependencies
      renderTab(getTabData()); // Re-render to apply/remove rotation
    });
    rotateMeasureButton.title = "Rotate measure (Ctrl+R)"; // Tooltip
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
function handleFretInput(e, getTabData, setTabData, renderTab) {
    const fretElement = e.target;
    const measureIndex = parseInt(fretElement.dataset.measure);
    const stringIndex = parseInt(fretElement.dataset.string);
    const fretIndex = parseInt(fretElement.dataset.fret);
    let value = fretElement.textContent.replace(/[^0-9]/g, "").slice(0, 2); // Allow only numbers, max 2 digits

    const tabData = getTabData();
    if (tabData.measures[measureIndex]) {
        tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
        setTabData(tabData);
        renderTab(getTabData()); // Re-render after input
    }
}


/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */
function showNumberCircle(fret) {
  // Remove any existing number circle
  removeOpenNumberCircle();

  // Remove active class from any previously active fret
  removeActiveFretClass();
  // Add active class to the currently focused fret
  fret.classList.add('active-fret');
  // Store the active fret's ID in localStorage so it can be re-applied after re-render
  localStorage.setItem('activeFretId', fret.id);


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
        fret.focus(); // Re-focus the fret after input
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
 * Removes the 'active-fret' class from any fret that has it.
 */
function removeActiveFretClass() {
    document.querySelectorAll('.fret.active-fret').forEach(fret => {
        fret.classList.remove('active-fret');
    });
    localStorage.removeItem('activeFretId'); // Clear stored active fret ID
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
      fret.focus(); // Re-focus the fret after input
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

  // Remove active fret class when clicking outside of frets
  document.addEventListener('click', function(event) {
    if (!event.target.classList.contains('fret')) {
      removeActiveFretClass();
    }
  });
}


export {
  setupToolBar,
  handleFretInput,
  showNumberCircle,
  showSecondNumberCircle,
  removeOpenNumberCircle, // Add this export
  removeActiveFretClass // Export the function
};
