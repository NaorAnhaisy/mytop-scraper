const schedule = require('node-schedule');
const scraper = require('../utils/scraper');
const appointmentsService = require('./appointmentsService');
const { getNewAppointementsOnly } = require('../helpers/arrayHelper');
const { sendMailToUser } = require('./mailerService');
const { formatNewAppointmentsContent, formatNewAppointmentsContentHTML } = require('../helpers/mailHelper');
const { USER_TO_EMAIL } = require('../config');

var isScheduleScrapeRunning = false;

// Schedule scrape the website every 20 minutes (*/20 * * * *)  */10 * * * * *
schedule.scheduleJob('*/10 * * * * *', async function () {
    if (!isScheduleScrapeRunning) {
        isScheduleScrapeRunning = true;
        console.log('Start schedule scarpe the website:');

        try {
            let freeDates = await scraper.scrapeMyTor();
            let knownAppointments = await appointmentsService.getAll();
            let newAppointments = getNewAppointementsOnly(freeDates, knownAppointments);
            // await appointmentsService.saveAppointments(newAppointments);
            await sendMailToUser(USER_TO_EMAIL,
                "תורים חדשים נמצאו זמינים אצל נתנאל",
                formatNewAppointmentsContent(newAppointments),
                formatNewAppointmentsContentHTML(newAppointments));
            console.log('Successfully scarped the website.');
        } catch (error) {
            console.error("Scarpe the website schedule failed: ", error, error.message);
        } finally {
            console.log('End scarping the website schedule.');
        }

        isScheduleScrapeRunning = false;
    }
});