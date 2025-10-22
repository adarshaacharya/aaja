#!/usr/bin/env node
'use strict';
const dns = require('dns');
const got = require('got');
const cheerio = require('cheerio');
const chalk = require('chalk');
const ora = require('ora');
const logUpdate = require('log-update');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const { showOutput } = require('../utils/output');
const boxen = require('boxen');

updateNotifier({ pkg }).notify();

const spinner = ora();
const url = `english.hamropatro.com`;

const checkArgs = (args) => {
  if (args[0] === '--author') {
    logUpdate(
      boxen(`
    Created by : Adarsha Acharya
    GitHub     :  https://github.com/adarshaacharya
    Twitter    : https://twitter.com/adarsha_ach
  `)
    );
    process.exit(0);
  }
};

const checkConnection = () => {
  dns.lookup(url, (err) => {
    if (err) {
      console.log(err);
      logUpdate(`\n ✖ Please check your internet connection. \n`);
      process.exit(1);
    } else {
      logUpdate();
      spinner.text = `Fetching today's date\n\n`;
      spinner.start();
    }
  });
};

const showError = () => {
  logUpdate(`\n${chalk.dim('Could not fetch date. Please try again!')}\n`);
  process.exit(1);
};

const main = () => {
  const aaja = {};
  const userArgv = process.argv.slice(2);
  checkArgs(userArgv);

  checkConnection();

  got(`https://${url}`)
    .then((res) => {
      const $ = cheerio.load(res.body, {
        xml: {
          normalizeWhitespace: true,
        },
      });

      const main = `#top .container12 .column4 .logo`;

      const npDate = $(`${main} .date`);
      aaja.npDate = npDate.text().trim();

      // Extract tithi from divs without specific classes (between .date and .time)
      // These divs contain tithi info - we want the one with English text
      let tithiFound = false;
      $(`${main} > div`).each((i, elem) => {
        const className = $(elem).attr('class') || '';
        // Skip divs with known classes
        if (className === 'date' || className === 'time') {
          return;
        }

        const text = $(elem).text().trim();
        // Look for text that contains English letters (not just Devanagari)
        if (text && /[a-zA-Z]/.test(text) && !tithiFound) {
          // Extract English words (remove Devanagari, colons, and special chars)
          const englishWords = text
            .replace(/[\u0900-\u097F:]/g, ' ') // Remove Devanagari and colons
            .split(/\s+/) // Split by whitespace
            .filter((word) => word && /^[a-zA-Z]+$/.test(word)); // Keep only pure English words

          if (englishWords.length > 0) {
            aaja.tithi = englishWords.join(' ');
            tithiFound = true;
          }
        }
      });

      if (!tithiFound) {
        aaja.tithi = 'No tithi found.';
      }

      // Extract events from the upcoming days section
      let eventsFound = false;
      const upcomingDays = $('.upcomingdays.scroll li');
      upcomingDays.each((i, elem) => {
        const text = $(elem).text().trim();
        if (text.includes('today')) {
          const eventText = $(elem).find('.info span').first().text().trim();
          if (eventText) {
            aaja.events = eventText.split('/').map((e) => e.trim());
            eventsFound = true;
          }
        }
      });

      if (!eventsFound) {
        aaja.events = 'No events found for today.';
      }

      const time = $(`${main} .time > span:nth-child(1)`);
      aaja.time = time.text().trim();

      const enDate = $(`${main} .time >span.eng`);
      aaja.enDate = enDate.text().trim();

      spinner.stop();
      showOutput(aaja);
    })
    .catch((err) => {
      console.log(err);
      if (err) showError();
    });
};

main();
