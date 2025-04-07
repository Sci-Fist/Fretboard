// src/ui-elements.js
// Handles UI elements and interactions

/**
 * Sets up the tool bar by attaching event listeners to the tool bar buttons.
 * @param {object} dependencies - Object containing functions from other modules.
 */
function setupToolBar(dependencies) {
    const { addMeasure, clearTab, exportTab, showBPMInput, playTab, stopPlayback, saveTab, loadTab, exportMIDI, renderTab, getTabData, setTabData } = dependencies;

    const addMeasureButton = document.getElementById('addMeasureBtn');
    const clearTabButton = document.getElementById('clearTabBtn');
    const exportTabButton = document.getElementById('exportTabBtn');
    const showBPMInputButton = document.getElementById('setBPMBtn');
    const playTabButton = document.getElementById('playTabBtn');
    const stopTabButton = document.getElementById('stopTabBtn');
    const saveTabButton = document.getElementById('saveTabBtn');
    const loadTabButton = document.getElementById('loadTabBtn');
    const exportMIDButton = document.getElementById('exportMIDIBtn');


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
        playTabButton.style.display = 'none';
        stopTabButton.style.display = 'inline-block';
    });

    stopTabButton.addEventListener('click', () => {
        stopPlayback();
        stopTabButton.style.display = 'none';
        playTabButton.style.display = 'inline-block';
    });

    saveTabButton.addEventListener('click', () => {
        saveTab();
    });

    loadTabButton.addEventListener('click', () => {
        loadTab();
    });

    exportMIDButton.addEventListener('click', () => {
        exportMIDI();
    });
    console.log('ui-elements.js: Toolbar setup complete');
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
    let value = fretElement.textContent.replace(/[^0-9]/g, '').slice(0, 2); // Allow only numbers, max 2 digits

    const tabData = getTabData();
    if (tabData.measures[measureIndex]) {
        tabData.measures[measureIndex].strings[stringIndex][fretIndex] = value;
        setTabData(tabData);
    }
    renderTab(getTabData()); // Re-render the tab after input
    fretElement.textContent = value; // Update displayed text
}


/**
 * Displays the number circle for fret selection.
 * @param {HTMLElement} fret - The fret element.
 */
function showNumberCircle(fret) {
    // Remove any existing number circle
    removeOpenNumberCircle();

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
                circle.remove();
                showSecondNumberCircle(fret, num);
            } else {
                fret.textContent = num;
                const measureIndex = parseInt(fret.dataset.measure);
                const stringIndex = parseInt(fret.dataset.string);
                const fretIndex = parseInt(fret.dataset.fret);
                // No need to update tabData here, it's handled in handleFretInput
                circle.remove();
            }
        };
        circle.appendChild(number);
    });

    document.body.appendChild(circle);
    positionNumberCircle(circle, fret);
}

/**
 * Removes any open number circle from the DOM.
 */
function removeOpenNumberCircle() {
    const openCircle = document.querySelector('.number-circle');
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

    const circle = document.createElement('div');
    circle.className = 'number-circle';
    circle.classList.add('second-number-circle');
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
            fret.textContent = firstDigit.replace(/x/, num);
            circle.remove();
        };
        circle.appendChild(number);
    });

    document.body.appendChild(circle);
    positionNumberCircle(circle, fret);
}


// Close number circle when clicking outside
document.addEventListener('click', function(event) {
    const numberCircle = document.querySelector('.number-circle');
    if (numberCircle) {
        let isClickInside = numberCircle.contains(event.target);
        let isClickOnFret = event.target.classList.contains('fret');

        if (!isClickInside && !isClickOnFret) {
            setTimeout(() => {
                if (!event.target.closest('.number-circle')) {
                    removeOpenNumberCircle(); // Use dedicated function to remove
                }
            }, 100);
        }
    }
});


export { setupToolBar, handleFretInput, showNumberCircle, showSecondNumberCircle };
