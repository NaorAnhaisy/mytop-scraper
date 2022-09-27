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



// const mongoose = require('mongoose');

// const InsurancesSchema = mongoose.Schema({
//     name: {
//         type: String,
//         trim: true,
//         default: ''
//     },
//     orderNumber: {
//         type: String,
//         trim: true,
//         default: ''
//     },
//     phone: {
//         type: String,
//         trim: true
//     },
//     fax: {
//         type: String,
//         trim: true
//     },
//     address: {
//         type: String,
//         trim: true
//     },
//     email: {
//         type: String,
//         trim: true
//     },
//     startDate: {
//         type: Date,
//         require: true,
//         default: new Date()
//     },
//     endDate: {
//         type: Date,
//         require: true,
//         default: new Date().setFullYear(new Date().getFullYear() + 2)
//     },
//     isMustInsurance: {
//         type: Boolean,
//         require: true,
//         default: false
//     },
//     note: {
//         type: String,
//         default: ''
//     }
// });

// module.exports = mongoose.model('Appointments', InsurancesSchema)