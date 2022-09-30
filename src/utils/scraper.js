const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { getDaysBetweenDates, getDayOfWeekInHebrew, getColorOfDay } = require('../helpers/dateHelper');
// puppeteer.use(StealthPlugin());

const GOOD_DAYS_TO_HAIRCUT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const NETANEL_WEBSITR_URL = 'https://mytor.co.il/tor.php?i=bmV0YW5lbA==&s=NjQwNQ==&lang=he';

/**
 * Scrape My Tor website of the barber shop.
 * Returns all the free dates of appointments the barber shop has available.
 */
const scrapeMyTor = async () => {
  let freeDates = [];

  const PUPPETEER_LUNCH_DEV_ARGS = { headless: false };
  const PUPPETEER_LUNCH_PROD_ARGS = { headless: true, args: ['--no-sandbox'] };

  const args = process.env.NODE_ENV === 'development' ?
    PUPPETEER_LUNCH_DEV_ARGS : PUPPETEER_LUNCH_PROD_ARGS;

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
      console.log("Calculate date...")
      const day = ("0" + (haircutDay.getUTCDate())).slice(-2);
      const month = ("0" + (haircutDay.getMonth() + 1)).slice(-2);
      const year = haircutDay.getUTCFullYear();
      console.log("Calculate date done...")
      const haircutDatePickerString = day + '-' + month + '-' + year;
      console.log(haircutDatePickerString)

      try {
        // Insert the haircut date:
        await page.waitForSelector('input[name="datef"]', {timeout: 15000});

        console.log(`Typing ${haircutDatePickerString} inside date picker date...`);
        await page.focus('input[name="datef"]');
        await page.evaluate((haircutDatePickerString) => {
          document.querySelector('input[name="datef"]').value = haircutDatePickerString;
        }, haircutDatePickerString);

        // await page.$eval('input[name="datef"]', el => el.value = haircutDatePickerString);
        // await page.keyboard.type(haircutDatePickerString);

        // Enters to the haircut date schedule:
        await page.keyboard.press('Enter');
        // console.log("Enter pressed.")
        await page.waitForNavigation();

        // Gets all available links of appointments:
        const hrefs = await page.$$eval(
          "body > div > div[class='w3-row-padding w3-grayscale'] > center a",
          all_a_tags => all_a_tags.map(a => {
            return {
              "link": a.href, "time": a.innerText
            }
          })
        );

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
          console.log(`Fuck ${day}/${month}`);
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