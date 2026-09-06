const RGB_COLORS = {"Red":[255,0,0],"Blue":[0,0,255],"IndianRed":[205,92,92],"LightCoral":[240,128,128],"Salmon":[250,128,114],"DarkSalmon":[233,150,122],"LightSalmon":[255,160,122],"Crimson":[220,20,60],"FireBrick":[178,34,34],"DarkRed":[139,0,0],"Pink":[255,192,203],"LightPink":[255,182,193],"HotPink":[255,105,180],"DeepPink":[255,20,147],"MediumVioletRed":[199,21,133],"PaleVioletRed":[219,112,147],"Coral":[255,127,80],"Tomato":[255,99,71],"OrangeRed":[255,69,0],"DarkOrange":[255,140,0],"Orange":[255,165,0],"Gold":[255,215,0],"Yellow":[255,255,0],"LightYellow":[255,255,224],"LemonChiffon":[255,250,205],"LightGoldenrodYellow":[250,250,210],"PapayaWhip":[255,239,213],"Moccasin":[255,228,181],"PeachPuff":[255,218,185],"PaleGoldenrod":[238,232,170],"Khaki":[240,230,140],"DarkKhaki":[189,183,107],"GreenYellow":[173,255,47],"Chartreuse":[127,255,0],"LawnGreen":[124,252,0],"Lime":[0,255,0],"LimeGreen":[50,205,50],"PaleGreen":[152,251,152],"LightGreen":[144,238,144],"MediumSpringGreen":[0,250,154],"SpringGreen":[0,255,127],"SeaGreen":[46,139,87],"ForestGreen":[34,139,34],"Green":[0,128,0],"DarkGreen":[0,100,0],"YellowGreen":[154,205,50],"OliveDrab":[107,142,35],"Olive":[128,128,0],"DarkOliveGreen":[85,107,47],"MediumAquamarine":[102,205,170],"DarkSeaGreen":[143,188,143],"LightSeaGreen":[32,178,170],"DarkCyan":[0,139,139],"Teal":[0,128,128],"Aqua":[0,255,255],"Cyan":[0,255,255],"LightCyan":[224,255,255],"PaleTurquoise":[175,238,238],"Aquamarine":[127,255,212],"Turquoise":[64,224,208],"MediumTurquoise":[72,209,204],"DarkTurquoise":[0,206,209],"CadetBlue":[95,158,160],"SteelBlue":[70,130,180],"LightSteelBlue":[176,196,222],"PowderBlue":[176,224,230],"LightBlue":[173,216,230],"SkyBlue":[135,206,235],"LightSkyBlue":[135,206,250],"DeepSkyBlue":[0,191,255],"DodgerBlue":[30,144,255],"CornflowerBlue":[100,149,237],"RoyalBlue":[65,105,225],"MediumBlue":[0,0,205],"DarkBlue":[0,0,139],"Navy":[0,0,128],"MidnightBlue":[25,25,112],"Lavender":[230,230,250],"Thistle":[216,191,216],"Plum":[221,160,221],"Violet":[238,130,238],"Orchid":[218,112,214],"Fuchsia":[255,0,255],"Magenta":[255,0,255],"MediumOrchid":[186,85,211],"MediumPurple":[147,112,219],"Amethyst":[153,102,204],"BlueViolet":[138,43,226],"DarkViolet":[148,0,211],"DarkOrchid":[153,50,204],"DarkMagenta":[139,0,139],"Purple":[128,0,128],"Indigo":[75,0,130],"SlateBlue":[106,90,205],"DarkSlateBlue":[72,61,139],"MediumSlateBlue":[123,104,238],"Cornsilk":[255,248,220],"BlanchedAlmond":[255,235,205],"Bisque":[255,228,196],"NavajoWhite":[255,222,173],"Wheat":[245,222,179],"BurlyWood":[222,184,135],"Tan":[210,180,140],"RosyBrown":[188,143,143],"SandyBrown":[244,164,96],"Goldenrod":[218,165,32],"DarkGoldenrod":[184,134,11],"Peru":[205,133,63],"Chocolate":[210,105,30],"SaddleBrown":[139,69,19],"Sienna":[160,82,45],"Brown":[165,42,42],"Maroon":[128,0,0],"White":[255,255,255],"Snow":[255,250,250],"Honeydew":[240,255,240],"MintCream":[245,255,250],"Azure":[240,255,240],"AliceBlue":[240,248,255],"GhostWhite":[248,248,255],"WhiteSmoke":[245,245,245],"Seashell":[255,245,238],"Beige":[245,245,220],"OldLace":[253,245,230],"FloralWhite":[255,250,240],"Ivory":[255,255,240],"AntiqueWhite":[250,235,215],"Linen":[250,240,230],"LavenderBlush":[255,240,245],"MistyRose":[255,228,225],"Gainsboro":[220,220,220],"LightGray":[211,211,211],"Silver":[192,192,192],"DarkGray":[169,169,169],"Gray":[128,128,128],"DimGray":[105,105,105],"LightSlateGray":[119,136,153],"SlateGray":[112,128,144],"DarkSlateGray":[47,79,79],"Black":[0,0,0]};
const ANSI_STYLES = {"reset":"\u001b[0m","bold":"\u001b[1m","dim":"\u001b[2m","italic":"\u001b[3m","underline":"\u001b[4m","inverse":"\u001b[7m","hidden":"\u001b[8m","strikethrough":"\u001b[9m","bgRed":"\u001b[41m","bgGreen":"\u001b[42m","bgYellow":"\u001b[43m","bgBlue":"\u001b[44m"};
let customColor = [0,0,0];

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

      let nextCode = "";

      // 1. Проверяем системные стили (bold, bgRed и т.д.)
      if (prop in ANSI_STYLES) {
        nextCode = ANSI_STYLES[prop];
      } 
      // 2. Проверяем динамический фон (bgTomato и т.д.)
      else if (prop.startsWith("bg") && prop.slice(2) in RGB_COLORS) {
        const [r, g, b] = RGB_COLORS[prop.slice(2)];
        nextCode = `\x1b[48;2;${r};${g};${b}m`;
      } 
      // 3. Проверяем цвета текста (Tomato, Red и т.д.)
      else if (prop in RGB_COLORS) {
        const [r, g, b] = RGB_COLORS[prop];
        nextCode = `\x1b[38;2;${r};${g};${b}m`;
      } 
      // 4. Проверяем метод кастомного цвета
      else if (prop === "custom") {
        const [r, g, b] = customColor;
        nextCode = `\x1b[38;2;${r};${g};${b}m`;
      } 
      // Если это другое свойство (например, setCustomColor)
      else {
        return target[prop];
      }

      // ИСПРАВЛЕНИЕ: Возвращаем функцию, которая умеет обрабатывать и текст, и пустые скобки
      return function(text) {
        const updatedCodes = [...activeCodes, nextCode];
        
        // Если текст НЕ передали (например: myChalk.bgTomato() ), 
        // возвращаем новый прокси для продолжения цепочки
        if (text === undefined) {
          return createChalk(updatedCodes);
        }
        
        // Если текст передали (например: .White('Привет!') ),
        // мгновенно склеиваем и возвращаем готовую раскрашенную строку
        return updatedCodes.join("") + text + ANSI_STYLES.reset;
      };
    }
  });
}

module.exports = createChalk();