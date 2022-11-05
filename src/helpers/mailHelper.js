const moment = require('moment');
const { getWeeksDiffString } = require('./dateHelper');

function groupAppointmentsByDate(appointmentsArr) {
    const map = new Map();
    appointmentsArr.forEach(appointment => {
        const key = appointment.date;
        const collection = map.get(key);
        if (!collection) {
            map.set(key, appointment.hebrewDay);
        }
    });

    return map;
}

function getRelevantAppointmentsToUser(user, newAppointments) {
    if (!(user.startHour || user.endHour)) return newAppointments;

    return newAppointments.filter(newAppointment => {
        const appointmentHour = newAppointment.time.split(':')[0];
        const appointmentHourNumber = isNaN(parseInt(appointmentHour)) ? null : parseInt(appointmentHour);
        return (user.startHour && user.endHour) ? ((appointmentHourNumber >= user.startHour) && (appointmentHourNumber <= user.endHour)) :
            user.startHour ? (appointmentHourNumber >= user.startHour) : (appointmentHourNumber <= user.endHour);
    });
}

function getUserTimesString(reciever) {
    let recieverHoursString;
    if (reciever?.startHour) {
        if (reciever.endHour) {
            recieverHoursString = `בין השעות ${reciever.startHour}:00 - ${reciever.endHour}:00`
        } else {
            recieverHoursString = `החל מהשעה ${reciever.startHour}:00`;
        }
    } else if (reciever?.endHour) {
        recieverHoursString = `עד השעה ${reciever.endHour}:00`;
    } else {
        recieverHoursString = 'בכל שעות היממה';
    }

    return recieverHoursString;
}

function formatNewAppointmentsContent(reciever, newAppointments, datesGroups) {
    let content = `שלום${reciever ? (' ' + reciever.name) : ''}, נמצאו תורים חדשים זמינים בימים הבאים:\n`;
    let today = new Date(); today.setHours(0, 0, 0, 0);

    for (const [key, value] of datesGroups.entries()) {
        content += `• ${moment(key).format('DD/MM/YYYY')} - יום ${value}
        (${getWeeksDiffString(today, key)})\n`;
    }

    content += `\n`;
    newAppointments.forEach(appointment => {
        content += (`בתאריך: ${moment(appointment.date).format('DD/MM/YYYY')}`);
        content += (` יום: ${appointment.hebrewDay}`);
        content += (` שעה: ${appointment.time}`);
        content += (` לינק: ${appointment.link}`);
        content += `\n`;
    });

    content += `\nלהזכירך, לפי הגדרות המערכת בחרת לקבל התראות על תורים ${getUserTimesString(reciever)}.`
    return content;
}

function formatNewAppointmentsContentHTML(reciever, newAppointments, datesGroups) {
    const colorStyling = `color: black !important;`;
    const STYLING_TABLE_HEADERS = `style='
        text-align: center;
        font-weight: bold;
        font-size: 15px;
        padding: 10px 20px;
        ${colorStyling}
    '`;

    let today = new Date(); today.setHours(0, 0, 0, 0);
    let content = `<div dir='rtl' style='${colorStyling}'>
        <h3 style='${colorStyling}'>
            שלום${reciever ? (' ' + reciever.name) : ''}, נמצאו תורים חדשים זמינים בימים הבאים:
        </h3>`;

    if (datesGroups.size) {
        content += `<ul>`
        for (const [key, value] of datesGroups.entries()) {
            content += `<li style='${colorStyling}'> ${moment(key).format('DD/MM/YYYY')} - יום ${value}
            (${getWeeksDiffString(today, key)})</li>`;
        }
        content += `</ul><br />`
    }

    content += `<table border='1' cellpadding='8'>
        <tr>
            <td ${STYLING_TABLE_HEADERS}> תאריך </td>
            <td ${STYLING_TABLE_HEADERS}> יום </td>
            <td ${STYLING_TABLE_HEADERS}> שעה </td>
            <td ${STYLING_TABLE_HEADERS}> לינק </td>
        </tr>
    `;

    newAppointments.forEach(appointment => {
        content += `<tr style='background: ${appointment.dayColor}; ${colorStyling}'>`
        content += "<td>" + moment(appointment.date).format('DD/MM/YYYY') + "</td>"
        content += "<td>" + appointment.hebrewDay + "</td>"
        content += "<td>" + appointment.time + "</td>"
        content += `<td style='text-align: center;'>
            <a href="${appointment.link}">
                <img src="https://i.ibb.co/tXcWzjG/href-To-Tor.png" alt="לינק" style="width:20px;height:20px;">
            </a>
        </td>`
        content += "</tr>"
    });

    content += ""
    content += `</table><br />
        <h3 style='${colorStyling}'>
            להזכירך, לפי הגדרות המערכת בחרת לקבל התראות על תורים ${getUserTimesString(reciever)}.
        </h3></div>
    `;
    return content;
}

module.exports = {
    groupAppointmentsByDate,
    getRelevantAppointmentsToUser,
    formatNewAppointmentsContent,
    formatNewAppointmentsContentHTML,
};