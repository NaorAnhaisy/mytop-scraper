const puppeteer = require('puppeteer');
const { getDaysBetweenDates, getDayOfWeekInHebrew, getColorOfDay } = require('../helpers/dateHelper');
const { isDevelopmentEnv } = require('../config');

const GOOD_DAYS_TO_HAIRCUT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const MY_TOR_WEBSITR_URL = 'https://mytor.co.il';
const NETANEL_WEBSITR_URL = `${MY_TOR_WEBSITR_URL}/tor.php?i=bmV0YW5lbA==&s=NjQwNQ==&lang=he`;

/**
 * Scrape My Tor website of the barber shop.
 * Returns all the free dates of appointments the barber shop has available.
 */
const scrapeMyTor = async () => {
  let freeDates = [];

  const PUPPETEER_LUNCH_DEV_ARGS = { headless: false };
  const PUPPETEER_LUNCH_PROD_ARGS = { headless: true, args: ['--no-sandbox'] };
  const args = isDevelopmentEnv ? PUPPETEER_LUNCH_DEV_ARGS : PUPPETEER_LUNCH_PROD_ARGS;

  await puppeteer.launch(args).then(async browser => {
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
      const year = haircutDay.getUTCFullYear();
      const haircutDatePickerString = year + '-' + month + '-' + day;

      try {
        // Insert the haircut date:
        await page.waitForSelector('input[name="datef"]', { timeout: 15000 });

        console.log(`Typing ${haircutDatePickerString} inside date picker date...`);
        await page.focus('input[name="datef"]');
        await page.evaluate((haircutDatePickerString) => {
          document.querySelector('input[name="datef"]').value = haircutDatePickerString;
        }, haircutDatePickerString);

        // Enters to the haircut date schedule:
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        // Gets all available links of appointments:
        const buttonsHtmlPath = ".main-content-body > .card > button"
        let hrefs = await page.$$eval(
          buttonsHtmlPath,
          all_buttons_tags => all_buttons_tags.map(button => {
            const onclickAttributeValue = button.getAttribute('onclick');
            const hrefMatch = onclickAttributeValue?.match(/'([^']+)'/)[1];

            return {
              link: `${hrefMatch}`,
              time: button.innerText.trim()
            };
          })
        );

        hrefs.forEach(href => {
          href.link = `${MY_TOR_WEBSITR_URL}/${href.link}`;
        });

        if (hrefs && hrefs.length) {
          console.log(`Found some matching hours:`, hrefs);

          hrefs.forEach(leftHour => {
            freeDates.push({
              "date": haircutDay,
              "dayColor": getColorOfDay(haircutDay.getDay()),
              "hebrewDay": getDayOfWeekInHebrew(haircutDay.getDay()),
              "time": leftHour.time,
              "link": leftHour.link
            });
          });
        } else {
          console.log(`Fuck ${day}/${month}/${year}`);
        }
      } catch (error) {
        console.error(`Error while trying to get appointment for date ${haircutDatePickerString}`);
        console.error(error);
      } finally {
        await page.goBack();
      }
    }

    console.log(`Scraping done ✨`);

    await browser.close();
  });

  return freeDates;
}

module.exports.scrapeMyTor = scrapeMyTor;