const mongoose = require('mongoose');

const RecieversSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Recievers', RecieversSchema);