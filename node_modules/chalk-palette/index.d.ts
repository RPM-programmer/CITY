// Описываем структуру одной функции в цепочке
interface ChalkInstance {
  (text?: string): ChalkInstance | string;

  // Системные стили
  reset(): ChalkInstance;
  bold(): ChalkInstance;
  dim(): ChalkInstance;
  italic(): ChalkInstance;
  underline(): ChalkInstance;
  inverse(): ChalkInstance;
  hidden(): ChalkInstance;
  strikethrough(): ChalkInstance;

  // Базовые системные фоны
  bgRed(): ChalkInstance;
  bgGreen(): ChalkInstance;
  bgYellow(): ChalkInstance;
  bgBlue(): ChalkInstance;

  // --- ВАША ПАЛИТРА ЦВЕТОВ ТЕКСТА ---
  Red(): ChalkInstance;
  Blue(): ChalkInstance;
  Tomato(): ChalkInstance;
  Orange(): ChalkInstance;
  Gold(): ChalkInstance;
  Yellow(): ChalkInstance;
  Lime(): ChalkInstance;
  Green(): ChalkInstance;
  Cyan(): ChalkInstance;
  Teal(): ChalkInstance;
  Navy(): ChalkInstance;
  MidnightBlue(): ChalkInstance;
  Magenta(): ChalkInstance;
  Purple(): ChalkInstance;
  White(): ChalkInstance;
  Gray(): ChalkInstance;
  Black(): ChalkInstance;
  // Добавьте сюда остальные редкие цвета (IndianRed, Khaki и т.д.) через двоеточие (): ChalkInstance;

  // --- ВАША ПАЛИТРА ЦВЕТОВ ФОНА ---
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
  // Добавьте сюда остальные фоны (bgIndianRed и т.д.) через двоеточие (): ChalkInstance;

  /** Динамический пользовательский цвет, заданный через setCustomColor */
  custom(): ChalkInstance;
  
  /** Устанавливает кастомные RGB компоненты (0-255) для метода .custom() */
  setCustomColor(red: number, green: number, blue: number): void;
}

// Объявляем, что модуль экспортирует этот объект
declare const myChalk: ChalkInstance;
export = myChalk;
