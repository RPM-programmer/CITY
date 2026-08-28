const temporaryTokens = [];

// Асинхронный поиск и обработка просроченного токена
async function cht(tokenStr) {
    // Ищем токен по его уникальному значению, а не по индексу
    const tokenIndex = temporaryTokens.findIndex(item => item && item.TOKEN === tokenStr);
    
    if (tokenIndex !== -1) {
        const token = temporaryTokens[tokenIndex];
        
        // Подключаем модуль динамически во избежание циклической зависимости
        const db = require("./database.js").b;

        try {
            // Выполняем операции последовательно, дожидаясь ответа БД
            await db.subtractManny(token.TO, token.MANNY, "1000");
            await db.addManny(token.FROM, token.MANNY, "1000");
            await db.blockAccount(token.TO, "1000");
        } catch (error) {
            console.error(`[Token Error] Ошибка при автоматическом откате средств для токена ${tokenStr}:`, error);
        }

        // Безопасно удаляем элемент из массива, не ломая чужие индексы
        temporaryTokens.splice(tokenIndex, 1);
    }
}

class t {
    static newToken(to, from, manny) {
        // Быстрая генерация 10-значного числового токена строки
        const tokenStr = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
        
        const token = { TO: to, FROM: from, TOKEN: tokenStr, MANNY: manny };
        temporaryTokens.push(token);
        
        // Передаем в таймер саму строку токена вместо индекса массива
        setTimeout(cht, 120000, tokenStr);
        return tokenStr; 
    }

    static findToken(token_) {
        const id = temporaryTokens.findIndex(item => item && item.TOKEN === token_);
        if (id === -1) return null;

        // Извлекаем объект и удаляем его из массива
        const [found] = temporaryTokens.splice(id, 1); 
        return found; 
    }
}

module.exports = { t };
