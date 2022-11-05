const nodemailer = require('nodemailer');
const {
    groupAppointmentsByDate,
    getRelevantAppointmentsToUser,
    formatNewAppointmentsContent,
    formatNewAppointmentsContentHTML
} = require('../helpers/mailHelper');
const { USERS_TO_EMAIL } = require('../config');
const recieversService = require('./recieversService');

async function sendNewAppointmentsEmailToUsers(newAppointments) {
    const datesGroups = groupAppointmentsByDate(newAppointments);

    // await sendMailToUser(USERS_TO_EMAIL,
    //     "תורים חדשים נמצאו זמינים אצל נתנאל",
    //     formatNewAppointmentsContent(newAppointments, datesGroups),
    //     formatNewAppointmentsContentHTML(newAppointments, datesGroups))
    //     .catch(err => console.error(err));

    const allRecievers = await recieversService.getAll();
    await Promise.all(allRecievers.map(async (reciever) => {
        const relevantAppointmentsToUser = getRelevantAppointmentsToUser(reciever, newAppointments);
        if (relevantAppointmentsToUser.length) {
            await sendMailToUser(reciever.email,
                "תורים חדשים נמצאו זמינים אצל נתנאל",
                formatNewAppointmentsContent(reciever, relevantAppointmentsToUser, datesGroups),
                formatNewAppointmentsContentHTML(reciever, relevantAppointmentsToUser, datesGroups))
                .catch(err => console.error(err));
        } else {
            console.log(`Email not sent to ${reciever.name} (${reciever.email}) because it\'s not intersting him`);
        }
    }));
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
    sendNewAppointmentsEmailToUsers,
};