const path = require("path");
const rawBadWords = require('russian-bad-words');

/**
 * Безопасное извлечение слов из любого формата экспорта npm-библиотеки
 */
function extractWordsList(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.default)) return raw.default;
    if (Array.isArray(raw.words)) return raw.words;
    const values = Object.values(raw).filter(v => typeof v === 'string');
    if (values.length > 0) return values;
    return Object.keys(raw);
  }
  return [];
}

// 1. Получаем базовый массив из npm-библиотеки
const baseWords = extractWordsList(rawBadWords);

// 2. Импортируем ваш собственный JSON-файл со словами
let myAdditionalWords = [];
try {
  // Node.js автоматически загружает и парсит JSON в массив
  myAdditionalWords = require(path.resolve("moderation", "bad-words.json")); 
} catch (error) {
  console.warn('Предупреждение: Не удалось загрузить bad_words.json (файл отсутствует или поврежден).');
}

// 3. Объединяем базы данных в один производительный Set (поиск за O(1))
const finalWordsList = baseWords.concat(myAdditionalWords);
const badWordsSet = new Set(finalWordsList.map(w => String(w).toLowerCase()));

// 4. Улучшенные регулярные выражения для поиска корней и обхода маскировки (например, "бл*дь")
const customBanRegexes = [
  /\b(дурак|идиот|кретин)\b/ig,
  /б[лль]*[яяааее\*0-9\!@\$a-z]*д[ьъ]?/ig,
  /х[уууу\*x]*й/ig,
  /с[уу\*u]+к[аиоуеяыа-яa-z]*/ig
];

/**
 * Очистка текста от базовых попыток обхода фильтра (leet-speak и маскировка внутри слова)
 */
function normalizeTextForAnalysis(text) {
  let normalized = text.toLowerCase();
  
  // Заменяем распространенные английские буквы на визуально похожие русские
  const replacements = { 'a': 'а', 'c': 'с', 'e': 'е', 'o': 'о', 'p': 'р', 'x': 'х', 'y': 'у', 't': 'т' };
  normalized = normalized.split('').map(char => replacements[char] || char).join('');
  
  // Склеиваем слово, если спецсимволы вставлены внутрь (например, "бл*дь" -> "блдь")
  normalized = normalized.replace(/(?<=\p{L})[*@!_$-]+(?=\p{L})/gu, '');
  
  return normalized;
}

/**
 * Основная функция модерации текста
 * @param {string} text - Исходный текст для проверки
 * @returns {object} Результат модерации
 */
function moderateText(text) {
  if (!text || typeof text !== 'string') {
    return {
      isAllowed: true,
      cleanedText: text,
      violations: []
    };
  }

  const violations = [];
  let currentText = text;
  
  // Создаем нормализованную копию текста исключительно для анализа регулярными выражениями
  const analyzedText = normalizeTextForAnalysis(text);

  // Шаг A: Проверка по регулярным выражениям (ищем и в оригинале, и в нормализованном тексте)
  for (const regex of customBanRegexes) {
    regex.lastIndex = 0;
    
    const matchesOriginal = currentText.match(regex) || [];
    const matchesAnalyzed = analyzedText.match(regex) || [];
    const allMatches = [...new Set([...matchesOriginal, ...matchesAnalyzed])];

    if (allMatches.length > 0) {
      allMatches.forEach(word => {
        violations.push({
          type: 'CRITICAL_BAN',
          word: word.toLowerCase(),
        });
      });
      
      // Маскируем найденное регуляркой в оригинальном тексте
      currentText = currentText.replace(regex, (match) => '*'.repeat(match.length));
    }
  }

  // Шаг Б: Проверяем точечные совпадения по общему словарю (Set)
  // Разбиваем текст на отдельные слова, игнорируя знаки препинания
  const wordsInText = currentText.toLowerCase()
    .replace(/[*]+/g, ' ') // Не анализируем то, что уже замаскировано звездочками
    .split(/[^\p{L}\p{N}]+/u);
    
  const detectedProfanities = new Set();

  for (const word of wordsInText) {
    // Дополнительно проверяем слово, очистив его от возможных внутренних спецсимволов
    const cleanWord = word.replace(/[*@!_$-]/g, '');
    
    if (word && (badWordsSet.has(word) || badWordsSet.has(cleanWord))) {
      detectedProfanities.add(word);
      violations.push({
        type: 'CENSORED',
        word: word,
      });
    }
  }

  // Шаг В: Заменяем звездочками найденные слова из словарей
  if (detectedProfanities.size > 0) {
    detectedProfanities.forEach(profaneWord => {
      const escapedWord = profaneWord.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // Используем Unicode-границы слова вместо \b для корректной работы с кириллицей
      const replaceRegex = new RegExp(`(?<=^|[^\\p{L}\\p{N}])${escapedWord}(?=$|[^\\p{L}\\p{N}])`, 'igu');
      currentText = currentText.replace(replaceRegex, (match) => '*'.repeat(match.length));
    });
  }

  // Финальный подчищающий проход регулярными выражениями для закрепления результата
  customBanRegexes.forEach(regex => {
    currentText = currentText.replace(regex, (match) => '*'.repeat(match.length));
  });

  const isAllowed = violations.length === 0;

  return {
    isAllowed,
    cleanedText: currentText,
    violations,
  };
}

module.exports = { moderateText };