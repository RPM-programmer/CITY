function PSSTD(email) {
    // Ищем позицию символа '%'
    const percentIndex = email.indexOf("%");

    // Если '%' найден и за ним следуют '40'
    if (percentIndex !== -1 && email.substring(percentIndex + 1, percentIndex + 3) === "40") {
        // Формируем новый email:
        // Берем часть строки до '%' + '@' + часть строки после "%40"
        const domain = email.substring(percentIndex + 3); // Берем всё после "%40"
        const localPart = email.substring(0, percentIndex); // Берем всё до "%"
        return localPart + "@" + domain;
    } else {
        // Если '%' или "%40" не найдены, возвращаем оригинальный email
        // или можно вернуть undefined/null, в зависимости от требований.
        return email;
    }
}

module.exports.p = PSSTD;
