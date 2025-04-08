// ui-elements.js
// Function to create a number circle
export function createNumberCircle(ctx, x, y, numbers, onClick) {
    const circleRadius = 20;
    const numberSpacing = 1.2; // Adjust for spacing between numbers
    const angleIncrement = (2 * Math.PI) / numbers.length;
    const centerX = x;
    const centerY = y;

    // Clear any existing number circles
    clearNumberCircles();

    const numberElements = [];

    numbers.forEach((number, index) => {
        const angle = index * angleIncrement;
        const numberX = centerX + Math.cos(angle) * circleRadius * numberSpacing;
        const numberY = centerY + Math.sin(angle) * circleRadius * numberSpacing;

        const numberElement = document.createElement('div');
        numberElement.textContent = number;
        numberElement.style.position = 'absolute';
        numberElement.style.left = `${numberX - 10}px`; // Adjust for text width
        numberElement.style.top = `${numberY - 10}px`; // Adjust for text height
        numberElement.style.width = '20px';
        numberElement.style.height = '20px';
        numberElement.style.borderRadius = '50%';
        numberElement.style.backgroundColor = 'lightgray';
        numberElement.style.textAlign = 'center';
        numberElement.style.lineHeight = '20px';
        numberElement.style.cursor = 'pointer';
        numberElement.style.fontSize = '12px';
        numberElement.classList.add('number-circle'); // Add class for styling

        numberElement.addEventListener('click', () => {
            onClick(number);
            clearNumberCircles(); // Clear the number circles after a click
        });

        document.body.appendChild(numberElement);
        numberElements.push(numberElement);
    });

    // Store the number elements for later clearing
    numberCircleElements = numberElements;
}

// Function to clear number circles
let numberCircleElements = [];
function clearNumberCircles() {
    numberCircleElements.forEach(element => {
        element.remove();
    });
    numberCircleElements = [];
}
