var express = require('express');
var router = express.Router();

const appointmentsService = require('../services/appointmentsService');

router.get('/', async (_req, res) => {
  try {
    const insurances = await appointmentsService.getAll();
    return res.status(200).send(insurances);
  } catch (error) {
    console.error(error);
    return res.status(404).json({
      message: error
    });
  }
});

module.exports = router;
