const fs = require('fs');
const path = require('path');
const { Filter } = require('bad-words');
const pathToBanWords = path.resolve("moderation","bad-words.json")


let customBanRegexes = [];

try {
    const rawData = fs.readFileSync(pathToBanWords, 'utf8');
    const wordsList = JSON.parse(rawData);
    customBanRegexes = wordsList.map(word => {
        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`\\b${escaped}\\b`, 'i');
    });
    console.log(`Загружено ${customBanRegexes.length} кастомных запрещенных слов.`);
} catch (error) {
    console.error('Ошибка загрузки кастомного словаря:', error);
    customBanRegexes = [];
}
const globalFilter = new Filter();
function moderateText(text) {
    if (!text || typeof text !== 'string') {
        return {
            isAllowed: true,
            cleanedText: text,
            violations: []
        };
    }
    const violations = [];
    let cleanedText = text;
    for (const regex of customBanRegexes) {
        if (regex.test(cleanedText)) {
            const foundWord = regex.source.replace(/^\\b|\\b$/g, '').toLowerCase();
            violations.push({ type: 'CRITICAL_BAN', word: foundWord });
        }
    }
    if (violations.length > 0) {
        return {
            isAllowed: false,
            cleanedText: null,
            violations
        };
    }
    if (globalFilter.isProfane(cleanedText)) {
        cleanedText = globalFilter.clean(cleanedText);
        violations.push({ type: 'CENSORED', word: 'general_profanity' });
        return { isAllowed: false, cleanedText: null, violations };
    }
    return {
        isAllowed: true,
        cleanedText,
        violations
    };
}

module.exports = { moderateText };
