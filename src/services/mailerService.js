const nodemailer = require('nodemailer');

/**
 * Sending mail to user.
 * @param {String} userEmail email to send the email to.
 * @param {String} title title of email (subject)
 * @param {String} content content of the email (text)
 * @param {String} htmlContnt content of the email (html)
 */
async function sendMailToUser(userEmail, title, content, htmlContnt) {
    let transporter = nodemailer.createTransport({
        host: "127.0.0.1",
        port: 1025,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        to: userEmail,
        from: process.env.EMAIL_USER,
        subject: title,
        text: content,
        html: htmlContnt
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Error while trying to send email:", mailOptions, error);
    }
}

exports.sendMailToUser = sendMailToUser;