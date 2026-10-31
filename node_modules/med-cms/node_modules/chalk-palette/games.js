const codes = require("./rgb-codes.js");

class Games {
    constructor() {
        this.reset = codes.ansi ? codes.ansi.reset : "\u001b[0m";
        this.hideCursor = "\u001b[?25l";
        this.showCursor = "\u001b[?25h";
    }

        snake() {
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        const rows = process.stdout.rows || 24;
        const columns = process.stdout.columns || 80;

        let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        let dx = 1, dy = 0;
        let apple = { x: 20, y: 12 };
        let score = 0;

        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding("utf8");

        let intervalId;

        return new Promise((resolve) => {
           
            const cleanUp = (forced) => {
                clearInterval(intervalId);
                stdin.removeListener("data", handleInput);
                try {
                    stdin.setRawMode(false);
                    stdin.pause();
                } catch (e) {}
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                if (!forced) console.log(`\n\u001b[31mGame Over!\u001b[0m Финальный счет: ${score}\n`);
                resolve();
            };

            const handleInput = (key) => {
                const buf = Buffer.from(key);
                if (buf.length === 1 && buf[0] === 3) cleanUp(true);
                if (key === "\u001b[A" && dy === 0) { dx = 0; dy = -1; }
                if (key === "\u001b[B" && dy === 0) { dx = 0; dy = 1; } 
                if (key === "\u001b[D" && dx === 0) { dx = -1; dy = 0; }
                if (key === "\u001b[C" && dx === 0) { dx = 1; dy = 0; } 
            };
            stdin.on("data", handleInput);

            intervalId = setInterval(() => {
               
                const head = { x: snake[0].x + dx, y: snake[0].y + dy };
                
                if (head.x < 1 || head.x > columns || head.y < 2 || head.y > rows - 1 || 
                    snake.some(seg => seg.x === head.x && seg.y === head.y)) {
                    cleanUp(false);
                    return;
                }

                snake.unshift(head);

                if (head.x === apple.x && head.y === apple.y) {
                    score++;
                    apple = {
                        x: Math.floor(Math.random() * (columns - 2)) + 2,
                        y: Math.floor(Math.random() * (rows - 4)) + 3
                    };
                } else {
                    snake.pop();
                }

                let out = "\u001b[H";
                out += `\u001b[1;33m Score: ${score} \u001b[0m` + "—".repeat(columns - 12) + "\n";

                for (let y = 2; y < rows; y++) {
                    for (let x = 1; x <= columns; x++) {
                        if (x === apple.x && y === apple.y) {
                            out += "\u001b[38;2;255;50;50m🍎"; 
                        } else if (snake.some((seg, idx) => seg.x === x && seg.y === y)) {
                            out += snake[0].x === x && snake[0].y === y 
                                ? "\u001b[38;2;50;255;50m█"  
                                : "\u001b[38;2;0;200;0m▓";    
                        } else if (x === 1 || x === columns || y === 2 || y === rows - 1) {
                            out += "\u001b[38;5;240m#"; 
                        } else {
                            out += " ";
                        }
                    }
                    out += "\n";
                }
                process.stdout.write(out + this.reset);
            }, 70); 
        });
    }

        pong() {
        process.stdout.write("\u001b[?1049h\u001b[2J" + this.hideCursor);
        const rows = process.stdout.rows || 24;
        const columns = process.stdout.columns || 80;

        let p1Y = Math.floor(rows / 2);
        let p2Y = Math.floor(rows / 2);
        let ball = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) };
        let ballVx = 0.8, ballVy = 0.3;
        let p1Score = 0, p2Score = 0;
        const paddleHeight = 4;

        const stdin = process.stdin;
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding("utf8");

        let intervalId;

        return new Promise((resolve) => {
           
            const cleanUp = () => {
                clearInterval(intervalId);
                stdin.removeListener("data", handleInput);
                try {
                    stdin.setRawMode(false);
                    stdin.pause();
                } catch (e) {}
                process.stdout.write("\u001b[?1049l" + this.showCursor + this.reset);
                resolve();
            };

            const resetBall = () => {
                ball = { x: Math.floor(columns / 2), y: Math.floor(rows / 2) };
                ballVx = ballVx > 0 ? -0.8 : 0.8;
                ballVy = (Math.random() - 0.5) * 0.6;
            };

            const handleInput = (key) => {
                const buf = Buffer.from(key);
                if (buf.length === 1 && buf[0] === 3) cleanUp();
                if (key === "\u001b[A" && p1Y > 2) p1Y--;         
                if (key === "\u001b[B" && p1Y < rows - paddleHeight - 1) p1Y++; 
            };
            stdin.on("data", handleInput);

            intervalId = setInterval(() => {
                ball.x += ballVx;
                ball.y += ballVy;

                if (ball.y <= 2 || ball.y >= rows - 1) ballVy = -ballVy;

                if (ball.y > p2Y + paddleHeight / 2 && p2Y < rows - paddleHeight - 1) p2Y += 0.3;
                if (ball.y < p2Y + paddleHeight / 2 && p2Y > 2) p2Y -= 0.3;

                const bX = Math.round(ball.x);
                const bY = Math.round(ball.y);

                if (bX === 3 && bY >= p1Y && bY <= p1Y + paddleHeight) {
                    ballVx = -ballVx * 1.05; 
                }
                if (bX === columns - 2 && bY >= Math.round(p2Y) && bY <= Math.round(p2Y) + paddleHeight) {
                    ballVx = -ballVx * 1.05;
                }

                if (bX <= 1) { p2Score++; resetBall(); }
                if (bX >= columns) { p1Score++; resetBall(); }

                let out = "\u001b[H";
                out += `\u001b[1m Игрок: ${p1Score} | Компьютер: ${p2Score} \u001b[0m` + "—".repeat(columns - 30) + "\n";

                for (let y = 2; y < rows; y++) {
                    for (let x = 1; x <= columns; x++) {
                        if (x === bX && y === bY) {
                            out += "\u001b[38;2;255;255;0m●"; 
                        } else if (x === 2 && y >= p1Y && y <= p1Y + paddleHeight) {
                            out += "\u001b[38;2;0;255;255m█"; 
                        } else if (x === columns - 1 && y >= Math.round(p2Y) && y <= Math.round(p2Y) + paddleHeight) {
                            out += "\u001b[38;2;255;0;255m█"; 
                        } else if (x === Math.floor(columns / 2) && y > 1 && y < rows) {
                            out += "\u001b[38;5;238m|"; 
                        } else {
                            out += " ";
                        }
                    }
                    out += "\n";
                }
                process.stdout.write(out + this.reset);
            }, 33);
        });
    }
}

module.exports = Games;
