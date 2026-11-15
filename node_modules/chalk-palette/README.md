# chalk-palette

<p align="left">
  <b>English</b> | <a href="./README.ru.md">Русский</a>
</p>

---

> **chalk-palette** is an ultra-lightweight Node.js library that transforms dull, monochrome terminal text into a vibrant, interactive interface. It supports over 140 colors, gradients, full-fledged visual effects (VFX) like "Matrix" or "Fire," and built-in interactive retro-games.

---

## 🛠️ Installation

Simply install the package via your package manager:

```bash
npm install chalk-palette
```

_Note: Ensure you have [FFmpeg](https://ffmpeg.org) installed in your system PATH. It is strictly required for the real-time audio visualizer, video playback (.videoPlay), and live webcam streaming (.cameraStream) features._

---

## 📖 API Reference

## The library is divided into three key parts: basic formatting methods, advanced terminal animations (VFX), and interactive CLI mini-games.

## ⚙️ Video & Camera Configuration Interfaces

When using advanced media streaming methods, you can pass an optional `options` object to configure resolution and behavior:

### `LogoTextOptions` (Object)

- **`style`** (String, default: `'forge'`): Animation style (`'forge'`, `'pop'`, `'slide'`, or `'hacker'`).
- **`color`** (String): Color name from the palette (e.g., `'Gold'`, `'DeepSkyBlue'`).
- **`speed`** (Number, default: `1`): Speed multiplier for the animation.

### `LogoDrawOptions` (Object)

- **`mode`** (String, default: `'outline'`): Drawing trajectory (`'outline'` traces the outer contour first then fills the inside, `'zigzag'` draws row-by-row snake style, `'spiral'` spirals out from the center, `'scanline'` scans top-to-bottom).
- **`fps`** (Number, default: `30`): Target frame rate.
- **`duration`** (Number, default: `1500`): Total drawing duration in milliseconds.
- **`brushGlow`** (Boolean, default: `true`): Illuminates the tip of the virtual brush while drawing.
- **`padLeft`** (Number, default: `2`): Left margin padding in spaces.

### `LogoOptions` (Object)

- **`duration`** (Number, default: `4000`): Total duration of the 3D animation in milliseconds.
- **`explodeOnStart`** (Boolean, default: `true`): Assembles the logo from scattered 3D particles at the beginning.
- **`explodeOnEnd`** (Boolean, default: `true`): Dissolves the logo into flying particles right before finishing.
- **`force3D`** (Boolean, default: `false`): Bypasses the built-in CPU benchmark check (weak or overloaded CPUs automatically fall back to a lightweight spinner).

### `VideoOptions` (Object)

- **`hyperExpansion`** (Boolean, default: `false`): When `true`, enables ultra-high-resolution rendering using a multi-color Unicode Braille matrix ($2\times4$ sub-pixels per character cell). When `false`, uses the high-quality half-block (`▀`) TrueColor mode ($1\times2$ pixels per cell).

### `CameraOptions` (Object)

- **`mirror`** (Boolean, default: `true`): Vertically mirrors the video feed horizontally for a natural reflection effect.
- **`hyperExpansion`** (Boolean, default: `false`): Enables ultra-high-resolution Braille rendering for the camera stream.

---

## 🎨 Advanced Color Utilities & HEX Support

Now `chalk-palette` includes full support for **HEX colors**, **RGB conversions**, and **TrueColor (24-bit)** terminal output with zero third-party dependencies.

### Features

- **Full HEX support:** Use short formats (`#f00`) or standard formats (`#00F0F0`).
- **Safe parsing:** Automatically handles missing `#` symbols and falls back safely on invalid inputs.
- **Blazing fast:** Powered by low-level bitwise operations.

### Usage Examples

#### 1. Colorize Terminal Text with HEX

```javascript
const clk = require("chalk-palette");

// Print beautiful cyan text
console.log(clk.hex("#00F0F0", "Hello, colorful world!"));

// Supports short HEX codes as well
console.log(clk.hex("#f00", "Red text"));
```

#### 2. Color Conversion Utilities

```javascript
// Convert HEX to RGB Object
const rgbObj = clk.hexToRgbOb("#00F0F0");
// Returns: { red: 0, green: 240, blue: 240 }

// Convert HEX to RGB CSS String
const rgbStr = clk.hexToRgb("#00F0F0");
// Returns: "rgb(0, 240, 240)"

// Convert RGB numbers back to HEX
const hexStr = clk.rgbToHex(0, 240, 240);
// Returns: "#00F0F0"
```

---

### 🎨 1. Basic Styling Methods

#### `chalk.[ColorName](text)` / `chalk.[style].[ColorName](text)`

- **What it does:** Colors text or applies styles to it within a single line.
- **Arguments:** `text` (String) — the text to be colored.
- **Palette:** Over 140 colors available (case-insensitive; e.g., `Red`, `red`, `Tomato`, `tomato`).
- **Example:** `chalk.bold.italic.Tomato("Hello")`

#### `chalk.setCustomColor(r, g, b)`

- **What it does:** Saves a custom color to the library's memory.
- **Arguments:** `r`, `g`, `b` (Numbers) — values ​​from 0 to 255.
- **Returns:** Nothing. The result is output using the next method.
- **Example:**

```javascript
chalk.setCustomColor(255, 128, 0); // Saved orange
console.log(chalk.custom("This text will be orange"));
```

#### `chalk.url(text)` / `chalk.Url(text)`

- **What it does:** Finds links in the text and turns them into clickable terminal hyperlinks. Punctuation marks surrounding the links remain intact.
- **Arguments:** `text` (String) — the string containing text and links.
- **What it returns:** A formatted string (String).

---

### 🎬 2. Animations, UI Elements & Spinners (`chalk.animation.*`)

> 💡 **Important:** Most animations return a `Promise`. Use `await` to ensure effects play sequentially.

#### `.gradient(text, colorFrom, colorTo)`

- **What it does:** Colors the text with a smooth TrueColor gradient. Each character gets its own shade.
- **Arguments:**
  - `text` (String) — the source text.
  - `colorFrom`, `colorTo` (String) — names of the start and end colors from the palette (e.g., `'Red'`, `'Blue'`).
- **What it returns:** A string (String) containing ANSI codes. Does **not** return a Promise; output via `console.log`.

#### `.typewriter(text, speed)`

- **What it does:** Prints text to the screen character by character, simulating manual typing.
- **Arguments:**
  - `text` (String) — the text to output.
  - `speed` (Number) — delay in milliseconds between characters (default: `50`).
- **What it returns:** `Promise<void>`.

#### `.rainbow(text, speed)`

- **What it does:** Starts an infinite loop where the text cycles through all the colors of the rainbow in place.
- **Arguments:**
  - `text` (String) — the text.
  - `speed` (Number) — the color-changing speed in ms (default: `50`).
- **Returns:** An object with a control method: `{ stop: () => void }`.
- **Example:**

```javascript
const fx = chalk.animation.rainbow("Text");
setTimeout(() => fx.stop(), 3000); // Stops the rainbow after 3 seconds
```

#### `.spinner(text, style)`

- **Function:** Creates an animated spinner (loading indicator) at the beginning of the line.
- **Arguments:**
  - `text` (String) — the text next to the spinner.
  - `style` (String) — the animation style (`'dots'`, `'line'`, `'arrows'`).
- **Returns:** A control object: `{ stop: (finalStatus) => void }`. The `.stop()` method stops the animation, removes the spinner, displays a green checkmark, and outputs the final status.

#### `.radarSpinner(text)`

- **Function:** A non-blocking single-line radar spinner. Perfect for tracking heavy file loops or disk scans.
- **Arguments:** `text` (String) — the tracking text description.
- **Returns:** A control object: `{ update: (newText) => void, stop: (finalStatus) => void }`.
- **Example:**

```javascript
const scan = chalk.animation.radarSpinner("Scanning project...");
scan.update("Reading: /src/animation.js");
scan.stop("Done!");
```

#### `.progressBar(totalSteps)`

- **Function:** Renders a progress bar that automatically changes color from red (at the start) to green (at the end).
- **Arguments:** `totalSteps` (Number) — the maximum number of steps (e.g., `100`).
- **Returns:** A control object: `{ update: (currentStep) => void }`. The `.update()` method accepts the current step and redraws the bar.

#### `.passwordMask(question, maskChar)`

- **Function:** Masks user keyboard input with asterisks (or any other character).
- **Arguments:**
  - `question` (String) — the prompt text (e.g., `"Enter password: "`).
  - `maskChar` (String) — the mask character (default: `*`).
- **Returns:** `Promise<string>` — returns the raw string entered by the user.

---

### 🖥️ 3. Full-Screen Visual Effects (VFX) & Telemetry

> ⚠️ **Screen behavior:** All functions below automatically render the animation on an alternate terminal screen. Upon completion, they clear the animation and restore your console to its original state without cluttering the log history.

#### `chalk.logoAnimation(text, options)` _(Also available via `.logoTextAnimation` / `chalk.animation.logoAnimation`)_

- **Action:** Displays a full-screen stylized text logo animation.
- **Arguments:**
  - `text` (String) — the banner text to animate.
  - `options` (LogoTextOptions) — configuration object: `{ style: 'forge' | 'pop' | 'slide' | 'hacker', color, speed }`.
- **Returns:** `Promise<void>`.
- **Example:**

```javascript
await chalk.logoAnimation("CHALK", {
  style: "hacker",
  color: "DeepSkyBlue",
  speed: 1.2,
});
```

#### `chalk.drawLogo(filePath, options)` _(Also available via `chalk.animation.drawLogo`)_

- **Action:** Decodes a local PNG image with **zero dependencies** (no FFmpeg required) and draws it pixel-by-pixel in the terminal using a glowing virtual brush effect. Automatically scales to fit your terminal width and height.
- **Arguments:**
  - `filePath` (String) — path to your `.png` logo file.
  - `options` (LogoDrawOptions) — configuration for trajectory mode (`'outline'`, `'zigzag'`, `'spiral'`, `'scanline'`), duration, and brush glow.
- **Returns:** `Promise<void>`.
- **Example:**

```javascript
// Trace the outer contour of the PNG logo first, then fill the interior
await chalk.drawLogo("./logo.png", {
  mode: "outline",
  duration: 1800,
  brushGlow: true,
});
```

#### `chalk.playLogo(filePath, options)` _(Also available via `.playLogo3D` / `chalk.animation.playLogo`)_

- **Action:** Converts any local PNG image (RGB, RGBA, Grayscale, or Indexed PLTE) into a 3D voxel model with **zero dependencies**, auto-crops black or transparent margins, and renders a full-screen 24-bit TrueColor 3D rotation with particle explosions and built-in CPU performance protection.
- **Arguments:**
  - `filePath` (String) — path to your `.png` logo file.
  - `options` (LogoOptions) — configuration for duration, start/end particle explosions, and CPU fallback.
- **Returns:** `Promise<void>`.
- **Example:**

```javascript
// Full-screen 3D rotating PNG logo with start & end particle explosions
await chalk.playLogo("./logo.png", {
  duration: 4500,
  explodeOnStart: true,
  explodeOnEnd: true,
});
```

#### `.videoPlay(videoPath, duration, options)` _(Also available via root `chalk.videoPlay` / `.playVideo`)_

- **Action:** Decodes any local video file (MP4, MKV, AVI, etc.) on the fly using FFmpeg and streams it directly into the terminal with 24-bit TrueColor.
- **Arguments:**
  - `videoPath` (String) — the absolute or relative path to your video file.
  - `duration` (Number, in ms, default `10000`).
  - `options` (VideoOptions) — rendering engine configuration (e.g., `{ hyperExpansion: true }`).
- **Controls:** Press `q` or `Ctrl+C` while playing to instantly quit and clear the screen.
- **Returns:** `Promise<void>`.
- **Example:**

```javascript
// Play video in ultra-sharp multi-color Braille mode
await chalk.videoPlay("clip.mp4", 15000, { hyperExpansion: true });
```

#### `.cameraStream(duration, options)` _(Also available via root `chalk.cameraStream` / `.streamCamera`)_

- **Action:** Dynamically captures real-time video feeds from your local USB/webcam (cross-platform) using FFmpeg and streams the live feed into the terminal viewport.
- **Arguments:**
  - `duration` (Number, in ms, default `15000`).
  - `options` (CameraOptions) — configuration for mirroring and resolution modes.
- **Controls:** Press `q` or `Ctrl+C` to close the camera stream and return to the normal terminal.
- **Returns:** `Promise<void>`.
- **Example:**

```javascript
// Start a mirrored webcam stream in standard half-block mode
await chalk.cameraStream(20000, { mirror: true, hyperExpansion: false });
```

#### `chalk.logoAnimation(text, options)`

- **Action:** Displays a full-screen text animation (3 types available: "forge", "pop", and "slide")
- **Arguments:**
- `style`: The type of animation (3 types available: "forge", "pop", and "slide")
- `color`: The color of the animated text
- `speed`: The speed of the animation (a higher value results in a faster animation)
- **Returns:** `Promise<void>`

#### `.audioVisualizer(duration)` _(Also available via root `chalk.audioVisualizer`)_

- **Action:** Captures microphone data using FFmpeg and renders a highly responsive 24-bit real-time streaming graphic equalizer.
- **Arguments:** `duration` (Number, in ms, default `10000`).
- **Returns:** `Promise<void>`.

#### `.plasma(duration)`

- **Action:** Generates a dynamic, liquid-like procedural 24-bit plasma color-shift field based on old-school 90s demoscene algorithms.
- **Arguments:** `duration` (Number, in ms, default `5000`).
- **Returns:** `Promise<void>`.

#### `.warpSpeed(duration)`

- **Action:** Simulates hyperspace space-travel. Starfield particles expand into long neon speed streaks flowing from the screen center.
- **Arguments:** `duration` (Number, in ms, default `4000`).
- **Returns:** `Promise<void>`.

#### `.cyberRadar(duration)`

- **Action:** Spawns a full-viewport tactical sonar circular matrix sweep loop that highlights spotted tracking targets.
- **Arguments:** `duration` (Number, in ms, default `6000`).
- **Returns:** `Promise<void>`.

#### `.textDecrypt(finalText, duration)` _(Also available via root `chalk.textDecrypt`)_

- **Action:** Displays a string as a chaotic sequence of glitching cypher-runes, freezing character-by-character until the clean word settles in green.
- **Arguments:** `finalText` (String), `duration` (Number, in ms, default `3000`).
- **Returns:** `Promise<void>`.

#### `.textDissolve(text)`

- **Action:** Causes a line of text to logically fracture into individual sand particles that tumble downward under simulated gravity.
- **Arguments:** `text` (String).
- **Returns:** `Promise<void>`.

#### `.textAssemble(text, duration)`

- **What it does:** Scatters letters across the screen, then smoothly draws them toward the center to assemble the final word.
- **Arguments:** `text` (String), `duration` (Number, in ms; default: `4500`).
- **Returns:** `Promise<void>`.

#### `.textLaser(text, duration)`

- **What it does:** Draws a moving laser beam that leaves behind scorched, colored text characters.
- **Arguments:** `text` (String), `duration` (Number, in ms, default `2500`).
- **Returns:** `Promise<void>`.

#### `.textShimmer(text, duration)`

- **Action:** Displays the text with a bright light wave (glint) sweeping across it from left to right.
- **Arguments:** `text` (String), `duration` (Number, in ms, default `2000`).
- **Returns:** `Promise<void>`.

#### `.textMorph(textFrom, textTo, duration)`

- **Action:** Takes the first word, performs a chaotic dance of its characters, and smoothly transforms it into the second word.
- **Arguments:** `textFrom` (String), `textTo` (String), `duration` (Number, in ms, default `3800`).
- **Returns:** `Promise<void>`.

#### `.matrix(duration, colorName)`

- **Action:** A full-screen "digital rain" effect featuring characters in the style of _The Matrix_ movie.
- **Arguments:**
  - `duration` (Number, in ms, default `5000`).
  - `colorName` (String) — the color of the rain (`'green'`, `'orange'`, `'blue'`, `'yellow'`, `'red'`).
- **Returns:** `Promise<void>`.

#### `.fire(duration)`

- **Action:** A full-screen procedural generator of raging flames based on heat distribution physics.
- **Arguments:** `duration` (Number, in ms, default `5000`).
- **Returns:** `Promise<void>`.

#### `.glitch(text, duration)`

- **What it does:** Centers the text, makes it shake violently horizontally, and replaces some characters with hacker-style glyphs.
- **Arguments:** `text` (String), `duration` (Number, in ms, default `3000`).
- **Returns:** `Promise<void>`.

#### `.pulse(text, duration)`

- **What it does:** Centers the text on the screen and makes it smoothly fade in and out following a sinusoidal pattern.
- **Arguments:** `text` (String), `duration` (Number, in ms, default `4000`).
- **Returns:** `Promise<void>`.

#### `.textExplode(text, config)`

- **What it does:** Types out the text, highlights the central character (the "C4 charge"), pulses, and then explodes the string, creating a circular shockwave and scattering ash.
- **Arguments:**
  - `text` (String) — the text.
  - `config` (Object) — explosion parameters: `{ type: 'c4'|'nuke'|'torpedo', duration: 3000, c4Color: 'red' }`.
- **Returns:** `Promise<void>`.

---

### 🎮 4. Fully-Interactive Retro Games (`chalk.games.*`)

> 🕹️ **Input Handling:** Games capture keyboard arrow triggers seamlessly, adapt fluidly to pane scaling, and restore your terminal input state safely upon termination. They are available via the `.games` space or direct root shortcuts (`chalk.snake()`, `chalk.pong()`).

#### `.snake()`

- **Action:** Starts classic Snake arcade. Control a green serpent using keyboard arrow keys, consume TrueColor red apples `🍎`, grow your structure length, and track score metrics.
- **Returns:** `Promise<void>`.

#### `.pong()`

- **Action:** Launches retro Pong against a tracking predictive AI paddle. Score updates dynamically on a top scoreboard frame.
- **Returns:** `Promise<void>`.

---

## 📄 License

This project is distributed under the **MIT** license. You are free to use it for any personal or commercial purpose.

---

## 👤 Author

- **prm-programmer** — [GitHub](https://github.com/RPM-programmer)
- **Code** — [GitHub](https://github.com/RPM-programmer/chalk-palette) [Npm]()
