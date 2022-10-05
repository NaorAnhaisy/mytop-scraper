const mongoose = require('mongoose');

const AppointmentsSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Appointments', AppointmentsSchema);
