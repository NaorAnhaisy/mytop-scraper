var express = require('express');
var router = express.Router();

const appointmentsService = require('../services/appointmentsService');

/* GET home page. */
router.get('/', async function (req, res, next) {
  res.render('index', { title: 'My Tor Scraper' });
});

router.get('/appointments', async (_req, res) => {
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
