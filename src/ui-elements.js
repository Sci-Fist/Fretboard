// ui-elements.js
// Handles UI elements and interactions

// import { setTabData, getTabData } from './tab-data.js';
// import { addMeasure, clearTab } from './tab-data.js'; // Import from tab-data.js
// import { renderTab } from './rendering.js'; // Import from rendering.js
// import { exportMIDI, playTab, stopPlayback } from './audio.js'; // Import from audio.js
// import { showBPMInput, saveTab, loadTab, exportTab } from './app.js'; // Keep these from app.js for now, if they are truly only in app.js

/**
 * Handles input events on fret elements.
 * @param {Event} e - The input event.
 */
function handleFretInput(e) {
    const measureIndex = parseInt(e.target.dataset.measure);
    const stringIndex = parseInt(e.target.dataset.string);
    const fretIndex = parseInt(e.target.dataset.fret);
    let value = e.target.textContent.replace(/[^0-9]/g, '').slice(0, 2); // Allow only numbers, max 2 digits

    // const tabData = getTabData(); // Comment out
    // if (tabData.measures[measureIndex]) { // Comment out
    //     tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value; // Comment out
    // } // Comment out
    // setTabData(tabData); // Comment out
    // renderTab(getTabData()); // Re-render the tab after the input // Comment out
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
        // addMeasure(); // Comment out
        // renderTab(getTabData()); // Comment out
    });
    clearTabButton.addEventListener('click', () => {
        // clearTab(); // Comment out
        // renderTab(getTabData()); // Comment out
    });
    exportTabButton.addEventListener('click', () => {
        // exportTab(); // Comment out
    });
    showBPMInputButton.addEventListener('click', () => {
        // showBPMInput(); // Comment out
    });
    playTabButton.addEventListener('click', () => {
        // playTab(getTabData()); // Comment out
    });
    stopTabButton.addEventListener('click', /*stopPlayback*/ () => {}); // Keep empty function to avoid error, or comment out line
    saveTabButton.addEventListener('click', () => {
        // saveTab(); // Comment out
    });
    loadTabButton.addEventListener('click', () => {
        // loadTab(); // Comment out
    });
    exportMIDButton.addEventListener('click', () => {
        // exportMIDI(); // Comment out
    });
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
                // const tabData = getTabData();
                // if (tabData.measures[measureIndex]) {
                //     tabData.measures[measureIndex].strings[stringIndex][fretIndex] = num;
                //     setTabData(tabData);
                // }
                circle.remove();
                // renderTab(tabData);
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
            // const tabData = getTabData();
            // if (tabData.measures[measureIndex]) {
            //     tabData.measures[measureIndex].strings[stringIndex][fretIndex] = firstDigit.replace(/x/, num);
            //     setTabData(tabData);
            //     // renderTab(tabData);
            // }
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

function exportTab() {
    console.log('exportTab called from ui-elements.js'); // Modified console log to identify source
    // const tabData = getTabData();

    // if (!tabData.measures || tabData.measures.length === 0) {
    //     alert('No tab data to export.');
    //     return;
    // }

    // try {
    //     const tabString = generateTabString(tabData);
    //     // Create a download link
    //     const element = document.createElement('a');
    //     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(tabString));
    //     element.setAttribute('download', 'guitar_tab.txt');
    //     element.style.display = 'none';
    //     document.body.appendChild(element);
    //     element.click();
    //     document.body.removeChild(element);
    // } catch (error) {
    //     console.error('ui-elements.js: Error during tab export:', error); // Modified console log to identify source
    //     alert('Failed to export the tab. Please try again.');
    // }
}

function generateTabString(tabData) {
    const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e'];
    let tabString = '';

    tabData.measures.forEach(measure => {
        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            tabString += stringLabels[stringIndex] + '|';
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                tabString += measure.strings[stringIndex][fretIndex] || '-';
            }
            tabString += '|\n';
        }
        tabString += '\n'; // Add a blank line between measures
    });

    return tabString;
}

function showBPMInput() {
    console.log('showBPMInput called from ui-elements.js'); // Modified console log to identify source
    // const tabData = getTabData();

    // Create the input element
    const input = document.createElement('input');
    input.type = 'number';
    input.id = 'bpmInput';
    // input.value = tabData.bpm; // Set the current BPM as the default value
    input.min = 40; // Set a minimum BPM value
    input.max = 240; // Set a maximum BPM value
    input.style.width = '50px'; // Adjust width as needed
    input.style.marginRight = '10px'; // Add some spacing

    // Create the button to set the BPM
    const setBPMButton = document.createElement('button');
    setBPMButton.textContent = 'Set BPM';
    setBPMButton.onclick = () => {
        const newBPM = parseInt(input.value);
        if (!isNaN(newBPM) && newBPM >= 40 && newBPM <= 240) {
            // tabData.bpm = newBPM;
            // setTabData(tabData);
            // Optionally, provide feedback to the user, e.g., by updating a display element
            console.log('BPM set to:');
            // Remove the input and button after setting the BPM
            bpmInputContainer.remove();
        } else {
            alert('Please enter a valid BPM between 40 and 240.');
        }
    };

    // Create a container for the input and button
    const bpmInputContainer = document.createElement('div');
    bpmInputContainer.id = 'bpmInputContainer';
    bpmInputContainer.style.marginTop = '10px'; // Add some spacing
    bpmInputContainer.appendChild(input);
    bpmInputContainer.appendChild(setBPMButton);

    // Append the container to the tool-bar
    const toolBar = document.querySelector('.tool-bar');
    toolBar.appendChild(bpmInputContainer);
}

function saveTab() {
    console.log('saveTab called from ui-elements.js'); // Modified console log to identify source
    // try {
    //     localStorage.setItem('tabData', JSON.stringify(getTabData()));
    // } catch (error) {
    //     console.error('ui-elements.js: Error saving tab:', error); // Modified console log to identify source
    //     alert('Failed to save the tab. Please check your browser settings.');
    // }
}

function loadTab() {
    console.log('loadTab called from ui-elements.js'); // Modified console log to identify source
    // try {
    //     const savedTabData = localStorage.getItem('tabData');
    //     if (savedTabData) {
    //         setTabData(JSON.parse(savedTabData));
    //         // renderTab(getTabData());
    //     }
    // } catch (error) {
    //     console.error('ui-elements.js: Error loading tab:', error); // Modified console log to identify source
    //     alert('Failed to load the tab. Please check your browser settings.');
    // }
}

export { handleFretInput, showNumberCircle, showSecondNumberCircle, setupToolBar, exportTab, showBPMInput, saveTab, loadTab };
