// rendering.js
// Handles the rendering of the tab

import config from './config.js';

const stringLabels = ['E', 'A', 'D', 'G', 'B', 'e']; // String labels

function renderTab(tabData) {
    console.log('renderTab called'); // Log when renderTab is called
    console.log('tabData in renderTab:', tabData); // Log tabData at the start of renderTab
    const tabDisplay = document.getElementById('tab-display');
    tabDisplay.innerHTML = ''; // Clear the tab display

    if (!tabData.measures || tabData.measures.length === 0) {
        console.log('No measures to render.');
        return; // Exit if there are no measures
    }

    tabData.measures.forEach((measure, measureIndex) => {
        console.log('Rendering measure:', measureIndex, measure); // Log each measure being rendered
        const measureDiv = document.createElement('div');
        measureDiv.className = 'measure';

        for (let stringIndex = 0; stringIndex < 6; stringIndex++) {
            // Create a div for each string
            const stringDiv = document.createElement('div');
            stringDiv.className = 'string';

            // Add string label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'string-label';
            labelDiv.textContent = stringLabels[stringIndex];
            stringDiv.appendChild(labelDiv);

            // Add visual string representation (horizontal line)
            const stringLine = document.createElement('div');
            stringLine.className = 'string-line';
            stringDiv.appendChild(stringLine);

            // Create frets for the current string
            for (let fretIndex = 0; fretIndex < 4; fretIndex++) {
                const fretDiv = document.createElement('div');
                fretDiv.className = 'fret';
                fretDiv.contentEditable = true;
                fretDiv.dataset.measure = measureIndex;
                fretDiv.dataset.string = stringIndex;
                fretDiv.dataset.fret = fretIndex;
                fretDiv.textContent = measure.strings[stringIndex][fretIndex] || '';
                //fretDiv.addEventListener('input', handleFretInput); // Moved to ui-elements.js
                //fretDiv.addEventListener('click', (e) => { // Moved to ui-elements.js
                //    showNumberCircle(e.target);
                //});
                stringDiv.appendChild(fretDiv);
            }
            measureDiv.appendChild(stringDiv);
        }
        tabDisplay.appendChild(measureDiv);
    });
}

export { renderTab };
