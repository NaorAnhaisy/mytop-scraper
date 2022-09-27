const schedule = require('node-schedule');
const scraper = require('../utils/scraper');
const appointmentsService = require('./appointmentsService');
const { getNewAppointementsOnly } = require('../helpers/arrayHelper');
const { sendNewAppointmentsToUser } = require('./mailerService');

var isScheduleScrapeRunning = false;

// Schedule scrape the website every 15 minutes (*/15 * * * *)
// For testing: */10 * * * * *
schedule.scheduleJob('*/15 * * * * *', async function () {
    if (!isScheduleScrapeRunning) {
        isScheduleScrapeRunning = true;
        console.log('Start schedule scarpe the website:');

        try {
            let freeDates = await scraper.scrapeMyTor();
            let knownAppointments = await appointmentsService.getAll();
            let newAppointments = getNewAppointementsOnly(freeDates, knownAppointments);
            newAppointments.sort((a, b) => parseFloat(a.date) - parseFloat(b.date));
            if (newAppointments.length) {
                // await appointmentsService.saveAppointments(newAppointments);
                await sendNewAppointmentsToUser(newAppointments);
            }

            console.log('Successfully scarped the website.');
        } catch (error) {
            console.error("Scarpe the website schedule failed: ", error, error.message);
        } finally {
            console.log('End scarping the website schedule.');
        }

        isScheduleScrapeRunning = false;
    }
});