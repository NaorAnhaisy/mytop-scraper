const Reciever = require('../models/Reciever');

/**
 * Get all recievers.
 * @returns all recievers.
 */
async function getAll() {
    return await Reciever.find();
};

/**
 * Create and save new reciever to database.
 * @param {Object} newReciever new reciever data.
 */
async function saveReciever(newRecieverData) {
    const newReciever = new Reciever({
        name: newRecieverData.name,
        email: newRecieverData.email
    });

    await newReciever.save()
        .then(function () {
            console.log('New reciever saved successfully to MongoDB:', newReciever);
        }).catch(function (error) {
            console.error("Error while save reciever:");
            console.error(error);
            throw err;
        });
};

/**
 * Delete one specific reciever.
 * @param {String} recieverID ID of reciever to delete.
 */
async function deleteReciever(recieverID) {
    await Reciever.deleteOne({
        _id: recieverID
    }, function (err) {
        if (err) throw err;
    });
};

module.exports = {
    getAll,
    saveReciever,
    deleteReciever,
};