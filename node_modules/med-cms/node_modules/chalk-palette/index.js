const path = require("path");
const codes = require(path.join(__dirname, "rgb-codes.js"));

const RGB_COLORS = codes.rgb;
const ANSI_STYLES = codes.ansi;
let customColor = [0, 0, 0];

let animationInstance = null;
let gamesInstance = null;

function getAnimation() {
  if (!animationInstance) {
    const AnimationClass = require(path.join(__dirname, "animation.js"));
    animationInstance = new AnimationClass();
  }
  return animationInstance;
}

function getGames() {
  if (!gamesInstance) {
    const GamesClass = require(path.join(__dirname, "games.js"));
    gamesInstance = new GamesClass();
  }
  return gamesInstance;
}

function createChalk(activeCodes = []) {
  const builder = function(text) {
    if (text === undefined) return createChalk(activeCodes);
    return activeCodes.join("") + text + ANSI_STYLES.reset;
  };
  
  builder.setCustomColor = function(red, green, blue) {
    if ([red, green, blue].some(c => typeof c !== "number" || c < 0 || c > 255)) {
      throw new Error("Color components must be between 0 and 255.");
    }
    customColor = [red, green, blue];
  };

  return new Proxy(builder, {
    get(target, prop) {
      if (typeof prop !== "string") return target[prop];
      if (prop === "animation") return getAnimation();
      if (prop === "games") return getGames();

      let styleProp = prop;
      if (!(prop in ANSI_STYLES) && !(prop in RGB_COLORS)) {
        const lower = prop.toLowerCase();
        const found = Object.keys(RGB_COLORS).find(k => k.toLowerCase() === lower);
        if (found) styleProp = found;
      }

      let nextCode = "";
      if (styleProp in ANSI_STYLES) {
        nextCode = ANSI_STYLES[styleProp];
      } 
      else if (styleProp.startsWith("bg") && styleProp.slice(2) in RGB_COLORS) {
        const [r, g, b] = RGB_COLORS[styleProp.slice(2)];
        nextCode = `\u001b[48;2;\${r};g;{b}m`;
      } 
      else if (styleProp in RGB_COLORS) {
        const [r, g, b] = RGB_COLORS[styleProp];
        nextCode = `\u001b[38;2;\${r};g;{b}m`;
      } 
      else if (styleProp === "custom") {
        const [r, g, b] = customColor;
        nextCode = `\u001b[38;2;\${r};g;{b}m`;
      } else {
        return target[prop];
      }

      return createChalk([...activeCodes, nextCode]);
    }
  });
}

const chalkInstance = createChalk();

chalkInstance.url = function(str) {
  const words = str.trim().split(/\s+/);
  const urlRegex = /^(https?:\/\/|www\.)|^[a-z0-9а-яё\-]+\.[a-zа-яё]{2,24}/i;
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    const cleanWord = word.replace(/[.,\/#!\(\%\^&\*;:{}=\-_`~()]+\)/, '');
    if (urlRegex.test(cleanWord)) {
      let fullUrl = cleanWord;
      if (!/^https?:\/\//i.test(cleanWord)) fullUrl = 'https://' + cleanWord;
      const punctuation = word.slice(cleanWord.length); 
      words[i] = `\x1b]8;;${fullUrl}\x1b\\${cleanWord}\x1b]8;;\x1b\\${punctuation}`;
    }
  }
  return words.join(" ");
};

chalkInstance.hexToRgb = hex => {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

chalkInstance.rgbToHex = (r, g, b) => {
  const toHex = num => num.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

chalkInstance.hexToRgbOb = hex => {
  hex = hex.replace(/^#/, '');
  const num = parseInt(hex, 16);
  return { red: (num >> 16) & 255, green: (num >> 8) & 255, blue: num & 255 };
};

chalkInstance.hex = (hex, text) => {
  const rgb = chalkInstance.hexToRgbOb(hex);
  return `\u001b[38;2;${rgb.red};${rgb.green};${rgb.blue}m${text}${ANSI_STYLES.reset}`;
};

chalkInstance.videoPlay = function(videoPath, duration = 10000) {
  const videoPlayer = require(path.join(__dirname, "video-play.js"));
  return videoPlayer(videoPath, duration);
};

// Динамические пробросы методов быстрого доступа на корень инстанса
chalkInstance.audioVisualizer = (dur) => getAnimation().audioVisualizer(dur);
chalkInstance.textDecrypt = (txt, dur) => getAnimation().textDecrypt(txt, dur);
chalkInstance.radarSpinner = (txt) => getAnimation().radarSpinner(txt);
chalkInstance.snake = () => getGames().snake();
chalkInstance.pong = () => getGames().pong();

// Алиасы для обратной совместимости и типов PascalCase
chalkInstance.Url = chalkInstance.url;
chalkInstance.Hex = chalkInstance.hex;
chalkInstance.HexToRgbOb = chalkInstance.hexToRgbOb;
chalkInstance.RgbToHex = chalkInstance.rgbToHex;
chalkInstance.HexToRgb = chalkInstance.hexToRgb;
chalkInstance.PlayVideo = chalkInstance.videoPlay;
chalkInstance.playVideo = chalkInstance.videoPlay;
chalkInstance.AudioVisualizer = chalkInstance.audioVisualizer;
chalkInstance.TextDecrypt = chalkInstance.textDecrypt;
chalkInstance.RadarSpinner = chalkInstance.radarSpinner;

module.exports = chalkInstance;
