const { processJpeg } = require("./image-processor.js");
module.exports = function videoPlayer (videoPath, duration = 10000) {
    const { spawn } = require("child_process");

    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const asciiChars = " .:-=+*#%@█";

    const ffmpeg = spawn("ffmpeg", [
        "-i", videoPath,
        "-t", duration / 1000,
        "-vf", `scale=${columns}:${rows}`, 
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",              
        "-r", "24", 
        "-"
    ]);

    const frameSize = columns * rows * 3;
    let buffer = Buffer.alloc(0);
    const frameQueue = []; 
    let ffmpegClosed = false;

    ffmpeg.stdout.on("data", (chunk) => {
        buffer = Buffer.concat([buffer, chunk]);
        while (buffer.length >= frameSize) {
           
            const frameData = Buffer.alloc(frameSize);
            buffer.copy(frameData, 0, 0, frameSize);
            frameQueue.push(frameData);
            buffer = buffer.subarray(frameSize);
        }
    });

   
    ffmpeg.stderr.on("data", () => {}); 

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
           
            if (ffmpegClosed && frameQueue.length === 0) {
                clearInterval(intervalId);
                ffmpeg.kill();
                buffer = null;
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
                return;
            }

            if (frameQueue.length === 0) return;

            const frameBuffer = frameQueue.shift(); 
            let frame = "\u001b[H"; 
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    const idx = (y * columns + x) * 3;
                    const r = frameBuffer[idx];
                    const g = frameBuffer[idx + 1];
                    const b = frameBuffer[idx + 2];

                    const brightness = Math.floor(0.2126 * r + 0.7152 * g + 0.0722 * b);
                    const charIdx = Math.floor((brightness / 255) * (asciiChars.length - 1));
                    const char = asciiChars[charIdx];

                    frame += `\u001b[38;2;${r};${g};${b}m${char}`;
                }
                frame += "\n";
            }
            
            process.stdout.write(frame + this.reset);
        }, 41);

        ffmpeg.on("close", () => {
            ffmpegClosed = true;
        });

        ffmpeg.on("error", () => {
            ffmpegClosed = true;
        });
    });
}
