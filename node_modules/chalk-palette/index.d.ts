interface RgbColor {
  red: number;
  green: number;
  blue: number;
}
interface VideoOptions {
  /** Enable ultra-high resolution Braille matrix rendering / Включить ультра-высокое разрешение через матрицу Брайля */
  hyperExpansion?: boolean;
}
interface LogoTextOptions {
  /** Animation style: 'forge' (Minecraft fall), 'slide' (horizontal entrance), 'pop' (heartbeat bounce), 'hacker' (sys-command + matrix rain) */
  style?: "forge" | "slide" | "pop" | "hacker";
  /** Color name from palette (e.g. 'Gold', 'DeepSkyBlue', 'Green') */
  color?: string;
  /** Speed multiplier (Default: 1) */
  speed?: number;
}
interface LogoDrawOptions {
  /** Drawing path mode: 'outline' (contour + fill), 'zigzag', 'spiral', 'scanline' (Default: 'outline') */
  mode?: "outline" | "zigzag" | "spiral" | "scanline";
  /** Frames per second (Default: 30) */
  fps?: number;
  /** Total drawing duration in milliseconds (Default: 1500) */
  duration?: number;
  /** Highlight the tip of the virtual brush while drawing (Default: true) */
  brushGlow?: boolean;
  /** Left margin in spaces (Default: 2) */
  padLeft?: number;
}

interface LogoOptions {
  /** Animation duration in milliseconds (Default: 4000) / Длительность анимации в мс */
  duration?: number;
  /** Assemble logo from exploding particles at start (Default: true) / Сборка из взрыва частиц при старте */
  explodeOnStart?: boolean;
  /** Scatter logo into particles at the end (Default: true) / Разлёт частиц в конце */
  explodeOnEnd?: boolean;
  /** Bypass automatic CPU performance check (Default: false) / Отключить проверку производительности CPU */
  force3D?: boolean;
}

interface CameraOptions {
  /** Mirror the video stream horizontally (Default: true) / Отразить видеопоток по горизонтали (По умолчанию: true) */
  mirror?: boolean;
  /** Enable ultra-high resolution Braille matrix rendering / Включить ультра-высокое разрешение через матрицу Брайля */
  hyperExpansion?: boolean;
}
interface BaseChalkMethods {
  reset(): ChalkInstance;
  bold(): ChalkInstance;
  dim(): ChalkInstance;
  italic(): ChalkInstance;
  underline(): ChalkInstance;
  inverse(): ChalkInstance;
  hidden(): ChalkInstance;
  strikethrough(): ChalkInstance;
  bgRed(): ChalkInstance;
  bgGreen(): ChalkInstance;
  bgYellow(): ChalkInstance;
  bgBlue(): ChalkInstance;
  Red(): ChalkInstance;
  Blue(): ChalkInstance;
  IndianRed(): ChalkInstance;
  LightCoral(): ChalkInstance;
  Salmon(): ChalkInstance;
  DarkSalmon(): ChalkInstance;
  LightSalmon(): ChalkInstance;
  Crimson(): ChalkInstance;
  FireBrick(): ChalkInstance;
  DarkRed(): ChalkInstance;
  Pink(): ChalkInstance;
  LightPink(): ChalkInstance;
  HotPink(): ChalkInstance;
  DeepPink(): ChalkInstance;
  MediumVioletRed(): ChalkInstance;
  PaleVioletRed(): ChalkInstance;
  Coral(): ChalkInstance;
  Tomato(): ChalkInstance;
  OrangeRed(): ChalkInstance;
  DarkOrange(): ChalkInstance;
  Orange(): ChalkInstance;
  Gold(): ChalkInstance;
  Yellow(): ChalkInstance;
  LightYellow(): ChalkInstance;
  LemonChiffon(): ChalkInstance;
  LightGoldenrodYellow(): ChalkInstance;
  PapayaWhip(): ChalkInstance;
  Moccasin(): ChalkInstance;
  PeachPuff(): ChalkInstance;
  PaleGoldenrod(): ChalkInstance;
  Khaki(): ChalkInstance;
  DarkKhaki(): ChalkInstance;
  GreenYellow(): ChalkInstance;
  Chartreuse(): ChalkInstance;
  LawnGreen(): ChalkInstance;
  Lime(): ChalkInstance;
  LimeGreen(): ChalkInstance;
  PaleGreen(): ChalkInstance;
  LightGreen(): ChalkInstance;
  MediumSpringGreen(): ChalkInstance;
  SpringGreen(): ChalkInstance;
  SeaGreen(): ChalkInstance;
  ForestGreen(): ChalkInstance;
  Green(): ChalkInstance;
  DarkGreen(): ChalkInstance;
  YellowGreen(): ChalkInstance;
  OliveDrab(): ChalkInstance;
  Olive(): ChalkInstance;
  DarkOliveGreen(): ChalkInstance;
  MediumAquamarine(): ChalkInstance;
  DarkSeaGreen(): ChalkInstance;
  LightSeaGreen(): ChalkInstance;
  DarkCyan(): ChalkInstance;
  Teal(): ChalkInstance;
  Aqua(): ChalkInstance;
  Cyan(): ChalkInstance;
  LightCyan(): ChalkInstance;
  PaleTurquoise(): ChalkInstance;
  Aquamarine(): ChalkInstance;
  Turquoise(): ChalkInstance;
  MediumTurquoise(): ChalkInstance;
  DarkTurquoise(): ChalkInstance;
  CadetBlue(): ChalkInstance;
  SteelBlue(): ChalkInstance;
  LightSteelBlue(): ChalkInstance;
  PowderBlue(): ChalkInstance;
  LightBlue(): ChalkInstance;
  SkyBlue(): ChalkInstance;
  LightSkyBlue(): ChalkInstance;
  DeepSkyBlue(): ChalkInstance;
  DodgerBlue(): ChalkInstance;
  CornflowerBlue(): ChalkInstance;
  RoyalBlue(): ChalkInstance;
  MediumBlue(): ChalkInstance;
  DarkBlue(): ChalkInstance;
  Navy(): ChalkInstance;
  MidnightBlue(): ChalkInstance;
  Lavender(): ChalkInstance;
  Thistle(): ChalkInstance;
  Plum(): ChalkInstance;
  Violet(): ChalkInstance;
  Orchid(): ChalkInstance;
  Fuchsia(): ChalkInstance;
  Magenta(): ChalkInstance;
  MediumOrchid(): ChalkInstance;
  MediumPurple(): ChalkInstance;
  Amethyst(): ChalkInstance;
  BlueViolet(): ChalkInstance;
  DarkViolet(): ChalkInstance;
  DarkOrchid(): ChalkInstance;
  DarkMagenta(): ChalkInstance;
  Purple(): ChalkInstance;
  Indigo(): ChalkInstance;
  SlateBlue(): ChalkInstance;
  DarkSlateBlue(): ChalkInstance;
  MediumSlateBlue(): ChalkInstance;
  Cornsilk(): ChalkInstance;
  BlanchedAlmond(): ChalkInstance;
  Bisque(): ChalkInstance;
  NavajoWhite(): ChalkInstance;
  Wheat(): ChalkInstance;
  BurlyWood(): ChalkInstance;
  Tan(): ChalkInstance;
  RosyBrown(): ChalkInstance;
  SandyBrown(): ChalkInstance;
  Goldenrod(): ChalkInstance;
  DarkGoldenrod(): ChalkInstance;
  Peru(): ChalkInstance;
  Chocolate(): ChalkInstance;
  SaddleBrown(): ChalkInstance;
  Sienna(): ChalkInstance;
  Brown(): ChalkInstance;
  Maroon(): ChalkInstance;
  White(): ChalkInstance;
  Snow(): ChalkInstance;
  Honeydew(): ChalkInstance;
  MintCream(): ChalkInstance;
  Azure(): ChalkInstance;
  AliceBlue(): ChalkInstance;
  GhostWhite(): ChalkInstance;
  WhiteSmoke(): ChalkInstance;
  Seashell(): ChalkInstance;
  Beige(): ChalkInstance;
  OldLace(): ChalkInstance;
  FloralWhite(): ChalkInstance;
  Ivory(): ChalkInstance;
  AntiqueWhite(): ChalkInstance;
  Linen(): ChalkInstance;
  LavenderBlush(): ChalkInstance;
  MistyRose(): ChalkInstance;
  Gainsboro(): ChalkInstance;
  LightGray(): ChalkInstance;
  Silver(): ChalkInstance;
  DarkGray(): ChalkInstance;
  Gray(): ChalkInstance;
  DimGray(): ChalkInstance;
  LightSlateGray(): ChalkInstance;
  SlateGray(): ChalkInstance;
  DarkSlateGray(): ChalkInstance;
  Black(): ChalkInstance;
  bgTomato(): ChalkInstance;
  bgOrange(): ChalkInstance;
  bgGold(): ChalkInstance;
  bgYellow(): ChalkInstance;
  bgLime(): ChalkInstance;
  bgGreen(): ChalkInstance;
  bgCyan(): ChalkInstance;
  bgTeal(): ChalkInstance;
  bgMidnightBlue(): ChalkInstance;
  bgMagenta(): ChalkInstance;
  bgPurple(): ChalkInstance;
  bgWhite(): ChalkInstance;
  bgBlack(): ChalkInstance;

  /** Use your custom RGB color / Использовать свой RGB цвет */
  custom(): ChalkInstance;
}
declare class GamesInstance {
  /** Launch classic Snake terminal arcade / Запустить классическую змейку в консоли */
  snake(): Promise<void>;
  /** Launch retro Pong arcade against AI / Запустить ретро-понг против компьютера */
  pong(): Promise<void>;
}
declare class AnimationInstance {
  /** Full-screen text logo animation / Полноэкранная анимация текстового логотипа */
  logoAnimation(text: string, options?: LogoTextOptions): Promise<void>;
  /** Step-by-step brush/laser drawing of a PNG logo / Пошаговая отрисовка PNG-логотипа */
  drawLogo(filePath: string, options?: LogoDrawOptions): Promise<void>;
  /** Full-screen 3D rotating PNG logo / Полноэкранное 3D-вращение PNG-логотипа */
  playLogo(filePath: string, options?: LogoOptions): Promise<void>;

  /** Rainbow scrolling text / Бегущая радужная строка */
  rainbow(text: string, speed?: number): { stop(): void };
  /** Typewriter simulation / Имитация печатной машинки */
  typewriter(text: string, speed?: number): Promise<void>;
  /** Matrix digital rain / Цифровой дождь Матрицы */
  matrix(
    duration?: number,
    colorName?: "green" | "orange" | "blue" | "yellow" | "red",
  ): Promise<void>;
  /** Terminal text glitch / Хакерское искажение текста */
  glitch(text: string, duration?: number): Promise<void>;
  /** Smooth text fading / Синусоидальная пульсация текста */
  pulse(text: string, duration?: number): Promise<void>;
  /** Full-screen procedural fire / Полноэкранный процедурный огонь */
  fire(duration?: number): Promise<void>;
  /** Mask password inputs / Скрывать ввод пароля за звездочками */
  passwordMask(question?: string, maskChar?: string): Promise<string>;
  /** Dynamic visual progress bar / Цветной индикатор выполнения */
  progressBar(totalSteps?: number): { update(currentStep: number): void };
  /** TrueColor smooth gradient / Плавный 24-битный градиент */
  gradient(text: string, colorFrom: string, colorTo: string): string;
  /** Animated loading indicator / Анимированная крутилка загрузки */
  spinner(
    text?: string,
    style?: "dots" | "line" | "arrows",
  ): { stop(finalStatus?: string): void };
  /** Bouncing ball loader / Загрузчик со скачущим мячом */
  bouncingBall(text?: string, duration?: number): Promise<void>;
  /** Full-screen procedural physics fireworks / Красочный процедурный салют */
  fireworks(duration?: number): Promise<void>;
  /** Assemble text from flying glitching particles / Эффектная сборка текста из хаотичных частиц */
  textAssemble(text: string, duration?: number): Promise<void>;
  /** Explode text into dust / Взрыв строки текста в пыль с ударной волной */
  textExplode(
    text: string,
    config?: {
      type?: "nuke" | "c4" | "torpedo";
      duration?: number;
      side?: "left" | "right";
      c4Index?: number;
      c4Color?: string;
    },
  ): Promise<void>;
  /** Morph one text string into another / Плавная трансформация одного текста в другой через глитчи */
  textMorph(textFrom: string, textTo: string, duration?: number): Promise<void>;
  /** Retro neon lines saver / Процедурные неоновые линии в стиле 80-х */
  retroLines(config?: {
    duration?: number;
    linesCount?: number;
    offset?: number;
  }): Promise<void>;
  /** Laser burn-in text effect / Лазерное выжигание текста слева направо */
  textLaser(text: string, duration?: number): Promise<void>;
  /** Shimmering light reflex on text / Световой блик, пробегающий по строке текста */
  textShimmer(text: string, duration?: number): Promise<void>;
  /** Interactive terminal selection menu / Интерактивное CLI меню с выбором опций стрелочками */
  menu(
    options: string[],
    title?: string,
  ): Promise<{ index: number; value: string } | null>;
  /** Terminal blind typing trainer game / Интерактивная игра-тренажер скорости печати */
  typingGame(text: string): Promise<void>;
  /** 3D Starfield fly-through simulator / Интерактивный полет сквозь трехмерное звездное поле */
  starfield(duration?: number): Promise<void>;
  /** Sine-wave vertical floating text / Эффект плавающего по вертикальной синусоиде текста */
  wave(text: string, duration?: number): Promise<void>;
  /** CRT monitor scanline ray effect / Имитация пролетающего луча развертки старого ЭЛТ-монитора */
  scanline(text: string, duration?: number): Promise<void>;
  /** Fractal Mandelbrot psycho zoomer / Психоделическое погружение во фрактал Мандельброта */
  mandelbrot(duration?: number): Promise<void>;
  /** Real-time microphone audio visualizer graph / Визуализатор звука с микрофона в реальном времени */
  audioVisualizer(duration?: number): Promise<void>;
  /** TrueColor smooth procedural lava-lamp plasma / Психоделическая TrueColor плазма из демосцены */
  plasma(duration?: number): Promise<void>;
  /** Hyperspace travel warp neo-lines streak / Эффект размытия звезд при переходе в гиперпространство */
  warpSpeed(duration?: number): Promise<void>;
  /** Cyber military tactical loop-radar scanner / Военно-хакерский круговой интерфейс радара */
  cyberRadar(duration?: number): Promise<void>;
  /** Turn text string into falling sand particles / Растворение и осыпание строки текста песчинками вниз */
  textDissolve(text: string): Promise<void>;
  /** Matrix-style password decryption text effect / Эффект дешифратора пароля с бегущими глитч-символами */
  textDecrypt(finalText: string, duration?: number): Promise<void>;
  /** Animated radar spinner for background tasks / Анимированный спиннер-радар для фоновых задач (поиск файлов) */
  radarSpinner(text?: string): {
    update(newText: string): void;
    stop(finalStatus?: string): void;
  };
}
type InvertCase<T extends string> = T extends `${infer F}${infer R}`
  ? F extends Capitalize<F>
    ? `${Uncapitalize<F>}${R}`
    : `${Capitalize<F>}${R}`
  : T;
type InvertedMethods = {
  [K in keyof BaseChalkMethods as InvertCase<
    Extract<K, string>
  >]: BaseChalkMethods[K];
};
interface ChalkUtilityMethods {
  /** Create a clickable Terminal Hyperlink / Создать кликабельную ссылку для терминала */
  url(str: string): string;
  /** Create a clickable Terminal Hyperlink (PascalCase alias) */
  Url(str: string): string;

  /** Colorize text using explicit HEX string / Стилизовать текст через HEX-код */
  hex(hex: string, text: string): string;
  /** Colorize text using explicit HEX string (PascalCase alias) */
  Hex(hex: string, text: string): string;

  /** Convert HEX string to functional rgb(...) string / Конвертировать HEX в строку вида rgb(r,g,b) */
  hexToRgb(hex: string): string;
  /** Convert HEX string to functional rgb(...) string (PascalCase alias) */
  HexToRgb(hex: string): string;

  /** Convert HEX string to structured RgbColor object / Преобразовать HEX в объект {red, green, blue} */
  hexToRgbOb(hex: string): RgbColor;
  /** Convert HEX string to structured RgbColor object (PascalCase alias) */
  HexToRgbOb(hex: string): RgbColor;

  /** Convert RGB components to HEX string / Сконвертировать каналы RGB в HEX-строку */
  rgbToHex(r: number, g: number, b: number): string;
  /** Convert RGB components to HEX string (PascalCase alias) */
  RgbToHex(r: number, g: number, b: number): string;

  /** Decode and stream video directly into terminal as ASCII / Декодировать и воспроизвести видео в ASCII-графике */
  videoPlay(
    videoPath: string,
    duration?: number,
    options?: VideoOptions,
  ): Promise<void>;
  /** Decode and stream video directly into terminal as ASCII (Alias) / Декодировать и воспроизвести видео в ASCII-графике */
  playVideo(
    videoPath: string,
    duration?: number,
    options?: VideoOptions,
  ): Promise<void>;
  /** Decode and stream video directly into terminal as ASCII (PascalCase alias) / Декодировать и воспроизвести видео в ASCII-графике */
  PlayVideo(
    videoPath: string,
    duration?: number,
    options?: VideoOptions,
  ): Promise<void>;
  /** Real-time microphone audio visualizer graph / Визуализатор звука с микрофона в реальном времени */
  audioVisualizer(duration?: number): Promise<void>;
  /** Real-time microphone audio visualizer graph (PascalCase alias) */
  AudioVisualizer(duration?: number): Promise<void>;

  /** Stream real-time camera video directly into terminal as ASCII / Трансляция видео с веб-камеры в терминал в реальном времени */
  cameraStream(duration?: number, options?: CameraOptions): Promise<void>;
  /** Stream real-time camera video directly into terminal as ASCII (Alias) / Трансляция видео с веб-камеры в терминал в реальном времени */
  streamCamera(duration?: number, options?: CameraOptions): Promise<void>;
  /** Stream real-time camera video directly into terminal as ASCII (PascalCase alias) / Трансляция видео с веб-камеры в терминал в реальном времени */
  CameraStream(duration?: number, options?: CameraOptions): Promise<void>;
  /** Full-screen text logo animation (Alias) */
  logoTextAnimation(text: string, options?: LogoTextOptions): Promise<void>;
  /** Full-screen text logo animation (PascalCase alias) */
  LogoTextAnimation(text: string, options?: LogoTextOptions): Promise<void>;

  /** Step-by-step brush/laser drawing of a PNG logo with zero dependencies / Пошаговая отрисовка PNG-логотипа без зависимостей */
  drawLogo(filePath: string, options?: LogoDrawOptions): Promise<void>;
  /** Step-by-step brush/laser drawing of a PNG logo (PascalCase alias) */
  DrawLogo(filePath: string, options?: LogoDrawOptions): Promise<void>;

  /** Render a full-screen 3D rotating PNG logo with zero dependencies / Полноэкранное 3D-вращение PNG-логотипа без зависимостей */
  playLogo(filePath: string, options?: LogoOptions): Promise<void>;
  /** Render a full-screen 3D rotating PNG logo (PascalCase alias) */
  PlayLogo(filePath: string, options?: LogoOptions): Promise<void>;
  /** Render a full-screen 3D rotating PNG logo (Alias) */
  playLogo3D(filePath: string, options?: LogoOptions): Promise<void>;
  /** Render a full-screen 3D rotating PNG logo (PascalCase alias) */
  PlayLogo3D(filePath: string, options?: LogoOptions): Promise<void>;
}
interface ChalkCallable {
  (text?: string): ChalkInstance | string;
  /** Set your custom global RGB values for .custom() method / Задать свои значения RGB для метода .custom() */
  setCustomColor(red: number, green: number, blue: number): void;
}
type ChalkInstance = ChalkCallable &
  BaseChalkMethods &
  InvertedMethods &
  ChalkUtilityMethods & {
    readonly animation: AnimationInstance;
    /** Access built-in interactive terminal retro-games / Доступ к встроенным консольным играм */
    readonly games: GamesInstance;
    snake(): Promise<void>;
    pong(): Promise<void>;
    textDecrypt(finalText: string, duration?: number): Promise<void>;
    TextDecrypt(finalText: string, duration?: number): Promise<void>;
    radarSpinner(text?: string): {
      update(newText: string): void;
      stop(finalStatus?: string): void;
    };
    RadarSpinner(text?: string): {
      update(newText: string): void;
      stop(finalStatus?: string): void;
    };
  };
declare const myChalk: ChalkInstance;
export = myChalk;
