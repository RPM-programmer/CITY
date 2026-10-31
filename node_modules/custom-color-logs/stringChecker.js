/**
 * ПОЯСНЕНИЕ ПО ЛИЦЕНЗИИ:
 * Функция `distance` взята из библиотеки `fastest-levenshtein` (v1.0.16)
 * Ссылка на исходный код: https://github.com/ka-weihe/fastest-levenshtein
 * 
 * MIT License
 * Copyright (c) 2020 ka-weihe
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * ... (полный текст лицензии разрешает любое использование при сохранении этого копирайта)
 */

// Официальный алгоритм из npm-пакета fastest-levenshtein
function distance(a, b) {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Swap to save memory
  if (a.length > b.length) {
    let tmp = a;
    a = b;
    b = tmp;
  }

  let la = a.length;
  let lb = b.length;

  while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
    la--;
    lb--;
  }

  let offset = 0;
  while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
    offset++;
  }

  la -= offset;
  lb -= offset;

  if (la === 0) return lb;

  let v0 = new Int32Array(lb);
  for (let i = 0; i < lb; i++) {
    v0[i] = i + 1;
  }

  let res = 0;
  for (let i = 0; i < la; i++) {
    let ch = a.charCodeAt(offset + i);
    let current = i;
    res = i + 1;
    for (let j = 0; j < lb; j++) {
      let bCh = b.charCodeAt(offset + j);
      let next = current + (ch === bCh ? 0 : 1);
      current = v0[j];
      res = next < res ? (next < current ? next + 1 : current + 1) : (res < current ? res + 1 : current + 1);
      v0[j] = res;
    }
  }
  return res;
}

/**
 * Функция сравнения строки с массивом значений
 */
function checkTypo(userInput, dictionary, maxErrors = 2) {
  if (!Array.isArray(dictionary) || dictionary.length === 0) {
    return { found: false, exact: false, word: null, distance: 999 };
  }

  const cleanedInput = String(userInput).trim().toLowerCase();
  let minDistance = 999; // Используем число во избежание багов с Infinity
  let closestWord = null;

  for (const item of dictionary) {
    const word = String(item).trim().toLowerCase();
    
    // 1. Быстрая проверка на точное совпадение
    if (cleanedInput === word) {
      return { found: true, exact: true, word: String(item), distance: 0 };
    }

    // 2. Расчет расстояния по алгоритму из npm
    const dist = distance(cleanedInput, word);
    
    if (dist < minDistance) {
      minDistance = dist;
      closestWord = String(item);
    }
  }

  // 3. Проверка лимита опечаток
  if (minDistance <= maxErrors) {
    return { found: true, exact: false, word: closestWord, distance: minDistance };
  }

  return { found: false, exact: false, word: null, distance: minDistance };
}

module.exports = checkTypo;
