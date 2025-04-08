// ui-elements.js
import config from '../config.js'; // Import config

// --- Number Circle Functions ---

// Array to store number circle elements for later clearing.
let numberCircleElements = [];

/**
 * Clears all number circle elements from the document.
 */
function clearNumberCircles() {
    numberCircleElements.forEach(element => {
        element.remove();
    });
    numberCircleElements = [];
}

/**
 * Creates and displays a number circle at the specified position.
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} x - The x-coordinate of the center of the circle.
 * @param {number} y - The y-coordinate of the center of the circle.
 * @param {string[]} numbers - An array of numbers (as strings) to display in the circle.
 * @param {function} onClick - A callback function to execute when a number is clicked.
 */
export function createNumberCircle(ctx, x, y, numbers, onClick) {
    const circleRadius = 20;
    const numberSpacing = 1.2; // Adjust for spacing between numbers
    const angleIncrement = (2 * Math.PI) / numbers.length;
    const centerX = x;
    const centerY = y;

    // Clear any existing number circles before creating a new one.
    clearNumberCircles();

    // Create and append number elements to the DOM.
    const numberElements = [];

    numbers.forEach((number, index) => {
        const angle = index * angleIncrement;
        const numberX = centerX + Math.cos(angle) * circleRadius * numberSpacing;
        const numberY = centerY + Math.sin(angle) * circleRadius * numberSpacing;

        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.style.position = 'absolute';
        numberElement.style.left = `${numberX - parseFloat(config.numberCircleSize) / 2}px`; // Adjust for text width
        numberElement.style.top = `${numberY - parseFloat(config.numberCircleSize) / 2}px`; // Adjust for text height
        numberElement.style.width = config.numberCircleSize; // Use config for size
        numberElement.style.height = config.numberCircleSize; // Use config for size
        numberElement.style.borderRadius = '50%';
        numberElement.style.backgroundColor = config.numberCircleBackgroundColor; // Use config for background color
        numberElement.style.color = config.numberCircleTextColor; // Use config for text color
        numberElement.style.textAlign = 'center';
        numberElement.style.lineHeight = config.numberCircleSize; // Use config for line height
        numberElement.style.cursor = 'pointer';
        numberElement.style.fontSize = config.numberCircleFont; // Use config for font size
        numberElement.classList.add('number-circle'); // Add class for styling

        numberElement.addEventListener('click', () => {
            onClick(number);
            clearNumberCircles(); // Clear the number circles after a click
        });

        document.body.appendChild(numberElement);
        numberElements.push(numberElement);
    });

    // Store the number elements for later clearing.
    numberCircleElements = numberElements;
}
