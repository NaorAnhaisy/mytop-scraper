const mongoose = require('mongoose');
const { isEmail } = require('validator');

const validateHour = (hour) => {
    var hourRegex = /^[0-1]?[0-9]|2[0-3]$/;
    return hourRegex.test(hour);
};

const RecieversSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name address is required'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: [isEmail, 'Please fill a valid email address'],
    },
    startHour: {
        type: Number,
        trim: true,
        required: false,
        validate: [validateHour, 'Please fill a valid hour'],
    },
    endHour: {
        type: Number,
        trim: true,
        required: false,
        validate: [validateHour, 'Please fill a valid hour'],
    },
});

module.exports = mongoose.model('Recievers', RecieversSchema);