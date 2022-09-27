/* Given a start date, end date and day name, return
** an array of dates between the two dates for the
** given day inclusive
** @param {Date} start - date to start from
** @param {Date} end - date to end on
** @param {string} dayName - name of day
** @returns {Array} array of Dates
*/
function getDaysBetweenDates(start, end, dayName) {
    var result = [];
    var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    var day = days[dayName.toLowerCase().substr(0, 3)];
    // Copy start date
    var current = new Date(start);
    // Shift to next of required days
    current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
    // While less than end date, add dates to result array
    while (current < end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
    }
    return result;
}

function getDayOfWeekInHebrew(dayOfWeekIndex) {
    var DAYS_HEBREW = [ "ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת" ];
    return DAYS_HEBREW[dayOfWeekIndex];
}

function getDaysDiff (date_1, date_2) {
    let difference = date_1.getTime() - date_2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
}

function getColorOfDay(dayOfWeekIndex) {
    var DAYS_COLORS = ["#ff4646", "#ffff3f", "#ffc0cb", "#8fff8f", "#ffc761", "#c6e7ff", "#e4abff"];
    return DAYS_COLORS[dayOfWeekIndex];
}

exports.getDaysBetweenDates = getDaysBetweenDates;
exports.getDayOfWeekInHebrew = getDayOfWeekInHebrew;
exports.getDaysDiff = getDaysDiff;
exports.getColorOfDay = getColorOfDay;