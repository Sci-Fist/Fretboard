// src/ui-elements.js
// UI elements and interactions

/**
 * Sets up the toolbar with action buttons and their event listeners.
 * @param {object} dependencies - Object containing functions to handle actions.
 */
export function setupToolBar(dependencies) {
  console.log("ui-elements.js: setupToolBar called with dependencies:", dependencies);
  const {
    addMeasure,
    clearTab,
    exportTab,
    playTab,
    pauseTab,
    stopPlayback,
    saveTab,
    loadTab,
    renderTab,
    getTabData,
    setTabData,
    toggleMeasureRotation,
  } = dependencies;

  // --- Button Event Listeners ---
  // Add Measure Button
  const addMeasureButton = document.getElementById('addMeasureBtn');
  if (addMeasureButton) {
    addMeasureButton.addEventListener('click', () => {
      console.log("ui-elements.js: addMeasureButton clicked");
      addMeasure(); // Call the addMeasure function from dependencies
    });
  } else {
    console.error("ui-elements.js: addMeasureButton not found");
  }

  // Clear Tab Button
  const clearButton = document.getElementById('clearTabBtn');
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      console.log("ui-elements.js: clearButton clicked");
      clearTab(); // Call the clearTab function from dependencies
      renderTab(getTabData()); // Re-render the tab after clearing data
    });
  } else {
    console.error("ui-elements.js: clearTabBtn not found");
  }

  // Export Tab Button
  const exportButton = document.getElementById('exportTabBtn');
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      console.log("ui-elements.js: exportButton clicked");
      exportTab(); // Call the exportTab function from dependencies
    });
  } else {
    console.error("ui-elements.js: exportTabBtn not found");
  }

  // Play Tab Button
  const playButton = document.getElementById('playTabBtn');
  if (playButton) {
    playButton.addEventListener('click', () => {
      console.log("ui-elements.js: playButton clicked");
      playTab(); // Call the playTab function from dependencies
    });
  } else {
    console.error("ui-elements.js: playTabBtn not found");
  }

    // Pause Tab Button
    const pauseButton = document.getElementById('pauseTabBtn');
    if (pauseButton) {
        pauseButton.addEventListener('click', () => {
            console.log("ui-elements.js: pauseButton clicked");
            pauseTab(); // Call the pauseTab function from dependencies
        });
    } else {
        console.error("ui-elements.js: pauseTabBtn not found");
    }

  // Stop Tab Button
  const stopButton = document.getElementById('stopTabBtn');
  if (stopButton) {
    stopButton.addEventListener('click', () => {
      console.log("ui-elements.js: stopButton clicked");
      stopPlayback(); // Call the stopPlayback function from dependencies
    });
  } else {
    console.error("ui-elements.js: stopTabBtn not found");
  }

  // Save Tab Button
  const saveButton = document.getElementById('saveTabBtn');
  if (saveButton) {
    saveButton.addEventListener('click', () => {
      console.log("ui-elements.js: saveButton clicked");
      saveTab(); // Call the saveTab function from dependencies
    });
  } else {
    console.error("ui-elements.js: saveTabBtn not found");
  }

  // Load Tab Button
  const loadButton = document.getElementById('loadTabBtn');
  if (loadButton) {
    loadButton.addEventListener('click', () => {
      console.log("ui-elements.js: loadButton clicked");
      loadTab(); // Call the loadTab function from dependencies
    });
  } else {
    console.error("ui-elements.js: loadTabBtn not found");
  }

  // Toggle Measure Rotation Button
  const toggleRotationButton = document.getElementById('toggleRotationBtn');
  if (toggleRotationButton) {
    toggleRotationButton.addEventListener('click', () => {
      console.log("ui-elements.js: toggleRotationButton clicked");
      toggleMeasureRotation(); // Call the toggleMeasureRotation function
    });
  } else {
    console.error("ui-elements.js: toggleRotationBtn not found");
  }
}

/**
 * Handles fret input and updates tab data and rendering.
 * @param {Event} event - The input event.
 * @param {function} getTabData - Function to get tab data.
 * @param {function} setTabData - Function to set tab data.
 * @param {function} renderTab - Function to render the tab.
 */
export function handleFretInput(event, getTabData, setTabData, renderTab) {
  const fretElement = event.target;
  let fretValue = fretElement.textContent;

  // Allow only numbers 0-9, 't', 'p', 'h', 'x', or backspace for clearing
  if (!/^[0-9tp hx]*$/.test(fretValue)) {
    // Revert to the last valid input or clear if invalid
    fretElement.textContent = fretValue.slice(0, -1); // remove last char
    return;
  }

  const measureIndex = parseInt(fretElement.dataset.measure);
  const stringIndex = parseInt(fretElement.dataset.string);
  const fretIndex = parseInt(fretElement.dataset.fret);

  if (isNaN(measureIndex) || isNaN(stringIndex) || isNaN(fretIndex)) {
    console.error("ui-elements.js: Dataset indices are not numbers", fretElement.dataset);
    return; // Exit if indices are not valid numbers
  }

  const tabData = getTabData();

  if (!tabData.measures[measureIndex] || !tabData.measures[measureIndex].strings[stringIndex]) {
    console.error("ui-elements.js: Measure or string array is undefined at given index");
    return; // Exit if measure or string is undefined
  }

  tabData.measures[measureIndex].strings[stringIndex][fretIndex] = fretValue;
  setTabData(tabData);
  renderTab(getTabData()); // Re-render the tab to reflect changes
}

/**
 * Shows a number circle on a fret.
 * @param {HTMLElement} fret - The fret element.
 */
export function showNumberCircle(fret) {
  const numberCircle = document.createElement('span');
  numberCircle.className = 'number-circle';
  numberCircle.textContent = fret.textContent;
  fret.textContent = ''; // Clear the fret content
  fret.appendChild(numberCircle); // Append the circle to the fret
}

/**
 * Removes the number circle from a fret and restores the original text.
 * @param {HTMLElement} fret - The fret element.
 */
export function removeOpenNumberCircle(fret) {
  const numberCircle = fret.querySelector('.number-circle');
  if (numberCircle) {
    fret.textContent = numberCircle.textContent; // Restore the original text
    numberCircle.remove(); // Remove the number circle
  }
}

/**
 * Shows a second number circle on a fret (used for double-digit frets).
 * @param {HTMLElement} fret - The fret element.
 */
export function showSecondNumberCircle(fret) {
  if (fret.childNodes.length > 0 && fret.childNodes[0].className === 'number-circle') {
    const existingCircle = fret.childNodes[0];
    const originalNumber = existingCircle.textContent;
    const secondNumberCircle = document.createElement('span');
    secondNumberCircle.className = 'number-circle second-circle';
    secondNumberCircle.textContent = fret.textContent;
    fret.textContent = ''; // Clear fret text again
    existingCircle.textContent = originalNumber; // Restore first number to first circle
    fret.appendChild(existingCircle);
    fret.appendChild(secondNumberCircle);
  } else {
    showNumberCircle(fret); // If no existing circle, just show a normal one
  }
}


/**
 * Removes the active-fret class from all frets.
 */
export function removeActiveFretClass() {
  document.querySelectorAll('.fret.active-fret').forEach(fret => {
    fret.classList.remove('active-fret');
  });
}


/**
 * Sets up event listeners for frets to handle focus and input.
 */
export function setupFretListeners() {
  document.querySelectorAll('.fret').forEach(fret => {
    fret.addEventListener('focus', function(event) {
      console.log('Fret focused:', event.target.id);
      removeActiveFretClass();
      fret.classList.add('active-fret');
      localStorage.setItem('activeFretId', fret.id);
    });

    fret.addEventListener('blur', function(event) {
      console.log('Fret blurred:', event.target.id);
      fret.classList.remove('active-fret');
      localStorage.removeItem('activeFretId');
    });

    fret.addEventListener('keydown', function(event) {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent default arrow key behavior (scrolling)
        handleArrowKeyNavigation(event.key, fret); // Call navigation handler from app.js
      }
    });
  });

  // Remove active fret class when clicking outside of frets
  document.addEventListener('click', function(event) {
    if (!event.target.classList.contains('fret')) {
      removeActiveFretClass();
    }
  });
}

/**
 * Handles arrow key navigation between frets.
 * @param {string} key - The arrow key pressed.
 * @param {HTMLElement} currentFret - The currently focused fret element.
 */
function handleArrowKeyNavigation(key, currentFret) {
  const measureIndex = parseInt(currentFret.dataset.measure);
  const stringIndex = parseInt(currentFret.dataset.string);
  const fretIndex = parseInt(currentFret.dataset.fret);

  let nextFret;

  switch (key) {
      case 'ArrowLeft':
          if (fretIndex > 0) {
              nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex - 1}`);
          } else if (measureIndex > 0) {
              nextFret = document.getElementById(`fret-${measureIndex - 1}-${stringIndex}-3`);
          }
          break;
      case 'ArrowRight':
          if (fretIndex < 3) {
              nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex}-${fretIndex + 1}`);
          } else {
              const nextMeasureIndex = measureIndex + 1;
              if (document.querySelector(`.fret[data-measure='${nextMeasureIndex}'][data-string='${stringIndex}'][data-fret='0']`)) {
                  nextFret = document.getElementById(`fret-${nextMeasureIndex}-${stringIndex}-0`);
              }
          }
          break;
      case 'ArrowUp':
          if (stringIndex > 0) {
              nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex - 1}-${fretIndex}`);
          }
          break;
      case 'ArrowDown':
          if (stringIndex < 5) {
              nextFret = document.getElementById(`fret-${measureIndex}-${stringIndex + 1}-${fretIndex}`);
          }
          break;
  }

  if (nextFret) {
      currentFret.classList.remove('active-fret');
      nextFret.classList.add('active-fret');
      nextFret.focus();
      localStorage.setItem('activeFretId', nextFret.id);
  }
}

/**
 * Shows the context menu for a fret element.
 * @param {Event} e - The contextmenu event.
 */
export function showFretContextMenu(e) {
  console.log("ui-elements.js: showFretContextMenu called");
  // Create the context menu
  const contextMenu = document.createElement('div');
  contextMenu.className = 'context-menu';
  contextMenu.style.position = 'absolute';
  contextMenu.style.backgroundColor = '#333';
  contextMenu.style.color = '#fff';
  contextMenu.style.padding = '5px';
  contextMenu.style.borderRadius = '5px';
  contextMenu.style.zIndex = '1000'; // Ensure it's on top

  // Get the fret element
  const fretElement = e.target;

  // Add menu items
  const menuItems = [
      { text: 'Clear Fret', action: () => { fretElement.textContent = ''; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
      { text: 'Set to 0', action: () => { fretElement.textContent = '0'; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
      { text: 'Set to 1', action: () => { fretElement.textContent = '1'; handleFretInput({ target: fretElement }, getTabData, setTabData, renderTab); } },
      // Add more menu items as needed
  ];

  menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.textContent = item.text;
      menuItem.style.padding = '5px';
      menuItem.style.cursor = 'pointer';
      menuItem.addEventListener('mouseover', () => { menuItem.style.backgroundColor = '#555'; });
      menuItem.addEventListener('mouseout', () => { menuItem.style.backgroundColor = '#333'; });
      menuItem.addEventListener('click', item.action);
      contextMenu.appendChild(menuItem);
  });

  // Position the context menu
  contextMenu.style.left = `${e.clientX}px`;
  contextMenu.style.top = `${e.clientY}px`;

  // Append the context menu to the body
  document.body.appendChild(contextMenu);

  // Remove the context menu when clicking outside, *except* when clicking on a fret
  document.addEventListener('click', function removeContextMenu(event) {
      if (!contextMenu.contains(event.target) && !event.target.classList.contains('fret')) {
          contextMenu.remove();
          document.removeEventListener('click', removeContextMenu); // Remove the listener after use
      }
  });
}
