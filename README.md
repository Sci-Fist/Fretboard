# Guitar Tab Editor - RAD!

## Unleash Your Inner Guitar Hero!

Welcome to the Guitar Tab Editor, the totally awesome web application that lets you create, edit, and play your own guitar tablature!  Whether you're a seasoned shredder or just starting to learn, this app provides the tools you need to bring your musical ideas to life. It's designed to be intuitive and fun, so you can focus on making music.

## Key Features - What You Get

*   **Intuitive Tab Creation:** Easily add new measures to your tablature with customizable time signatures, allowing for complex song structures.
*   **Effortless Tab Editing:** Simply click on the frets in the tab display and enter fret numbers directly or using the number wheel.
*   **Number Wheel Input System:**  Clicking on a fret opens a user-friendly number wheel, making fret number selection quick and easy, including options for bends and slides ("1x" and "2x").
*   **Contextual Number Wheel Closure:** The number wheel smartly closes when you click outside of it, keeping your workflow smooth and focused on your tab.
*   **Interactive Playback:** Play back your created tablature directly in the browser using the integrated synthesizer powered by Tone.js, complete with play, pause, and stop controls.
*   **Text-Based Tab Export:** Download your tablature as a plain text file for easy sharing, printing, or further editing in other text editors.
*   **MIDI File Export:** Export your compositions as MIDI files, enabling you to use your tabs in a wide range of music production software and MIDI devices.
*   **Local Save and Load:** Save your tablature creations directly in your browser's local storage, allowing you to easily pick up where you left off and manage your song ideas.

## Getting Started - Let's Rock!

[**Click here to try the live demo!**]([your-deployment-url]) (If you have a live demo URL, replace `[your-deployment-url]` with the actual link!)

**To run the editor locally:**

1.  **Clone the repository:**
    ```bash
    git clone [repository URL]
    ```
    (Replace `[repository URL]` with the actual URL of your repository)

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm start
    ```
    This command uses Parcel to bundle and serve the application.

4.  **Open in your browser:**
    The application should automatically open in your default web browser, usually at `http://localhost:1234`. If not, navigate to this address manually. Parcel might also use a different port if 1234 is already in use, so check the console output after running `npm start`.

## Usage - Start Jamming

*   **Adding Measures:** Click the "Add Measure" button to insert a new measure into your tab. You can customize the time signature and name of each measure.
*   **Editing Frets:** To edit a fret, first click on the fret in the tablature display to activate it. Then, you can either:
    *   Type the fret number (0-9) directly using your keyboard.
    *   Click on the fret again to open the Number Wheel and select the desired fret number, including "1x" or "2x" for bends and slides.
*   **Using the Number Wheel:** When the Number Wheel is open, click on a number to input it into the selected fret. To close the wheel without selecting a number, simply click anywhere outside the wheel.
*   **Indicating Bends and Slides (1x/2x):**  Use the "1x" and "2x" options in the Number Wheel to indicate bends or slides. Selecting "1x" or "2x" will typically prompt for a second digit to complete the fret mark.
*   **Playing Your Tab:**  Use the playback controls in the top toolbar:
    *   "Play" to start playback from the beginning or resume from pause.
    *   "Pause" to temporarily halt playback.
    *   "Stop" to completely stop playback and reset to the beginning.
*   **Exporting Tablature:**
    *   Click "Export Tab" to download your tab as a plain text file (`.txt`).
    *   Click "Export MIDI" to download your tab as a MIDI file (`.midi`).
*   **Saving and Loading:**
    *   "Save Tab" will store your current tab in your browser's local storage.
    *   "Load Tab" will load a previously saved tab from local storage.

## Contributing - Become a Rockstar Contributor!

We welcome contributions to make this Guitar Tab Editor even better! If you find any bugs, have feature suggestions, or want to contribute code, please:

*   **Open an issue:** For bug reports or feature requests, please open a new issue on the project's issue tracker to discuss the problem or suggestion.
*   **Submit a pull request:** If you've implemented a fix or a new feature, submit a pull request with your changes. We'll review it and merge it if it fits within the project's goals.

Let's collaborate and make this the ultimate online Guitar Tab Editor!

## Technologies Used - The Awesome Gear Behind the App

*   HTML
*   CSS
*   JavaScript (ES6+)
*   Tone.js (for audio synthesis and playback)
*   Parcel (for bundling and development server)

## Keep Creating and Rock On!

We hope you enjoy using the Guitar Tab Editor.  Start creating your tabs, share your music, and let us know what you think!
