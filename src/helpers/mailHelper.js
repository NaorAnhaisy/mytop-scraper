const moment = require('moment');

function formatNewAppointmentsContent(newAppointments) {
    let content = "תורים חדשים זמינים: \n";
    newAppointments.forEach(appointment => {
        content += ("בתאריך: " + moment(appointment.date).format('DD/MM/YYYY'));
        content += (" ביום: " + appointment.hebrewDay);
        content += (" בשעה: " + appointment.time);
        content += "\n";
    });

    return content;
}

function formatNewAppointmentsContentHTML(newAppointments) {
    let content = "<div dir='rtl'><h3>תורים חדשים זמינים:</h3>";

    content += "<table border='1' cellpadding='8'><tr><th>תאריך</th><th>יום</th><th>שעה</th></tr>"
    newAppointments.forEach(appointment => {
        content += "<tr>"
        content += "<td>" + moment(appointment.date).format('DD/MM/YYYY') + "</td>"
        content += "<td>" + appointment.hebrewDay + "</td>"
        content += "<td>" + appointment.time + "</td>"
        content += "</tr>"
    });

    content += "</table></div>"
    return content;
}

exports.formatNewAppointmentsContent = formatNewAppointmentsContent;
exports.formatNewAppointmentsContentHTML = formatNewAppointmentsContentHTML;