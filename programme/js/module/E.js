const nodemailer = require("nodemailer");

module.exports = {
    sendMail: function () {
        let mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:"ramanapavel@gmail.com",
                pass: "ramonenko-mama-i-dad",
            },
        });
        let mailDetails = {
    from: "ramanapavel@gmail.com",
    to: "ramanapavel@gmail.com",
    subject: "Test email from node JS",
    text: "Hey! This email has been sent from Node JS",
};

mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
        console.log("Error Occurs: " + err);
    } else {
        console.log("Email sent successfully: " + data);
    }
});
    },
};