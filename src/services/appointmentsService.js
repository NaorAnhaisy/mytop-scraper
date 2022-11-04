const Appointment = require('../models/Appointment');

/**
 * Get all appointments.
 * @returns all appointments.
 */
async function getAll() {
    return await Appointment.find();
};

/**
 * Return specific appointment by ID
 * @param {String} appointmentID
 * @returns Appointment object by the param appointment ID.
 */
async function getByID(appointmentID) {
    return await Appointment.findById(appointmentID);
};

/**
 * Create and save new appointment to database.
 * @param {Array<Object>} newAppointments new appointment data.
 */
async function saveAppointments(newAppointments) {
    await Appointment.insertMany(newAppointments)
        .then(function () {
            console.log("New appointments saved successfully to MongoDB");
        }).catch(function (error) {
            console.error("Error while insertMany appointments");
            console.error(error);
            throw error;
        });
};

/**
 * Delete one specific appointment.
 * @param {String} appointmentID ID of appointment to delete.
 */
async function deleteAppointment(appointmentID) {
    await Appointment.deleteOne({
        _id: appointmentID
    }, function (err) {
        if (err) throw err;
    });
};

/**
 * Delete array of appointments.
 * @param {Array<String>} appointmentsArrayIDs appointments ID's to delete.
 */
async function deleteArrayOfAppointments(appointmentsArrayIDs) {
    await Appointment.deleteMany({
        _id: { $in: appointmentsArrayIDs },
    }, function (err) {
        if (err) throw err;
    }).clone().catch(function (err) { console.error(err) });
};

/**
 * Delete all appointments.
 */
async function deleteAllAppointments() {
    await Appointment.deleteMany({}, function (err) {
        if (err) throw err;
    }).clone().catch(function (err) { console.error(err) });
};

module.exports = {
    getAll,
    getByID,
    saveAppointments,
    deleteAppointment,
    deleteArrayOfAppointments,
    deleteAllAppointments
};