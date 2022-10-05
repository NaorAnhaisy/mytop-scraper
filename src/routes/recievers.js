var express = require('express');
var router = express.Router();

const recieversService = require('../services/recieversService');

router.get('/', async (_req, res) => {
    try {
        const insurances = await recieversService.getAll();
        return res.status(200).send(insurances);
    } catch (error) {
        console.error(error);
        return res.status(404).json({
            message: error
        });
    }
});

/*
router.post('/', async (req, res) => {
    try {
        await recieversService.saveReciever(req?.body);
        return res.status(200).json({ isSuccess: true, message: 'Reciever saved successfully' });
    } catch (error) {
        console.error(error);
        return res.status(404).json({ isSuccess: false, message: error });
    }
});
*/

module.exports = router;
