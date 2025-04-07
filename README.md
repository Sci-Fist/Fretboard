# Guitar Tab Editor

## Description

This is a simple web-based guitar tab editor that allows users to create, edit, and play guitar tablature. It provides a visual interface for adding and modifying frets on a six-string guitar tab.  The editor also supports exporting the tab to a text file and exporting to MIDI.

## Features

*   **Tab Creation:** Add measures and frets to create guitar tabs.
*   **Tab Editing:**  Edit fret numbers directly within the tab display.
*   **Number Wheel Input:** Use a number wheel to easily input fret numbers, including "1x" and "2x" for bends and slides.
*   **Play Tab:** Play the tab using a built-in synthesizer (Tone.js).
*   **Export Tab:** Export the tab as a plain text file.
*   **Export MIDI:** Export the tab as a MIDI file.
*   **Save/Load:** Save and load tab data to local storage.

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone [repository URL]
    ```

2.  **Open `index.html` in your web browser.**  No server is required as this is a client-side application.

## Usage

*   **Add Measures:** Click the "Add Measure" button to add a new measure to the tab.
*   **Edit Frets:** Click on a fret to activate it for editing.  Type the fret number (0-9).
*   **Use the Number Wheel:** Click on a fret to open the number wheel. Select a number to input it into the fret.
*   **1x/2x for Bends/Slides:** Click "1x" or "2x" to indicate a bend or slide. A second number wheel will appear to input the value for 'x'.
*   **Play Tab:** Click the "Play Tab" button to play the current tab.
*   **Export Tab:** Click the "Export Tab" button to download the tab as a text file.
*   **Export MIDI:** Click the "Export MIDI" button to download the tab as a MIDI file.
*   **Save Tab:** Click the "Save Tab" button to save the current tab to your browser's local storage.
*   **Load Tab:** Click the "Load Tab" button to load a previously saved tab from local storage.

## Contributing

Contributions are welcome!  If you find a bug or have a feature request, please open an issue on the repository.  Pull requests are also welcome.

## Technologies Used

*   HTML
*   CSS
*   JavaScript
*   Tone.js (for audio synthesis)
