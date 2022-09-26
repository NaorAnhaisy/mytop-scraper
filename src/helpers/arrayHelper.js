var _ = require('lodash');

function getNewAppointementsOnly(freeDates, knownAppointments) {
    let res = [];
    for (const freeDatesItem of freeDates) {
        let isFound = false;
        for (const knownAppointmentsItem of knownAppointments) {
            if (_.isEqual(freeDatesItem, knownAppointmentsItem)) {
                isFound = true;
                break;
            }
        }

        !isFound && res.push(freeDatesItem);
    }

    return res;
}

exports.getNewAppointementsOnly = getNewAppointementsOnly;