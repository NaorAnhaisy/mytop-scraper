const Reciever = require('../models/Reciever');

/**
 * Get all recievers.
 * @returns all recievers.
 */
async function getAll() {
    return await Reciever.find();
};

/**
 * Return specific reciever by ID
 * @param {String} recieverID
 * @returns Reciever object by the param reciever ID.
 */
 async function getByID(recieverID) {
    return await Reciever.findById(recieverID);
};


/**
 * Create and save new reciever to database.
 * @param {Object} newReciever new reciever data.
 */
async function saveReciever(newRecieverData) {
    const newReciever = new Reciever(newRecieverData);

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
 * Update one specific reciever.
 * @param {String} recieverID ID of reciever to update.
 */
async function updateReciever(recieverID, updatedRecieverData) {
    await Reciever.findOneAndUpdate(
        { _id: recieverID },
        updatedRecieverData,
        function (err) {
            if (err) throw err;
        }
    );
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
    getByID,
    saveReciever,
    updateReciever,
    deleteReciever,
};