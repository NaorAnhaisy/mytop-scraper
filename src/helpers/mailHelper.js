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
    const STYLING_TABLE_HEADERS = `style='
        text-align: center;
        font-weight: bold;
        font-size: 15px;
        padding: 10px 20px;'
    `;

    content += `<table border='1' cellpadding='8'>
        <tr>
            <td ${STYLING_TABLE_HEADERS}> תאריך </td>
            <td ${STYLING_TABLE_HEADERS}> יום </td>
            <td ${STYLING_TABLE_HEADERS}> שעה </td>
        </tr>
    `;

    newAppointments.forEach(appointment => {
        content += `<tr style='background: ${appointment.dayColor}'>`
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