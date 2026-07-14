
function p(email) {
    const percentIndex = email.indexOf("%");
    if (percentIndex !== -1 && email.substring(percentIndex + 1, percentIndex + 3) === "40") {
        const domain = email.substring(percentIndex + 3);
        const localPart = email.substring(0, percentIndex);
        return localPart + "@" + domain;
    } else {
        return email;
    }
}

module.exports.P = p;