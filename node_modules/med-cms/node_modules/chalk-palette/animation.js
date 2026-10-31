const path = require("path");
const codes = require(path.join(__dirname, "rgb-codes.js"));
const RGB_COLORS = codes.rgb;
const execSync = require("child_process").execSync;
if (process.platform === "win32") {
    try {
        execSync("chcp 65001", { stdio: "ignore" });
    } catch (e) {}
}
class animation {
constructor() {
        this.reset = codes.ansi ? codes.ansi.reset : "\u001b[0m";
        this.cleanLine = "\u001b[G\u001b[K"; 
        this.hideCursor = "\u001b[?25l";
        this.showCursor = "\u001b[?25h";
        this.supportsTrueColor = 
            process.env.COLORTERM === "truecolor" || 
            process.env.COLORTERM === "24bit" ||
            (process.platform === "win32" && process.env.WT_SESSION) || 
            process.platform === "darwin";
        this.lowerCaseColors = {};
        for (const key in RGB_COLORS) {
            this.lowerCaseColors[key.toLowerCase()] = RGB_COLORS[key];
        }

}
rgbToAnsi256(r, g, b) {
        if (r === g && g === b) {
            if (r < 8) return 16;
            if (r > 248) return 231;
            return Math.round(((r - 8) / 247) * 24) + 232;
        }
        return 16 + 36 * Math.floor(r / 255 * 5) + 6 * Math.floor(g / 255 * 5) + Math.floor(b / 255 * 5);
}
rainbow(text, speed = 50) {
        if (!text || typeof text !== "string") return { stop: () => {} };
        let phase = 0;
        const chars = Array.from(text);
        const textLength = chars.length > 0 ? chars.length : 1;
        process.stdout.write(this.hideCursor);
        const intervalId = setInterval(() => {
            let result = "";
            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                if (char === " ") { result += " "; continue; }
                const frequency = (i / textLength) * 2 * Math.PI + phase;
                const r = Math.floor(Math.sin(frequency) * 127 + 128);
                const g = Math.floor(Math.sin(frequency + 2.09439) * 127 + 128);
                const b = Math.floor(Math.sin(frequency + 4.18879) * 127 + 128);
                let colorCode = this.supportsTrueColor 
                    ? "\u001b[38;2;" + r + ";" + g + ";" + b + "m"
                    : "\u001b[38;5;" + this.rgbToAnsi256(r, g, b) + "m";
                result += colorCode + char;
            }
            process.stdout.write(this.cleanLine + result + this.reset);
            phase -= 0.12; 
        }, speed);
        return {
            stop: () => {
                clearInterval(intervalId);
                process.stdout.write(this.showCursor + "\n");
            }
        };
}
typewriter(text, speed = 50) {
        if (!text || typeof text !== "string") return Promise.resolve();
        const chars = Array.from(text);
        let i = 0;
        return new Promise((resolve) => {
            process.stdout.write(this.hideCursor);
            const intervalId = setInterval(() => {
                if (i < chars.length) {
                    process.stdout.write(chars[i]);
                    i++;
                } else {
                    clearInterval(intervalId);
                    process.stdout.write(this.showCursor + "\n");
                    resolve();
                }
            }, speed);
        });
}
glitch(text, duration = 3000) {
        if (!text || typeof text !== "string") return Promise.resolve();
        const chars = Array.from(text);
        const glitchSymbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?X█▓▒░";
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        const rows = process.stdout.rows || 24;
        const columns = process.stdout.columns || 80;
        const centerY = Math.floor(rows / 2);
        const centerX = Math.max(1, Math.floor((columns - chars.length) / 2));
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                let currentLine = "";
                for (let i = 0; i < chars.length; i++) {
                    let char = chars[i];
                    let color = "\u001b[37m";
                    if (Math.random() < 0.15 && char !== " ") {
                        char = glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
                        const r = Math.random() > 0.5 ? 255 : 0;
                        const g = Math.random() > 0.5 ? 255 : 0;
                        const b = Math.random() > 0.5 ? 255 : 0;
                        color = "\u001b[38;2;" + r + ";" + g + ";" + b + "m";
                    }
                    currentLine += color + char;
                }
                const shakeX = centerX + (Math.random() < 0.2 ? Math.floor(Math.random() * 3) - 1 : 0);
                const pos = "\u001b[" + centerY + ";" + shakeX + "H";
                process.stdout.write("\u001b[2J" + pos + currentLine + this.reset);
            }, 60);
            setTimeout(() => {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }, duration);
        });
}
pulse(text, duration = 4000) {
        if (!text || typeof text !== "string") return Promise.resolve();
        
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        
        const rows = process.stdout.rows || 24;
        const columns = process.stdout.columns || 80;
        const centerY = Math.floor(rows / 2);
        const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
        const pos = "\u001b[" + centerY + ";" + centerX + "H";

        let alpha = 0;

        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
               
                const brightness = Math.floor((Math.sin(alpha) + 1) * 127.5);
                
               
                const colorCode = "\u001b[38;2;" + brightness + ";" + brightness + ";" + brightness + "m";
                
                process.stdout.write("\u001b[2J" + pos + colorCode + text + this.reset);
                alpha += 0.08;
            }, 30);

            setTimeout(() => {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }, duration);
        });
}
passwordMask(question = "Password: ", maskChar = "*") {
        return new Promise((resolve, reject) => {
            process.stdout.write(question + this.showCursor);
            const stdin = process.stdin;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding("utf8");
            let password = "";
            const cleanup = () => {
                try {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener("data", handleKey);
                    process.removeListener("uncaughtException", handleCrash);
                } catch (e) {}
            };
            const handleCrash = (err) => {
                cleanup();
                process.stdout.write("\n");
                console.error(err);
                process.exit(1);
            };
            process.once("uncaughtException", handleCrash);
            function handleKey(key) {
                const buffer = Buffer.from(key);
                if (buffer.length === 1 && buffer[0] === 3) {
                    cleanup();
                    process.stdout.write("\n");
                    process.exit(0); 
                }
                if (buffer.length === 1 && (buffer[0] === 13 || buffer[0] === 10)) {
                    cleanup();
                    process.stdout.write("\n");
                    resolve(password);
                    return;
                }
                if (buffer.length === 1 && (buffer[0] === 127 || buffer[0] === 8)) {
                    if (password.length > 0) {
                        password = password.slice(0, -1);
                        process.stdout.write("\b\x1b[K");
                    }
                    return;
                }
                if (buffer[0] === 27) return;
                password += key;
                process.stdout.write(maskChar);
            }
            stdin.on("data", handleKey);
        });
}
progressBar(totalSteps = 100) {
        const reset = this.reset;
        process.stdout.write(this.hideCursor);
        return {
            update: (currentStep) => {
                if (currentStep > totalSteps) currentStep = totalSteps;
                if (currentStep < 0) currentStep = 0;
                const percentage = Math.floor((currentStep / totalSteps) * 100);
                const terminalWidth = process.stdout.columns || 80;
                const barWidth = Math.max(15, Math.floor(terminalWidth * 0.35)); 
                const filledWidth = Math.round((currentStep / totalSteps) * barWidth);
                const emptyWidth = barWidth - filledWidth;
                const filledBar = "█".repeat(filledWidth);
                const emptyBar = "░".repeat(emptyWidth);
                const factor = currentStep / totalSteps;
                const r = Math.floor((1 - factor) * 200 + 55);
                const g = Math.floor(factor * 200 + 55);
                const colorCode = "\u001b[38;2;" + r + ";" + g + ";55m";
                const output = "\r\u001b[KProgress: [" + colorCode + filledBar + reset + emptyBar + "] " + 
                               percentage + "% (" + currentStep + "/" + totalSteps + ")";
                process.stdout.write(output);
                if (currentStep === totalSteps) {
                    process.stdout.write("\n\u001b[?25h");
                }
            }
        };
}
gradient(text, colorFrom, colorTo) {
        if (!text || typeof text !== "string") return "";
        const startColor = this.lowerCaseColors[colorFrom.toLowerCase()];
        const endColor = this.lowerCaseColors[colorTo.toLowerCase()];

        const chars = Array.from(text);
        const len = chars.length > 1 ? chars.length - 1 : 1;
        let result = "";
        for (let i = 0; i < chars.length; i++) {
            const factor = i / len;
            const r = Math.floor(startColor[0] + (endColor[0] - startColor[0]) * factor);
            const g = Math.floor(startColor[1] + (endColor[1] - startColor[1]) * factor);
            const b = Math.floor(startColor[2] + (endColor[2] - startColor[2]) * factor);
            const colorCode = "\u001b[38;2;" + r + ";" + g + ";" + b + "m";
            result += colorCode + chars[i];
        }
        return result + this.reset;
}
spinner(text = "Loading...", style = "dots") {
        process.stdout.write(this.hideCursor);
        const themes = {
            dots: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
            line: ["-", "\\", "|", "/"],
            arrows: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"]
        };
        const frames = themes[style] || themes.dots;
        let currentFrame = 0;
        const intervalId = setInterval(() => {
            const frame = frames[currentFrame];
            const coloredFrame = "\u001b[36m" + frame + this.reset;
            process.stdout.write("\r\u001b[K" + coloredFrame + " " + text);
            currentFrame = (currentFrame + 1) % frames.length;
        }, 80);
        return {
            stop: (finalStatus = "Success!") => {
                clearInterval(intervalId);
                process.stdout.write("\r\u001b[K\u001b[32m✓\u001b[0m " + text + " — " + finalStatus + "\n");
                process.stdout.write(this.showCursor);
            }
        };
}
textAssemble(text, duration = 4500) {
    if (!text || typeof text !== 'string') return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const targetChars = Array.from(text);
    const glitchSymbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*@#&%+=-░▒▓█";
    const particles = targetChars.map((char, index) => {
        const sX = Math.floor(Math.random() * (columns - 4)) + 2;
        const sY = Math.floor(Math.random() * (rows - 4)) + 2;
        
        return {
            char: char,
            targetX: centerX + index,
            targetY: centerY,
            x: sX,
            y: sY,
            lastX: sX,
            lastY: sY,
            displayChar: char === " " ? " " : glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)]
        };
    });
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let progress = timePassed / duration;
            if (progress > 1) progress = 1;
            let frame = "";
            particles.forEach(p => {
                p.x += (p.targetX - p.x) * 0.05;
                p.y += (p.targetY - p.y) * 0.05;
                const currentXRound = Math.round(p.x);
                const currentYRound = Math.round(p.y);
                if (currentXRound !== p.lastX || currentYRound !== p.lastY) {
                    frame += `\u001b[${p.lastY};${p.lastX}H `;
                }
                p.lastX = currentXRound;
                p.lastY = currentYRound;
                const distance = Math.hypot(p.targetX - p.x, p.targetY - p.y);
                const showFinal = distance < 1.5 || Math.random() < (progress * 1.2);
                const charToRender = showFinal ? p.char : p.displayChar;
                const r = Math.floor(progress * 40);
                const g = Math.floor(40 + progress * 215); 
                const b = Math.floor(120 - progress * 40);
                const color = `\u001b[38;2;${r};${g};${b}m`;

                frame += `\u001b[${currentYRound};${currentXRound}H${color}${charToRender}`;
            });
            process.stdout.write(frame + this.reset);
            const allArrived = particles.every(p => Math.abs(p.x - p.targetX) < 0.05 && Math.abs(p.y - p.targetY) < 0.05);

            if (progress >= 1 || allArrived) {
                clearInterval(intervalId);
                process.stdout.write(`\u001b[${centerY};${centerX}H\u001b[1;37m${text}${this.reset}`);

                setTimeout(() => {
                    process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                    resolve();
                }, 2000);
            }
        }, 16);
    });
}
textExplode(text, config = {}) {
    if (!text || typeof text !== 'string') return Promise.resolve();
    const type = config.type || 'nuke'; 
    const duration = type === 'c4' ? 750 : (config.duration || 3000); 
    const torpedoSide = config.side || 'left'; 
    const c4Index = config.c4Index !== undefined ? config.c4Index : Math.floor(text.length / 2);
    const c4ColorName = config.c4Color || 'red'; 
    const colorPalette = {
        red: '\u001b[31;1m', green: '\u001b[32;1m', yellow: '\u001b[33;1m',
        blue: '\u001b[34;1m', magenta: '\u001b[35;1m', cyan: '\u001b[36;1m',
        gray: '\u001b[38;5;244m', white: '\u001b[37;1m'
    };
    const finalC4Color = colorPalette[c4ColorName.toLowerCase()] || colorPalette.red;
    process.stdout.write("\u001b[?1049h" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const dustStages = ["█", "▓", "▒", "░", "°", "·", " "];
    const flashSymbols = ["*", "☼", "♦", "░", "█"]; 
    process.stdout.write("\u001b[2J" + `\u001b[${centerY};${centerX}H\u001b[1;37m${text}${this.reset}`);
    let epicX = centerX + c4Index;
    let epicY = centerY;
    const particles = Array.from(text).map((char, index) => {
        const curX = centerX + index;
        const curY = centerY;
        let dx = curX - epicX;
        let dist = Math.abs(dx) || 0.1;
        const direction = dx >= 0 ? 1 : -1;
        const angle = Math.atan2(Math.random() * 0.8 - 0.4, direction);
        const force = type === 'c4' ? (12 / (dist * 0.5)) + Math.random() * 3 : 5;
        return {
            char: char, x: curX, y: curY, lastX: curX, lastY: curY,
            vx: Math.cos(angle) * force * 1.3,
            vy: Math.sin(angle) * force,
            distanceToC4: dist,
            dustLevel: 0
        };
    });
    let flashes = [];
    if (type === 'c4') {
        const flashCount = 60;
        for (let i = 0; i < flashCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const force = 3 + Math.random() * 11; 
            flashes.push({
                x: epicX, y: epicY, lastX: epicX, lastY: epicY,
                vx: Math.cos(angle) * force * 1.6,
                vy: Math.sin(angle) * force,
                char: flashSymbols[Math.floor(Math.random() * flashSymbols.length)]
            });
        }
    }
    return new Promise((resolve) => {
        let startTime = Date.now();
        let c4PulsePhase = 0;
        let isExploded = false; 
        let activeFlashCells = new Set();
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            if (type === 'c4' && !isExploded) {
                c4PulsePhase += 0.5; 
                const isBright = Math.sin(c4PulsePhase) > 0;
                const pC4 = particles[c4Index];
                if (pC4) {
                    process.stdout.write(`\u001b[${centerY};${pC4.lastX}H${isBright ? finalC4Color : '\u001b[30m'}${pC4.char}${this.reset}`);
                }
                if (timePassed > 1000) {
                    isExploded = true;
                    startTime = Date.now(); 
                }
                return;
            }
            if ((type === 'nuke' || type === 'torpedo') && !isExploded) { isExploded = true; startTime = Date.now(); return; }
            let progress = (Date.now() - startTime) / duration;
            if (progress > 1) progress = 1;
            let frame = "";
            if (type === 'c4' && progress < 0.08) { 
                activeFlashCells.forEach(cell => {
                    const [cx, cy] = cell.split(',').map(Number);
                    frame += `\u001b[${cy};${cx}H `;
                });
                activeFlashCells.clear();
                const shockwaveRadius = Math.floor(progress * 220); 
                for (let dy = -5; dy <= 5; dy++) {
                    for (let dx = -16; dx <= 16; dx++) {
                        if ((dx * dx) + (dy * dy * 6) <= shockwaveRadius * shockwaveRadius) {
                            const fx = epicX + dx;
                            const fy = epicY + dy;
                            if (fy >= 1 && fy <= rows && fx >= 1 && fx <= columns) {
                                frame += `\u001b[${fy};${fx}H\u001b[1;37m█`;
                                activeFlashCells.add(`${fx},${fy}`);
                            }
                        }
                    }
                }
            } else if (activeFlashCells.size > 0) {
                activeFlashCells.forEach(cell => {
                    const [cx, cy] = cell.split(',').map(Number);
                    frame += `\u001b[${cy};${cx}H `;
                });
                activeFlashCells.clear();
            }
            flashes.forEach((f) => {
                f.vx *= 0.82;
                f.vy *= 0.82;
                f.x += f.vx;
                f.y += f.vy;
                const cxR = Math.round(f.x);
                const cyR = Math.round(f.y);
                if (cxR !== f.lastX || cyR !== f.lastY) {
                    if (f.lastY >= 1 && f.lastY <= rows && f.lastX >= 1 && f.lastX <= columns) {
                        if (!activeFlashCells.has(`${f.lastX},${f.lastY}`)) {
                            frame += `\u001b[${f.lastY};${f.lastX}H `;
                        }
                    }
                }
                f.lastX = cxR; f.lastY = cyR;
                if (cyR < 1 || cyR > rows || cxR < 1 || cxR > columns) return;
                if (activeFlashCells.has(`${cxR},${cyR}`)) return; 
                let color = "";
                if (progress < 0.25) {
                    color = Math.random() > 0.4 ? "\u001b[1;37m" : "\u001b[38;2;255;230;0m";
                } else if (progress < 0.6) {
                    color = "\u001b[38;2;255;110;0m"; 
                } else {
                    return;
                }
                frame += `\u001b[${cyR};${cxR}H${color}${f.char}`;
            });
            particles.forEach((p) => {
                const waveFront = progress * (text.length * 3.0);
                if (waveFront < p.distanceToC4) return; 
                p.vx *= 0.84;
                p.vy *= 0.84;
                p.x += p.vx;
                p.y += p.vy;
                const currentXRound = Math.round(p.x);
                const currentYRound = Math.round(p.y);
                if (currentXRound !== p.lastX || currentYRound !== p.lastY) {
                    if (p.lastY >= 1 && p.lastY <= rows && p.lastX >= 1 && p.lastX <= columns) {
                        if (!activeFlashCells.has(`${p.lastX},${p.lastY}`)) {
                            frame += `\u001b[${p.lastY};${p.lastX}H `;
                        }
                    }
                }
                p.lastX = currentXRound; p.lastY = currentYRound;
                if (currentYRound < 1 || currentYRound > rows || currentXRound < 1 || currentXRound > columns) return;
                if (activeFlashCells.has(`${currentXRound},${currentYRound}`)) return; 
                p.dustLevel = Math.floor(progress * dustStages.length);
                if (p.dustLevel >= dustStages.length) p.dustLevel = dustStages.length - 1;
                let charToRender = dustStages[p.dustLevel];
                let color = "";
                if (progress < 0.2) {
                    color = "\u001b[1;37m";
                    charToRender = "█";
                } else if (progress < 0.45) {
                    color = "\u001b[38;2;255;150;10m";
                } else if (progress < 0.75) {
                    color = "\u001b[38;2;180;40;5m";
                } else {
                    color = "\u001b[38;2;90;90;90m";
                }
                const finalChar = progress > 0.92 ? " " : charToRender;
                frame += `\u001b[${currentYRound};${currentXRound}H${color}${finalChar}`;
            });
            process.stdout.write(frame + this.reset);
                        if (progress >= 1) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }

        }, 16); 
    });
}
textMorph(textFrom, textTo, duration = 3800) {
    if (typeof textFrom !== "string" || typeof textTo !== "string") return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerXFrom = Math.max(1, Math.floor((columns - textFrom.length) / 2));
    const centerXTo = Math.max(1, Math.floor((columns - textTo.length) / 2));
    const charsFrom = Array.from(textFrom);
    const charsTo = Array.from(textTo);
    const glitchSymbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ*@#&%+=-░▒▓█";
    const maxLen = Math.max(charsFrom.length, charsTo.length);
    const particles = [];
    for (let i = 0; i < maxLen; i++) {
        let sX, sY, tX, tY;
        let charFrom = charsFrom[i];
        let charTo = charsTo[i];
        if (i < charsTo.length) {
            tX = centerXTo + i;
            tY = centerY;
        } else {
            tX = centerXFrom + i + (i % 2 === 0 ? 6 : -6);
            tY = centerY;
        }
        if (i < charsFrom.length) {
            sX = centerXFrom + i;
            sY = centerY;
        } else {
            sX = i % 2 === 0 ? centerXFrom - 4 : centerXFrom + charsFrom.length + 4;
            sY = centerY;
        }
        const midAngle = Math.random() * Math.PI * 2;
        const midRadius = 3 + Math.random() * 5; 
        const orbitX = sX + Math.cos(midAngle) * midRadius * 1.6;
        const orbitY = sY + Math.sin(midAngle) * midRadius;
        particles.push({
            charFrom: charFrom || " ", 
            charTo: charTo || " ",     
            x: sX, y: sY,
            startX: sX, startY: sY,
            orbitX: orbitX, orbitY: orbitY, 
            targetX: tX, targetY: tY,
            lastX: Math.round(sX), lastY: Math.round(sY),
            displayChar: charFrom || glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)],
            isNew: i >= charsFrom.length,
            isDying: i >= charsTo.length
        });
    }
    process.stdout.write(`\u001b[${centerY};${centerXFrom}H\u001b[38;2;100;255;100m${textFrom}${this.reset}`);
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let progress = timePassed / duration;
            if (progress > 1) progress = 1;
            const springEase = Math.sin(progress * Math.PI); 
            const currentSpring = 0.01 + springEase * 0.055; 
            let frame = "";
            particles.forEach((p) => {
                if (p.isNew && progress < 0.1) return;
                let currentTargetX = p.targetX;
                let currentTargetY = p.targetY;
                if (progress < 0.45) {
                    const influence = progress / 0.45; 
                    currentTargetX = p.startX + (p.orbitX - p.startX) * influence;
                    currentTargetY = p.startY + (p.orbitY - p.startY) * influence;
                }
                p.x += (currentTargetX - p.x) * currentSpring;
                p.y += (currentTargetY - p.y) * currentSpring;
                const cxR = Math.round(p.x);
                const cyR = Math.round(p.y);
                if (cxR !== p.lastX || cyR !== p.lastY) {
                    if (p.lastY >= 1 && p.lastY <= rows && p.lastX >= 1 && p.lastX <= columns) {
                        frame += `\u001b[${p.lastY};${p.lastX}H `;
                    }
                }
                p.lastX = cxR; p.lastY = cyR;
                if (cyR < 1 || cyR > rows || cxR < 1 || cxR > columns) return;
                let charToRender = p.displayChar;
                const distanceToTarget = Math.hypot(p.targetX - p.x, p.targetY - p.y);
                const distanceFromStart = Math.hypot(p.x - p.startX, p.y - p.startY);

                if (progress < 0.25) {
                    charToRender = p.charFrom;
                } else if (progress >= 0.25 && progress <= 0.65) {
                    charToRender = (p.charFrom === " " && p.charTo === " ") ? " " : glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
                } else {
                    const showFinal = distanceToTarget < 1.2 || Math.random() < ((progress - 0.65) * 2.85);
                    charToRender = showFinal ? p.charTo : glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
                }
                let color = "";
                if (progress < 0.25) {
                    const b = Math.floor(progress * 4 * 180);
                    color = `\u001b[38;2;100;255;${b}m`;
                } else if (progress < 0.72) {
                    const r = Math.floor(100 + ((progress - 0.25) * 2 * 120));
                    color = `\u001b[38;2;${r};50;255m`;
                } else {
                    const factor = (progress - 0.72) * 3.57;
                    const r = Math.floor(220 + factor * 35);
                    const g = Math.floor(50 + factor * 205);
                    const b = 255;
                    color = `\u001b[38;2;${r};${g};${b}m`;
                }
                frame += `\u001b[${cyR};${cxR}H${color}${charToRender}`;
            });
            process.stdout.write(frame + this.reset);
            const allArrived = particles.every(p => Math.abs(p.x - p.targetX) < 0.05 && Math.abs(p.y - p.targetY) < 0.05);
            if (progress >= 1 || allArrived) {
                clearInterval(intervalId);
                process.stdout.write(`\u001b[${centerY};${centerXTo}H\u001b[1;37m${textTo}${this.reset}`);
                setTimeout(() => {
                    process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                    resolve();
                }, 2000);
            }
        }, 16);
    });
}
retroLines(config = {}) {
    const duration = config.duration || 10000;      
    const linesCount = config.linesCount || 3;       
    const offsetDistance = config.offset !== undefined ? config.offset : 3; 
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    let rows = process.stdout.rows || 24;
    let columns = process.stdout.columns || 80;
    let p1 = { x: Math.floor(columns / 3), y: Math.floor(rows / 3) };
    let p2 = { x: Math.floor(columns * 0.7), y: Math.floor(rows * 0.7) };
    let target1 = { x: Math.floor(Math.random() * (columns - 10)) + 5, y: Math.floor(Math.random() * (rows - 6)) + 3 };
    let target2 = { x: Math.floor(Math.random() * (columns - 10)) + 5, y: Math.floor(Math.random() * (rows - 6)) + 3 };
    let p1History = [];
    let p2History = [];
    let frameHistory = [];
    const maxHistory = 8; 
    const getLinePoints = (x0, y0, x1, y1) => {
        let points = [];
        let dx = Math.abs(x1 - x0); let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1; let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;
        while (true) {
            points.push({ x: x0, y: y0 });
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
        return points;
    };
    let baseHue = 0;
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            p1.x += (target1.x - p1.x) * 0.05; p1.y += (target1.y - p1.y) * 0.05;
            p2.x += (target2.x - p2.x) * 0.05; p2.y += (target2.y - p2.y) * 0.05;
            if (Math.hypot(target1.x - p1.x, target1.y - p1.y) < 2.0) {
                target1 = { x: Math.floor(Math.random() * (columns - 10)) + 5, y: Math.floor(Math.random() * (rows - 6)) + 3 };
            }
            if (Math.hypot(target2.x - p2.x, target2.y - p2.y) < 2.0) {
                target2 = { x: Math.floor(Math.random() * (columns - 10)) + 5, y: Math.floor(Math.random() * (rows - 6)) + 3 };
            }
            p1History.unshift({ x: Math.round(p1.x), y: Math.round(p1.y) });
            p2History.unshift({ x: Math.round(p2.x), y: Math.round(p2.y) });
            const maxPointsHistory = linesCount * offsetDistance + 2;
            if (p1History.length > maxPointsHistory) p1History.pop();
            if (p2History.length > maxPointsHistory) p2History.pop();
            let frame = ""
            if (frameHistory.length >= maxHistory) {
                const oldestFrame = frameHistory.pop();
                oldestFrame.forEach(p => {
                    if (p.y >= 1 && p.y <= rows && p.x >= 1 && p.x <= columns) {
                        frame += `\u001b[${p.y};${p.x}H `;
                    }
                });
            }
            let currentFramePoints = [];
            for (let l = 0; l < linesCount; l++) {
                const historyIndex = l * offsetDistance;
                const pt1 = p1History[Math.min(historyIndex, p1History.length - 1)];
                const pt2 = p2History[Math.min(historyIndex, p2History.length - 1)];
                if (pt1 && pt2) {
                    const points = getLinePoints(pt1.x, pt1.y, pt2.x, pt2.y);
                    points.forEach(p => {
                        currentFramePoints.push({ x: p.x, y: p.y, lineIndex: l });
                    });
                }
            }
            baseHue += 0.04;
            frameHistory.unshift(currentFramePoints);
            for (let i = frameHistory.length - 1; i >= 0; i--) {
                const currentHistoryFrame = frameHistory[i];
                const fadeFactor = 1 - (i / maxHistory); 
                currentHistoryFrame.forEach(p => {
                    if (p.y >= 1 && p.y <= rows && p.x >= 1 && p.x <= columns) {
                        const r = Math.floor((Math.sin(baseHue + i * 0.2 + p.lineIndex * 0.4) * 127 + 128) * fadeFactor);
                        const g = Math.floor((Math.sin(baseHue + i * 0.2 + p.lineIndex * 0.4 + 2) * 127 + 128) * fadeFactor);
                        const b = Math.floor((Math.sin(baseHue + i * 0.2 + p.lineIndex * 0.4 + 4) * 127 + 128) * fadeFactor);
                        const color = `\u001b[38;2;${r};${g};${b}m`;
                        let char = "█";
                        if (i === 1 || i === 2) char = "▓";
                        if (i === 3 || i === 4) char = "▒";
                        if (i >= 5) char = "░";
                        frame += `\u001b[${p.y};${p.x}H${color}${char}`;
                    }
                });
            }
            process.stdout.write(frame + this.reset);
            if (timePassed >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 25); 
    });
}
textLaser(text, duration = 2500) {
    if (!text || typeof text !== 'string') return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const chars = Array.from(text);
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let progress = timePassed / duration;
            if (progress > 1) progress = 1;
            const laserX = centerX + Math.floor(progress * text.length);
            let frame = "";
            chars.forEach((char, index) => {
                const charX = centerX + index;
                if (charX > laserX) {
                    frame += `\u001b[${centerY};${charX}H `;
                    return;
                }
                const distanceToLaser = laserX - charX;
                let color = "";
                let charToRender = char;
                if (charX === laserX) {
                    color = "\u001b[1;37m";
                    charToRender = "█";
                } else if (distanceToLaser === 1) {
                    color = "\u001b[38;2;0;255;255;1m";
                } else if (distanceToLaser < 5) {
                    const factor = (5 - distanceToLaser) / 5;
                    const g = Math.floor(factor * 150);
                    color = `\u001b[38;2;0;${g};255m`;
                } else {
                    color = "\u001b[38;2;140;50;255m";
                }
                frame += `\u001b[${centerY};${charX}H${color}${charToRender}`;
            });
            process.stdout.write(frame + this.reset);
            if (progress >= 1) {
                clearInterval(intervalId);
                process.stdout.write(`\u001b[${centerY};${centerX}H\u001b[38;2;140;50;255m${text}${this.reset}`);
                setTimeout(() => {
                    process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                    resolve();
                }, 2000);
            }
        }, 16);
    });
}
textShimmer(text, duration = 2000) {
    if (!text || typeof text !== 'string') return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const chars = Array.from(text);
    const startTime = Date.now();
    const baseColor = { r: 0, g: 102, b: 204 };
    const peakColor = { r: 255, g: 255, b: 255 };
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let progress = timePassed / duration;
            if (progress > 1) progress = 1;
            const shimmerX = (centerX - 5) + Math.floor(progress * (text.length + 10));
            let frame = "";
            chars.forEach((char, index) => {
                const charX = centerX + index;
                const distance = Math.abs(charX - shimmerX);
                let color = "";
                if (distance <= 4) {
                    const factor = 1 - (distance / 4); 
                    const r = Math.floor(baseColor.r + (peakColor.r - baseColor.r) * factor);
                    const g = Math.floor(baseColor.g + (peakColor.g - baseColor.g) * factor);
                    const b = Math.floor(baseColor.b + (peakColor.b - baseColor.b) * factor);
                    color = `\u001b[38;2;${r};${g};${b};1m`;
                } else {
                    color = `\u001b[38;2;${baseColor.r};${baseColor.g};${baseColor.b}m`;
                }
                frame += `\u001b[${centerY};${charX}H${color}${char}`;
            });
            process.stdout.write(frame + this.reset);
            if (progress >= 1) {
                clearInterval(intervalId);
                process.stdout.write(`\u001b[${centerY};${centerX}H\u001b[38;2;${baseColor.r};${baseColor.g};${baseColor.b}m${text}${this.reset}`);
                setTimeout(() => {
                    process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                    resolve();
                }, 1500);
            }
        }, 16);
    });
}
bouncingBall(text = "Loading...", duration = 6000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    let ballX = Math.floor(columns / 2);
    let ballY = Math.floor(rows / 2);
    let vx = (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.4);
    let vy = (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.3);
    const hitColors = [,
        [255, 99, 71]
    ];
    let currentColor = hitColors[0];
    let lastX = Math.round(ballX);
    let lastY = Math.round(ballY);
    const textX = Math.max(1, Math.floor((columns - text.length) / 2));
    const textY = Math.floor(rows / 2) + 2; 
    process.stdout.write(`\u001b[${textY};${textX}H\u001b[1;37m${text}${this.reset}`);
    const intervalId = setInterval(() => {
        ballX += vx;
        ballY += vy;
        let cX = Math.round(ballX);
        let cY = Math.round(ballY);
        if (cX < 1) cX = 1;
        if (cX > columns) cX = columns;
        if (cY < 1) cY = 1;
        if (cY > rows) cY = rows;
        let hit = false;
        let ballChar = "●";
        if (ballX <= 1 || ballX >= columns) {
            vx = -vx + (Math.random() * 0.1 - 0.05);
            vy += (Math.random() * 0.1 - 0.05);
            hit = true;
            ballChar = vx > 0 ? "❱" : "❰"; 
        }
        if (ballY <= 1 || ballY >= rows) {
            vy = -vy + (Math.random() * 0.1 - 0.05);
            vx += (Math.random() * 0.1 - 0.05);
            hit = true;
            ballChar = vy > 0 ? "⬊" : "⬉"; 
        }
        const minSpeed = 0.3;
        if (Math.abs(vx) < minSpeed) vx = (vx < 0 ? -minSpeed : minSpeed);
        if (Math.abs(vy) < minSpeed) vy = (vy < 0 ? -minSpeed : minSpeed);
        if (hit) {
            const nextIndex = Math.floor(Math.random() * hitColors.length);
            currentColor = hitColors[nextIndex] || hitColors[0];
        }
        let frame = "";
        if (cX !== lastX || cY !== lastY) {
            if (lastY === textY && lastX >= textX && lastX < textX + text.length) {
                const charToRestore = text[lastX - textX];
                frame += `\u001b[${lastY};${lastX}H\u001b[1;37m${charToRestore}`;
            } else {
                frame += `\u001b[${lastY};${lastX}H `;
            }
        }
        const [r, g, b] = Array.isArray(currentColor) ? currentColor : [255, 255, 255];
        const colorCode = `\u001b[38;2;${r};${g};${b}m`;
        frame += `\u001b[${cY};${cX}H${colorCode}${ballChar}${this.reset}`;
        process.stdout.write(frame);
        lastX = cX;
        lastY = cY;
    }, 30); 
    return new Promise((resolve) => {
        setTimeout(() => {
            clearInterval(intervalId);
            process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
            process.stdout.write(`\r\u001b[K\u001b[32m✓\u001b[0m ${text}\n`);
            resolve();
        }, duration);
    });
}
fireworks(duration = 5000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const gravity = 0.18;
    const resistance = 0.92;
    const sparkStages = ["█", "▓", "▒", "░", "*", "·", " "];
    const palettes = [
        [[255, 50, 50], [255, 150, 50], [255, 200, 100]], 
        [[50, 255, 50], [150, 255, 100], [200, 255, 200]],
        [[50, 150, 255], [100, 200, 255], [200, 230, 255]], 
        [[255, 50, 255], [255, 150, 255], [255, 220, 255]], 
        [[255, 255, 50], [255, 200, 50], [255, 255, 180]] 
    ];
    let state = "launch";
    let rocketX = Math.floor(Math.random() * (columns - 20)) + 10;
    let rocketY = rows - 1;
    let rocketVy = -(1.2 + Math.random() * 0.4);
    let rocketVx = Math.random() * 0.4 - 0.2; 
    let targetY = Math.floor(rows * 0.2) + Math.floor(Math.random() * (rows * 0.25));
    let lastRocketX = Math.round(rocketX);
    let lastRocketY = Math.round(rocketY);
    let particles = [];
    const intervalId = setInterval(() => {
        let frame = "";
        if (state === "launch") {
            rocketX += rocketVx;
            rocketY += rocketVy;
            let cX = Math.round(rocketX);
            let cY = Math.round(rocketY);
            if (cX < 1) cX = 1; if (cX > columns) cX = columns;
            if (cY < 1) cY = 1; if (cY > rows) cY = rows;
            if (cX !== lastRocketX || cY !== lastRocketY) {
                if (lastRocketY >= 1 && lastRocketY <= rows && lastRocketX >= 1 && lastRocketX <= columns) {
                    frame += `\u001b[${lastRocketY};${lastRocketX}H `;
                }
            }
            if (cY >= 1 && cY <= rows && cX >= 1 && cX <= columns) {
                frame += `\u001b[${cY};${cX}H\u001b[1;37m↑${this.reset}`;
            }
            lastRocketX = cX;
            lastRocketY = cY;
            if (cY <= targetY || rocketVy >= -0.1) {
                state = "explode";
                frame += `\u001b[${cY};${cX}H `;
                const selectedPalette = palettes[Math.floor(Math.random() * palettes.length)];
                const particleCount = 45 + Math.floor(Math.random() * 20);
                for (let i = 0; i < particleCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const force = 1 + Math.random() * 4.5;
                    particles.push({
                        x: rocketX,
                        y: rocketY,
                        vx: Math.cos(angle) * force * 1.8,
                        vy: Math.sin(angle) * force * 0.9,
                        lastX: Math.round(rocketX),
                        lastY: Math.round(rocketY),
                        age: 0,
                        maxAge: 25 + Math.floor(Math.random() * 15),
                        palette: selectedPalette
                    });
                }
            }
        } 
        else if (state === "explode") {
            let allDead = true;
            particles.forEach((p) => {
                if (p.age >= p.maxAge) return;
                allDead = false;
                if (p.lastY >= 1 && p.lastY <= rows && p.lastX >= 1 && p.lastX <= columns) {
                    frame += `\u001b[${p.lastY};${p.lastX}H `;
                }
                p.vx *= resistance;
                p.vy *= resistance;
                p.vy += gravity;
                p.x += p.vx;
                p.y += p.vy;
                let cX = Math.round(p.x);
                let cY = Math.round(p.y);
                p.lastX = cX;
                p.lastY = cY;
                p.age++;
                if (cX < 1 || cX > columns || cY < 1 || cY > rows) {
                    p.age = p.maxAge;
                    return;
                }
                const lifeProgress = p.age / p.maxAge;
                let stageIndex = Math.floor(lifeProgress * sparkStages.length);
                if (stageIndex >= sparkStages.length) stageIndex = sparkStages.length - 1;
                if (lifeProgress > 0.6 && Math.random() < 0.25) return;
                let charToRender = sparkStages[stageIndex];
                let colorRGB = p.palette[0];
                if (lifeProgress > 0.35 && lifeProgress <= 0.7) colorRGB = p.palette[1];
                if (lifeProgress > 0.7) colorRGB = p.palette[2];
                const [r, g, b] = colorRGB;
                const colorCode = `\u001b[38;2;${r};${g};${b}m`;
                frame += `\u001b[${cY};${cX}H${colorCode}${charToRender}${this.reset}`;
            });
            if (allDead) {
                state = "launch";
                rocketX = Math.floor(Math.random() * (columns - 20)) + 10;
                rocketY = rows - 1;
                rocketVy = -(1.2 + Math.random() * 0.4);
                rocketVx = Math.random() * 0.4 - 0.2;
                targetY = Math.floor(rows * 0.15) + Math.floor(Math.random() * (rows * 0.25));
                lastRocketX = Math.round(rocketX);
                lastRocketY = Math.round(rocketY);
                particles = [];
            }
        }
        if (frame.length > 0) {
            process.stdout.write(frame);
        }
    }, 33);
    return new Promise((resolve) => {
        setTimeout(() => {
            clearInterval(intervalId);
            process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
            process.stdout.write(`\r\u001b[K\u001b[32m\u001b[0m`);
            resolve();
        }, duration);
    });
}
fire(duration = 5000) {
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        const w = process.stdout.columns || 80;
        const h = process.stdout.rows || 24;
        let fireBuffer = Array(w * h).fill(0);
        const fireChars = " .:-=+*#%@";
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                for (let x = 0; x < w; x++) {
                    fireBuffer[(h - 1) * w + x] = Math.random() > 0.4 ? 9 : 0;
                }
                let frame = "\u001b[H";
                for (let y = 0; y < h - 1; y++) {
                    for (let x = 0; x < w; x++) {
                        const srcIndex = (y + 1) * w + ((x + Math.floor(Math.random() * 3) - 1 + w) % w);
                        const currentVal = fireBuffer[srcIndex];
                        const newVal = currentVal > 0 ? currentVal - (Math.random() > 0.6 ? 1 : 0) : 0;
                        fireBuffer[y * w + x] = newVal;
                        const char = fireChars[newVal];
                        let color = "\u001b[30m";
                        if (newVal > 7) color = "\u001b[1;37m";
                        else if (newVal > 5) color = "\u001b[33m";
                        else if (newVal > 2) color = "\u001b[31m";
                        else if (newVal > 0) color = "\u001b[2;31m";
                        frame += color + char;
                    }
                }
                process.stdout.write(frame);
            }, 50);
            setTimeout(() => {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }, duration);
        });
}
matrix(duration = 5000, colorName = "green") {
        const columns = process.stdout.columns || 80;
        const rows = process.stdout.rows || 24;
        const drops = Array(columns).fill(0).map(() => Math.floor(Math.random() * -rows));
        const matrixChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
        const fireChars = " .:-=+*#%@"; 
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        return new Promise((resolve) => {
            const intervalId = setInterval(() => {
                let frame = "";
                for (let x = 0; x < columns; x++) {
                    const y = drops[x];
                    if (y >= 0 && y < rows) {
                        const charList = (colorName.toLowerCase() === "orange") ? fireChars : matrixChars;
                        const char = charList[Math.floor(Math.random() * charList.length)];
                        const pos = "\u001b[" + (y + 1) + ";" + (x + 1) + "H";
                        let color = "";
                        const isHead = Math.random() > 0.92;
                        if (isHead) {
                            color = "\u001b[1;37m";
                        } else {
                            switch (colorName.toLowerCase()) {
                                case "orange":
                                    color = (Math.random() > 0.5) ? "\u001b[33m" : "\u001b[31m"; 
                                    break;
                                case "blue":
                                    color = "\u001b[34m";
                                    break;
                                case "yellow":
                                    color = "\u001b[33m";
                                    break;
                                case "red":
                                    color = "\u001b[31m";
                                    break;
                                case "green":
                                default:
                                    color = "\u001b[32m";
                                    break;
                            }
                        }
                        frame += pos + color + char;
                    }
                    drops[x]++;
                    if (drops[x] >= rows) {
                        drops[x] = Math.random() > 0.95 ? 0 : Math.floor(Math.random() * -5);
                    }
                }
                process.stdout.write(frame);
            }, 40);
            setTimeout(() => {
                clearInterval(intervalId);
               
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }, duration);
        });
}
menu(options = [], title = "Выберите опцию:") {
    if (!options.length) return Promise.resolve(null);
    process.stdout.write(this.hideCursor);
    let selectedIndex = 0;
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const render = () => {
        let output = this.cleanLine + `\u001b[1m${title}\u001b[0m\n`;
        options.forEach((opt, idx) => {
            if (idx === selectedIndex) {
                output += `\x1b[2K \u001b[32m➔ ${opt}\u001b[0m\n`;
            } else {
                output += `\x1b[2K   ${opt}\n`;
            }
        });
        output += `\u001b[${options.length + 1}A`;
        process.stdout.write(output);
    };
    render();
    return new Promise((resolve) => {
        const handleKey = (key) => {
            const buffer = Buffer.from(key);
            if (buffer.length === 1 && buffer[0] === 3) {
                cleanup();
                process.exit(0);
            }
            if (buffer.length === 1 && (buffer[0] === 13 || buffer[0] === 10)) {
                cleanup();
                process.stdout.write(`\u001b[${options.length + 1}B\n`); 
                resolve({ index: selectedIndex, value: options[selectedIndex] });
                return;
            }
            if (key === "\u001b[A") { 
                selectedIndex = (selectedIndex - 1 + options.length) % options.length;
                render();
            } else if (key === "\u001b[B") {
                selectedIndex = (selectedIndex + 1) % options.length;
                render();
            }
        };
        const cleanup = () => {
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener("data", handleKey);
            process.stdout.write(this.showCursor);
        };
        stdin.on("data", handleKey);
    });
}
typingGame(text) {
    if (!text || typeof text !== "string") return Promise.resolve();
    process.stdout.write(this.cleanLine + "Наберите текст ниже:\n" + text + "\n\n" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    process.stdout.write(`\u001b[2A\r`);
    let typed = "";
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    return new Promise((resolve) => {
        const handleKey = (key) => {
            const buffer = Buffer.from(key);
            if (buffer.length === 1 && buffer[0] === 3) {
                cleanup();
                process.exit(0);
            }
            if (buffer[0] === 27) return; 
            if (buffer.length === 1 && (buffer[0] === 127 || buffer[0] === 8)) {
                if (typed.length > 0) {
                    typed = typed.slice(0, -1);
                }
            } else {
                if (typed.length < text.length) {
                    typed += key;
                }
            }
            let output = "\(\r\)\u001b[K";
            for (let i = 0; i < text.length; i++) {
                if (i < typed.length) {
                    if (typed[i] === text[i]) {
                        output += `\u001b[32m${text[i]}\u001b[0m`;
                    } else {
                        output += `\u001b[41;37m${text[i]}\u001b[0m`;
                    }
                } else {
                    output += text[i]; 
                }
            }
            process.stdout.write(output);
            if (typed === text) {
                cleanup();
                process.stdout.write("\n\n\u001b[32m\u001b[0m\n");
                resolve();
            }
        };
        const cleanup = () => {
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener("data", handleKey);
            process.stdout.write(this.showCursor);
        };
        stdin.on("data", handleKey);
    });
}
starfield(duration = 5000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = rows / 2;
    const centerX = columns / 2;
    const stars = Array(60).fill(0).map(() => ({
        x: (Math.random() - 0.5) * columns * 2,
        y: (Math.random() - 0.5) * rows * 2,
        z: Math.random() * 100 
    }));

    const startTime = Date.now();

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let frame = "\u001b[H\u001b[2J"; 

            stars.forEach(s => {
                s.z -= 1.8;
                if (s.z <= 0) {
                    s.x = (Math.random() - 0.5) * columns * 2;
                    s.y = (Math.random() - 0.5) * rows * 2;
                    s.z = 100;
                }
                const k = 40 / s.z;
                const px = Math.round(centerX + s.x * k);
                const py = Math.round(centerY + s.y * k);

                if (px >= 1 && px <= columns && py >= 1 && py <= rows) {
                    let color = "\u001b[38;5;236m";
                    if (s.z < 30) color = "\u001b[1;37m"; 
                    else if (s.z < 60) color = "\u001b[38;5;248m";
                    else if (s.z < 80) color = "\u001b[38;5;241m";
                    const char = s.z < 25 ? "*" : "·";
                    frame += `\u001b[${py};${px}H${color}${char}`;
                }
            });
            process.stdout.write(frame + this.reset);
            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 33);
    });
}
wave(text, duration = 4000) {
    if (!text || typeof text !== "string") return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const chars = Array.from(text);
    let phase = 0;
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let frame = "\u001b[H\u001b[2J";
            chars.forEach((char, index) => {
                const charX = centerX + index;
                const offset = Math.sin(phase + (index * 0.4)) * 3;
                const charY = Math.round(centerY + offset);
                if (charY >= 1 && charY <= rows && charX >= 1 && charX <= columns) {
                    const brightness = Math.floor(150 + Math.sin(phase + index * 0.4) * 105);
                    const color = `\u001b[38;2;0;${brightness};255m`;
                    frame += `\u001b[${charY};${charX}H${color}${char}`;
                }
            });

            process.stdout.write(frame + this.reset);
            phase += 0.15;
            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 40);
    });
}
scanline(text, duration = 4000) {
    if (!text || typeof text !== "string") return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));
    const chars = Array.from(text);
    let scanY = 1;
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let frame = `\u001b[${centerY};${centerX}H`;
            chars.forEach((char, index) => {
                const charX = centerX + index;
                const distance = Math.abs(centerY - Math.floor(scanY));
                let color = "\u001b[38;2;40;160;40m";
                if (distance < 3) {
                    if (distance === 0) color = "\u001b[1;37m";
                    else if (distance === 1) color = "\u001b[38;2;140;255;140m";
                    else color = "\u001b[38;2;80;200;80m";
                }

                frame += color + char;
            });
            const currentLineY = Math.floor(scanY);
            if (currentLineY >= 1 && currentLineY <= rows && currentLineY !== centerY) {
                frame += `\u001b[${currentLineY};1H\u001b[38;2;0;40;0m` + "—".repeat(columns);
            }
            process.stdout.write("\u001b[2J" + frame + this.reset);
            scanY += 0.4;
            if (scanY > rows) scanY = 1;
            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 25);
    });
}
mandelbrot(duration = 7000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const maxIt = 30;
    let zoom = 1.0;
    const startTime = Date.now();
    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let frame = "\u001b[H";
            zoom += 0.07;
            const moveX = -0.743643887037158704752191506114774;
            const moveY = 0.131825904205311970493132056385139;
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    const cr = (x - columns / 2) / (columns * 0.5 * zoom) + moveX;
                    const ci = (y - rows / 2) / (rows * 1.0 * zoom) + moveY;
                    let zr = 0.0, zi = 0.0;
                    let i = 0;
                    while (zr * zr + zi * zi < 4.0 && i < maxIt) {
                        const temp = zr * zr - zi * zi + cr;
                        zi = 2.0 * zr * zi + ci;
                        zr = temp;
                        i++;
                    }

                    if (i === maxIt) {
                        frame += " ";
                    } else {
                        const factor = i / maxIt;
                        const r = Math.floor(Math.sin(factor * 3 + zoom) * 127 + 128);
                        const g = Math.floor(Math.sin(factor * 5 + zoom * 0.5) * 127 + 128);
                        const b = Math.floor(Math.cos(factor * 2 + zoom) * 127 + 128);
                        
                        const chars = ".:-=+*#%@█";
                        const char = chars[i % chars.length];
                        
                        frame += `\u001b[38;2;${r};${g};${b}m${char}`;
                    }
                }
                frame += "\n";
            }
            process.stdout.write(frame + this.reset);
            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 50);
    });
}
audioVisualizer(duration = 10000) {
   
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);

    let audioDevice = "";
    let inputFormat = "";

    if (process.platform === "win32") {
        inputFormat = "dshow";
        audioDevice = "audio=default"; 
    } else if (process.platform === "darwin") {
        inputFormat = "avfoundation";
        audioDevice = ":default"; 
    } else {
        inputFormat = "alsa";
        audioDevice = "default";
    }

    const { spawn } = require("child_process");
    
   
    const ffmpeg = spawn("ffmpeg", [
        "-f", inputFormat,
        "-i", audioDevice,
        "-ac", "1",          
        "-ar", "11025",      
        "-f", "s16le",       
        "-"
    ]);

    ffmpeg.stderr.on("data", () => {});

    const stdin = process.stdin;
    let oldRawMode = false;
    try {
        oldRawMode = stdin.isRawMode;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding("utf8");
    } catch (e) {}

   
   
    let audioSamples = Array(columns).fill(0);
    let sampleIdx = 0;

    ffmpeg.stdout.on("data", (chunk) => {
       
        for (let i = 0; i < chunk.length; i += 2) {
            if (i + 1 < chunk.length) {
                const sample = chunk.readInt16LE(i);
                
               
                const maxGraphHeight = Math.floor(rows / 2) - 1;
                const volume = (Math.abs(sample) / 32768) * maxGraphHeight;

               
                audioSamples[sampleIdx] = volume;
                sampleIdx = (sampleIdx + 1) % columns;
            }
        }
    });

    return new Promise((resolve) => {
        let timerId;

       
        const intervalId = setInterval(() => {
            let out = "\u001b[H";

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                   
                    const actualIdx = (sampleIdx + x) % columns;
                    const volume = audioSamples[actualIdx] || 0;

                   
                    const isInsideWave = y >= (centerY - Math.floor(volume)) && y <= (centerY + Math.floor(volume));

                   
                    if (isInsideWave && volume > 0.6) {
                       
                        let r = 0, g = 255, b = 0;
                        
                        const distanceFromCenter = Math.abs(y - centerY);
                        const maxH = Math.floor(rows / 2);
                        
                        if (distanceFromCenter > maxH * 0.6) {
                            r = 255; g = 50; 
                        } else if (distanceFromCenter > maxH * 0.25) {
                            r = 255; g = 215;
                        }

                       
                        out += `\u001b[38;2;${r};${g};${b}m█`;
                    } else if (y === centerY) {
                        out += "\u001b[38;5;242m-";
                    } else {
                        out += " ";
                    }
                }
                out += "\n";
            }

            process.stdout.write(out + this.reset);
        }, 33);

        const cleanUp = () => {
            clearInterval(intervalId);
            clearTimeout(timerId);
            try {
                stdin.setRawMode(oldRawMode);
                stdin.pause();
                stdin.removeListener("data", handleKeyPress);
            } catch (e) {}
            
            ffmpeg.kill("SIGKILL");
            process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
            resolve();
        };

        const handleKeyPress = (key) => {
            const bufferKey = Buffer.from(key);
            if ((bufferKey.length === 1 && bufferKey[0] === 3) || key === "q" || key === "й" || key === "\u001b") {
                cleanUp();
            }
        };

        stdin.on("data", handleKeyPress);
        timerId = setTimeout(cleanUp, duration);

        ffmpeg.on("error", (err) => {
            cleanUp();
            console.error("\n[Chalk Palette Error]: Не удалось запустить аудио-захват.");
        });
    });
}
plasma(duration = 5000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const startTime = Date.now();
    let time = 0;

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let out = "\u001b[H";
            time += 0.04;

            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                   
                    const v1 = Math.sin(x * 0.1 + time);
                    const v2 = Math.sin(0.1 * (x * Math.sin(time / 2) + y * Math.cos(time / 3)) + time);
                    const cx = x - columns / 2;
                    const cy = y - rows / 2;
                    const v3 = Math.sin(Math.sqrt(100 * (cx * cx + cy * cy) + 1) * 0.1 - time);
                    const total = (v1 + v2 + v3) / 3;

                   
                    const r = Math.floor(Math.sin(total * Math.PI) * 127 + 128);
                    const g = Math.floor(Math.cos(total * Math.PI) * 127 + 128);
                    const b = Math.floor(Math.sin(total * Math.PI + time) * 127 + 128);

                    const chars = " .:-=+*#%@█";
                    const charIdx = Math.floor(((total + 1) / 2) * (chars.length - 1));
                    const char = chars[Math.max(0, Math.min(charIdx, chars.length - 1))];

                    out += `\u001b[38;2;${r};${g};${b}m${char}`;
                }
                out += "\n";
            }
            process.stdout.write(out + this.reset);

            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 33);
    });
}
warpSpeed(duration = 4000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = rows / 2;
    const centerX = columns / 2;

    const stars = Array(40).fill(0).map(() => ({
        x: (Math.random() - 0.5) * columns,
        y: (Math.random() - 0.5) * rows,
        z: Math.random() * 100
    }));

    const startTime = Date.now();

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let out = "\u001b[H\u001b[2J"; 
            const progress = (Date.now() - startTime) / duration;
            const speed = 2.0 + progress * 8.0;

            stars.forEach(s => {
                s.z -= speed;
                if (s.z <= 0) {
                    s.x = (Math.random() - 0.5) * columns;
                    s.y = (Math.random() - 0.5) * rows;
                    s.z = 100;
                }

                const k = 30 / s.z;
                const px = Math.round(centerX + s.x * k);
                const py = Math.round(centerY + s.y * k);

               
                const oldK = 30 / (s.z + speed * 1.5);
                const oldPx = Math.round(centerX + s.x * oldK);
                const oldPy = Math.round(centerY + s.y * oldK);

                if (px >= 1 && px <= columns && py >= 1 && py <= rows) {
                    const r = Math.floor(progress * 155) + 100;
                    const g = Math.floor((1 - progress) * 100) + 155;
                    const b = 255;
                    
                   
                    if (oldPx !== px || oldPy !== py) {
                        if (oldPy >= 1 && oldPy <= rows && oldPx >= 1 && oldPx <= columns) {
                            out += `\u001b[${oldPy};${oldPx}H\u001b[38;2;0;50;150m·`;
                        }
                    }
                    out += `\u001b[${py};${px}H\u001b[38;2;${r};${g};${b}m█`;
                }
            });

            process.stdout.write(out + this.reset);

            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 33);
    });
}
cyberRadar(duration = 6000) {
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const cX = Math.floor(columns / 2);
    const cY = Math.floor(rows / 2);
    
    let angle = 0;
    const targets = Array(4).fill(0).map(() => ({
        x: cX + (Math.random() - 0.5) * (columns * 0.6),
        y: cY + (Math.random() - 0.5) * (rows * 0.6),
        life: 0
    }));

    const startTime = Date.now();

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            let out = "\u001b[H\u001b[2J";
            angle += 0.07;

           
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < columns; x++) {
                    const dx = (x - cX) / 2;
                    const dy = y - cY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                   
                    if (Math.abs(dist - 5) < 0.4 || Math.abs(dist - 10) < 0.4) {
                        out += "\u001b[38;5;236m.";
                        continue;
                    }

                   
                    const targetAngle = Math.atan2(dy, dx) + Math.PI;
                    const diff = (angle - targetAngle) % (Math.PI * 2);
                    
                    if (diff > 0 && diff < 0.5 && dist < 12) {
                        const greenFade = Math.floor((1 - diff / 0.5) * 200) + 55;
                        out += `\u001b[38;2;0;${greenFade};0m█`;
                    } else {
                       
                        let targetRendered = false;
                        targets.forEach(t => {
                            const tDx = Math.abs(x - t.x);
                            const tDy = Math.abs(y - t.y);
                            if (tDx < 1 && tDy < 1 && t.life > 0) {
                                out += `\u001b[38;2;255;0;0;1m▲`;
                                targetRendered = true;
                            }
                        });
                        if (!targetRendered) out += " ";
                    }
                }
                out += "\n";
            }

           
            targets.forEach(t => {
                const tDx = (t.x - cX) / 2;
                const tDy = t.y - cY;
                const tAngle = Math.atan2(tDy, tDx) + Math.PI;
                if (Math.abs((angle % (Math.PI * 2)) - tAngle) < 0.1) {
                    t.life = 1.0;
                }
                t.life -= 0.02;
            });

            process.stdout.write(out + this.reset);

            if (Date.now() - startTime >= duration) {
                clearInterval(intervalId);
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            }
        }, 40);
    });
}
textDissolve(text) {
    if (!text || typeof text !== "string") return Promise.resolve();
    process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
    const rows = process.stdout.rows || 24;
    const columns = process.stdout.columns || 80;
    const centerY = Math.floor(rows / 2);
    const centerX = Math.max(1, Math.floor((columns - text.length) / 2));

    const particles = Array.from(text).map((char, index) => ({
        char: char,
        x: centerX + index,
        y: centerY,
        lastX: centerX + index,
        lastY: centerY,
        vx: (Math.random() - 0.5) * 0.4,
        vy: 0.1 + Math.random() * 0.3,
        isFalling: false,
        delay: index * 30
    }));

    const startTime = Date.now();

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let frame = "";
            let allFallen = true;

            particles.forEach(p => {
                if (timePassed > p.delay) p.isFalling = true;

                if (p.isFalling && p.y < rows - 1) {
                    allFallen = false;
                    p.vy += 0.03;
                    p.x += p.vx;
                    p.y += p.vy;
                } else if (p.y >= rows - 1) {
                    p.y = rows - 1;
                } else {
                    allFallen = false;
                }

                const cx = Math.round(p.x);
                const cy = Math.round(p.y);

                if (cx !== p.lastX || cy !== p.lastY) {
                    if (p.lastY >= 1 && p.lastY <= rows && p.lastX >= 1 && p.lastX <= columns) {
                        frame += `\u001b[${p.lastY};${p.lastX}H `;
                    }
                }

                p.lastX = cx; p.lastY = cy;

                if (cy >= 1 && cy <= rows && cx >= 1 && cx <= columns) {
                    let renderChar = p.char;
                    let color = "\u001b[1;37m";
                    
                    if (p.isFalling && p.y < rows - 1) {
                        renderChar = Math.random() > 0.5 ? "·" : ":";
                        color = "\u001b[38;5;244m";
                    } else if (p.y === rows - 1) {
                        renderChar = "░";
                        color = "\u001b[38;2;210;180;140m";
                    }
                    frame += `\u001b[${cy};${cx}H${color}${renderChar}`;
                }
            });

            process.stdout.write(frame + this.reset);

            if (allFallen || timePassed > 7000) {
                clearInterval(intervalId);
                setTimeout(() => {
                    process.stdout.write("\u001b[2J\u001b[?1049l" + this.showCursor + this.reset);
                    resolve();
                }, 1500);
            }
        }, 20);
    });
}
textDecrypt(finalText, duration = 3000) {
    if (!finalText || typeof finalText !== "string") return Promise.resolve();
    process.stdout.write(this.hideCursor);

    const chars = Array.from(finalText);
    const glitchSymbols = "!@#$%^&*()_+-=[]{}|;':\",./<>?X█▓▒░";
    const startTime = Date.now();

    return new Promise((resolve) => {
        const intervalId = setInterval(() => {
            const timePassed = Date.now() - startTime;
            let progress = timePassed / duration;
            if (progress > 1) progress = 1;

           
            const decryptedCount = Math.floor(progress * chars.length);
            let currentLine = "";

            for (let i = 0; i < chars.length; i++) {
                if (i < decryptedCount) {
                   
                    currentLine += `\u001b[38;2;50;255;50m${chars[i]}`;
                } else if (chars[i] === " ") {
                    currentLine += " ";
                } else {
                   
                    const randomChar = glitchSymbols[Math.floor(Math.random() * glitchSymbols.length)];
                   
                    currentLine += `\u001b[38;2;0;130;200m${randomChar}`;
                }
            }

           
            process.stdout.write(this.cleanLine + currentLine + this.reset);

            if (progress >= 1) {
                clearInterval(intervalId);
               
                process.stdout.write(this.cleanLine + finalText + this.reset + "\n");
                process.stdout.write(this.showCursor);
                resolve();
            }
        }, 50);
    });
}
radarSpinner(text = "Scanning files...") {
    process.stdout.write(this.hideCursor);

   
    const frames = ["║", "╖", "╕", "╜", "║", "╓", "╒", "╓"];
    let currentFrame = 0;
    let currentStatusText = text;

    const intervalId = setInterval(() => {
        const frame = frames[currentFrame];
       
        const coloredFrame = `\u001b[38;2;0;255;100m[${frame}]\u001b[0m`;
        
       
        process.stdout.write(`\r\u001b[K${coloredFrame} ${currentStatusText}`);
        
        currentFrame = (currentFrame + 1) % frames.length;
    }, 100);

    return {
       
        update: (newText) => {
            currentStatusText = newText;
        },
       
        stop: (finalStatus = "Done!") => {
            clearInterval(intervalId);
            process.stdout.write(`\r\u001b[K\u001b[32m✓\u001b[0m ${finalStatus}\n`);
            process.stdout.write(this.showCursor);
        }
    };
}







}

module.exports = animation;