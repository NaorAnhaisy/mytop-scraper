const schedule = require('node-schedule');
const scraper = require('../utils/scraper');
const appointmentsService = require('./appointmentsService');
const { getNewAppointementsOnly } = require('../helpers/arrayHelper');
const { sendNewAppointmentsToUser } = require('./mailerService');

var isScheduleScrapeRunning = false;

// Schedule scrape the website every 10 minutes (*/10 * * * *)
// For testing: */10 * * * * *
schedule.scheduleJob('*/10 * * * *', async function () {
    if (!isScheduleScrapeRunning) {
        console.log('Start schedule website scarping:');

        try {
            isScheduleScrapeRunning = true;
            let freeDates = await scraper.scrapeMyTor();
            let knownAppointments = await appointmentsService.getAll();
            let newAppointments = getNewAppointementsOnly(freeDates, knownAppointments);
            newAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            if (newAppointments.length) {
                await appointmentsService.saveAppointments(newAppointments);
                await sendNewAppointmentsToUser(newAppointments);
            } else {
                console.log('No new appointments found :/');
            }

            console.log('Schedule website scarping completed successfully.');
        } catch (error) {
            console.error("Schedule website scarping schedule failed: ", error, error.message);
        } finally {
            console.log('End schedule website scarping.');
            isScheduleScrapeRunning = false;
        }
    }
});