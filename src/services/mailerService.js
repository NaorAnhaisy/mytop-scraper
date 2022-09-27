const nodemailer = require('nodemailer');
const { formatNewAppointmentsContent, formatNewAppointmentsContentHTML } = require('../helpers/mailHelper');
const { USER_TO_EMAIL } = require('../config');

async function sendNewAppointmentsToUser(newAppointments) {
    await sendMailToUser(USER_TO_EMAIL,
        "תורים חדשים נמצאו זמינים אצל נתנאל",
        formatNewAppointmentsContent(newAppointments),
        formatNewAppointmentsContentHTML(newAppointments));
}

/**
 * Sending mail to user.
 * @param {String} userEmail email to send the email to.
 * @param {String} title title of email (subject)
 * @param {String} content content of the email (text)
 * @param {String} htmlContnt content of the email (html)
 */
async function sendMailToUser(userEmail, title, content, htmlContnt) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS
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
        console.log(`Email sent successfully to ${userEmail}.`);
    } catch (error) {
        console.error("Error while trying to send email:", mailOptions, error);
    }
}

exports.sendNewAppointmentsToUser = sendNewAppointmentsToUser;