/**
 * Given a start date, end date and day name, return
 * an array of dates between the two dates for the
 * given day inclusive
 * @param {Date} start - date to start from
 * @param {Date} end - date to end on
 * @param {string} dayName - name of day
 * @returns {Array} array of Dates
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
    while (current <= end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
    }
    return result;
}

/**
 * Given a day in week index, return the day's name in hebrew
 * @param {Number} dayOfWeekIndex - index of day in week
 * @returns {String} day name's in hebrew
 */
function getDayOfWeekInHebrew(dayOfWeekIndex) {
    var DAYS_HEBREW = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return DAYS_HEBREW[dayOfWeekIndex];
}

/**
 * Given two dates, return the amount of days between the two dates
 * @param {Date} date1 - first date
 * @param {Date} date2 - first date
 * @returns {Number} amount of days between the two dates
 */
function getDaysDiff(date1, date2) {
    let difference = date1.getTime() - date2.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays;
}

/**
 * Given a day in week index, returns the color of the day,
 * according to the Thai astrology.
 * Source: https://simple.wikipedia.org/wiki/Color_of_the_day
 * @param {Number} dayOfWeekIndex - index of day in week
 * @returns {String} hexadecimal value of the day's color
 */
function getColorOfDay(dayOfWeekIndex) {
    var DAYS_COLORS = ["#ff4646", "#ffff3f", "#ffc0cb", "#8fff8f", "#ffc761", "#c6e7ff", "#e4abff"];
    return DAYS_COLORS[dayOfWeekIndex];
}

/**
 * Given two dates, check if they are equal by day, month and year
 * @param {Date} date1 - first date
 * @param {Date} date2 - second date
 * @returns true if they are the same date, else false
 */
function checkTwoDatesEqual(date1, date2) {
    return date1.toDateString() === date2.toDateString();
}

/**
 * Given two dates, check and returns how many weeks between the two dates.
 * @param {Date} date1 - first date
 * @param {Date} date2 - second date
 * @returns amount of weeks between the two dates
 */
function getWeeksDiff(date1, date2) {
    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.round(Math.abs(date1 - date2) / msInWeek);
}

/**
 * Given two dates, return the weeks difference hebrew string of the two dates
 * If 0 weeks between the two dates - הקרוב
 * If 1 weeks between the two dates - הבא
 * Else - בעוד ${weeksDiff} שבועות
 * @param {Date} date1 - first date
 * @param {Date} date2 - second date
 * @returns weeks difference hebrew string of the two dates
 */
function getWeeksDiffString(date1, date2) {
    const weeksDiff = getWeeksDiff(date1, date2);
    return weeksDiff === 0 ? "הקרוב" : weeksDiff === 1 ? "הבא" : `בעוד ${weeksDiff} שבועות`;
}

module.exports = {
    getDaysBetweenDates,
    getDayOfWeekInHebrew,
    getDaysDiff,
    getColorOfDay,
    checkTwoDatesEqual,
    getWeeksDiff,
    getWeeksDiffString
};