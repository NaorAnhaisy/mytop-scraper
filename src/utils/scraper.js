// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getDaysBetweenDates, getDayOfWeekInHebrew, getColorOfDay } = require('../helpers/dateHelper');
puppeteer.use(StealthPlugin());

const GOOD_DAYS_TO_HAIRCUT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const NETANEL_WEBSITR_URL = 'https://mytor.co.il/tor.php?i=bmV0YW5lbA==&s=NjQwNQ==&lang=he';

/**
 * Scrape My Tor website of the barber shop.
 * Returns all the free dates of appointments the barber shop has available.
 */
const scrapeMyTor = async () => {
  let freeDates = [];

  await puppeteer.launch({ headless: true }).then(async browser => {
    console.log('Starting...');

    // Starting the browser and opens the page:
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    await page.goto(NETANEL_WEBSITR_URL);

    let haircutDaysArr = [];

    // Getting min and max dates available to haircut:
    let minDateAvailable = await page.$eval('[name="datef"]', element => element.getAttribute("min"));
    let maxDateAvailable = await page.$eval('[name="datef"]', element => element.getAttribute("max"));
    let minDate = new Date(minDateAvailable);
    let maxDate = new Date(maxDateAvailable);

    GOOD_DAYS_TO_HAIRCUT.forEach(goodDayToHaircut => {
      haircutDaysArr = haircutDaysArr.concat(getDaysBetweenDates(minDate, maxDate, goodDayToHaircut));
    });

    console.log(`All availabe haircut days`, haircutDaysArr);

    // Loops through all haircut days available:
    for (const haircutDay of haircutDaysArr) {
      const day = ("0" + (haircutDay.getUTCDate())).slice(-2);
      const month = ("0" + (haircutDay.getMonth() + 1)).slice(-2);
      // const year = haircutDay.getUTCFullYear();
      const haircutDatePickerString = day + '' + month;

      try {
        // Insert the haircut date:
        await page.focus('input[name="datef"]');
        console.log(`Typing ${haircutDatePickerString} inside date picker date...`);
        await page.keyboard.type(haircutDatePickerString);

        // Enters to the haircut date schedule:

        await page.keyboard.press('Enter');
        await page.waitForNavigation();
        // await page.waitForSelector("body > div > div[class='w3-row-padding w3-grayscale'] > center", {visible: true})
        // await page.screenshot({ path: `testresult-${day}-${month}.png`, fullPage: true });


        const spanTexts = page.$$eval("body > div > div[class='w3-row-padding w3-grayscale'] > center a", spans => {
          spans.map(span => span.innerText)
        });

        console.log(spanTexts)

        // Getting the left hours div, which contains whether no hour left or what hours left for that day:
        const leftHoursContainer = await page.$eval("body > div > div[class='w3-row-padding w3-grayscale'] > center",
          el => el.textContent);

        const leftHoursCondition = leftHoursContainer.includes("מצטער") ||
          (leftHoursContainer.includes("תורים זמינים") && leftHoursContainer.includes("אין")) ||
          (leftHoursContainer.includes("תורים זמינים") && leftHoursContainer.includes("לא"));

        if (leftHoursCondition) {
          console.log(`Fuck ${day}-${month}`);
        } else {
          const timeRegex = /([0-1]?[0-9]|2[0-3]):[0-5][0-9]/g;
          const leftHours = leftHoursContainer.match(timeRegex);
          console.log(`Found some matching hours:`, leftHours);

          leftHours.forEach(leftHour => {
            freeDates.push({
              "date": haircutDay,
              "dayColor": getColorOfDay(haircutDay.getDay()),
              "hebrewDay": getDayOfWeekInHebrew(haircutDay.getDay()),
              "time": leftHour
            });
          });
        }
      } catch (error) {
        console.error(`Error while trying to get appointment for date ${haircutDatePickerString}`);
        console.error(error);
      } finally {
        await page.goBack();
      }
    }

    console.log(`All done ✨`);

    await browser.close();
  });

  return freeDates;
}

module.exports.scrapeMyTor = scrapeMyTor;