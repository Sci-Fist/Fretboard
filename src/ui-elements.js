// ui-elements.js
// Handles UI elements and interactions

import { addMeasure, clearTab, renderTab, exportTab, getTabData } from './app.js';
import { setTabData } from './tab-data.js';
import { stopPlayback } from './audio.js';
import { showBPMInput, saveTab, loadTab, exportMIDI } from './app.js';

/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 */
function handleFretInput(e) {
    const measureIndex = parseInt(e.target.dataset.measure);
    const stringIndex = parseInt(e.target.dataset.string);
    const fretIndex = parseInt(e.target.dataset.fret);
    let value = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2); // Allow only numbers, max 2 digits

    const tabData = getTabData();

    if (tabData.measures[measureIndex]) {
        tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
    }
    setTabData(tabData);
    renderTab(tabData); // Re-render the tab after the input
    e.target.textContent = value; // Update the displayed text
}

/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 */
function setupToolBar() {
    const addMeasureButton = document.querySelector('.tool-bar button:nth-child(1)');
    const clearTabButton = document.querySelector('.tool-bar button:nth-child(2)');
    const exportTabButton = document.querySelector('.tool-bar button:nth-child(3)');
    const showBPMInputButton = document.querySelector('.tool-bar button:nth-child(4)');
    const playTabButton = document.querySelector('.tool-bar button:nth-child(5)');
    const stopTabButton = document.createElement('button'); // Create the stop button
    stopTabButton.textContent = 'Stop';
    stopTabButton.onclick = stopPlayback;
    stopTabButton.style.display = 'none'; // Initially hidden
    const saveTabButton = document.querySelector('.tool-bar button:nth-child(7)');
    const loadTabButton = document.querySelector('.tool-bar button:nth-child(8)');
    const exportMIDButton = document.querySelector('.tool-bar button:nth-child(9)');

    const toolBar = document.querySelector('.tool-bar');
    toolBar.insertBefore(stopTabButton, playTabButton.nextSibling);

    addMeasureButton.addEventListener('click', () => {
        addMeasure();
        renderTab(getTabData());
    });
    clearTabButton.addEventListener('click', () => {
        clearTab();
        renderTab(getTabData());
    });
    exportTabButton.addEventListener('click', () => {
        exportTab();
    });
    showBPMInputButton.addEventListener('click', () => {
        showBPMInput();
    });
    playTabButton.addEventListener('click', () => {
        playTab(getTabData());
    });
    stopTabButton.addEventListener('click', stopPlayback);
    saveTabButton.addEventListener('click', saveTab);
    loadTabButton.addEventListener('click', loadTab);
    exportMIDButton.addEventListener('click', exportMIDI);
}

/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */
function showNumberCircle(fret) {
    // Remove any existing number circle before showing a new one
    let existingCircle = fret.querySelector('.number-circle');
    const openNumberCircle = document.querySelector('.number-circle');
    if (openNumberCircle) {
        existingCircle = openNumberCircle; // if another number circle is open, target that one for removal
        existingCircle.remove();
    }

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;

    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '1x', '2x'];

    numbers.forEach((num, i) => {
        const angle = (i / numbers.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;

        number.onclick = () => {
            if (num === '1x' || num === '2x') {
                // If 1x or 2x is clicked, show the second number circle
                circle.remove();
                showSecondNumberCircle(fret, num);
            } else {
                // Otherwise, just set the fret text to the chosen number
                fret.textContent = num;
                const measureIndex = parseInt(fret.dataset.measure);
                const stringIndex = parseInt(fret.dataset.string);
                const fretIndex = parseInt(fret.dataset.fret);
                const tabData = getTabData();
                if (tabData.measures[measureIndex]) {
                    tabData.measures[measureIndex].strings[stringIndex][fretIndex] = num;
                    setTabData(tabData);
                }
                circle.remove();
                renderTab(tabData);
            }
        };

        circle.appendChild(number);
    });

    // Append number circle to the body to avoid clipping
    document.body.appendChild(circle);
    // Position the number circle relative to the fret
    const fretRect = fret.getBoundingClientRect();
    circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`; // Adjusted vertical positioning
    circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`; // Adjusted horizontal positioning
}

// Add event listener to document to close number circle when clicking outside
document.addEventListener('click', function(event) {
    const numberCircle = document.querySelector('.number-circle');
    if (numberCircle) {
        let isClickInside = numberCircle.contains(event.target);
        let isClickOnFret = event.target.classList.contains('fret');

        if (!isClickInside && !isClickOnFret) {
            // Add a small delay before removing the number circle, but only if it's NOT the second number circle
            setTimeout(() => {
                if (!event.target.closest('.number-circle')) { // Double check if click is still outside any number-circle after delay
                    numberCircle.remove();
                }
            }, 100); // 100 milliseconds delay
        }
    }
});

/**
 * Displays the second number circle for bends and slides.
 * @param {HTMLElement} fret - The fret element.
 * @param {string} firstDigit - The first digit selected (e.g., "1x" or "2x").
 */
function showSecondNumberCircle(fret, firstDigit) {
    // Remove any existing number circle
    let existingCircle = fret.querySelector('.number-circle');
    if (existingCircle) {
        existingCircle.remove();
    }

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    circle.classList.add('second-number-circle'); // Add the new class here
    const radius = 50;
    const centerX = fret.offsetWidth / 2;
    const centerY = fret.offsetHeight / 2;

    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    numbers.forEach((num, i) => {
        const angle = (i / numbers.length) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const number = document.createElement('div');
        number.className = 'number';
        number.textContent = num;
        number.style.left = `${x}px`;
        number.style.top = `${y}px`;
        number.style.animationDelay = `${i * 0.1}s`;

        number.onclick = () => {
            // Replace 'x' with the chosen number in the first digit
            fret.textContent = firstDigit.replace(/x/, num); // Use regex to replace only the first 'x'
            const measureIndex = parseInt(fret.dataset.measure);
            const stringIndex = parseInt(fret.dataset.string);
            const fretIndex = parseInt(fret.dataset.fret);
            const tabData = getTabData();
            if (tabData.measures[measureIndex]) {
                tabData.measures[measureIndex].strings[stringIndex][fretIndex] = firstDigit.replace(/x/, num);
                setTabData(tabData);
                renderTab(tabData);
            }
            circle.remove(); // Remove the second number circle after number selection
        };

        circle.appendChild(number);
    });

    // Append number circle to the body to avoid clipping, same as first circle
    document.body.appendChild(circle);
    // Position the second number circle relative to the fret
    const fretRect = fret.getBoundingClientRect(); // Comment out original fretRect code
    circle.style.top = `${fretRect.top + window.scrollY - circle.offsetHeight / 2 + fret.offsetHeight / 2}px`; // Adjusted vertical positioning
    circle.style.left = `${fretRect.left + window.scrollX - circle.offsetWidth / 2 + fret.offsetWidth / 2}px`; // Adjusted horizontal positioning
}

export { handleFretInput, showNumberCircle, showSecondNumberCircle, setupToolBar };
