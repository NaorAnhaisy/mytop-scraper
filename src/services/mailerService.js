const nodemailer = require('nodemailer');
const { groupsByDates, formatNewAppointmentsContent, formatNewAppointmentsContentHTML } = require('../helpers/mailHelper');
const { USERS_TO_EMAIL } = require('../config');

async function sendNewAppointmentsToUser(newAppointments) {
    const datesGroups = groupsByDates(newAppointments);
    await sendMailToUser(USERS_TO_EMAIL,
        "תורים חדשים נמצאו זמינים אצל נתנאל",
        formatNewAppointmentsContent(newAppointments, datesGroups),
        formatNewAppointmentsContentHTML(newAppointments, datesGroups))
        .catch(err => console.error(err));
}

/**
 * Sending mail to user.
 * @param {String} reciversEmail email to send the email to.
 * @param {String} title title of email (subject)
 * @param {String} content content of the email (text)
 * @param {String} htmlContnt content of the email (html)
 */
async function sendMailToUser(reciversEmail, title, content, htmlContnt) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASS
        }
    });

    let mailOptions = {
        to: reciversEmail,
        from: process.env.EMAIL_USER,
        subject: title,
        text: content,
        html: htmlContnt
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${reciversEmail}.`);
    } catch (error) {
        console.error("Error while trying to send email:", mailOptions, error);
        throw error;
    }
}

module.exports = {
    sendNewAppointmentsToUser,
};