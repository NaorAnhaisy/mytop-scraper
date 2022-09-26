const schedule = require('node-schedule');
const appointmentsService = require('./appointmentsService');
const { getDaysDiff } = require('../helpers/dateHelper');
const DAYS_PASSED_TO_DELETE_APPOINTMENT = 2;

// Schedule delete old appointment every midnight (0 0 * * *)
schedule.scheduleJob('0 0 * * *', async function () {
    console.log('Start schedule delete old appointments:');

    try {
        let toBeDeletedAppointmentsIDs = [];
        let allAppointments = await appointmentsService.getAll();
        allAppointments.forEach(appointment => {
            console.log(getDaysDiff(new Date(), appointment.date))
            if (getDaysDiff(new Date(), appointment.date) > DAYS_PASSED_TO_DELETE_APPOINTMENT) {
                toBeDeletedAppointmentsIDs.push(appointment._id);
            }
        });
        await appointmentsService.deleteArrayOfAppointments(toBeDeletedAppointmentsIDs);
        console.log('Successfully deleteded old appointments.');
    } catch (error) {
        console.error("Delete old appointments schedule failed: ", error, error.message);
    } finally {
        console.log('End deleting old appointments schedule.');
    }
});