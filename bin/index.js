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
    logUpdate((boxen(`
    Created by : Aadarsha Acharya
    GitHub     :  https://github.com/adarshaacharya
    Twitter    : https://twitter.com/adarsha_ach
  `)));
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

      const [tithi, events] = $(`${main} .events`)
        .text()
        .trim()
        .split(',')
        .map((el) => el.trim());

      aaja.tithi = tithi || 'No tithi found.';
      aaja.events = events ? events.split('/') : 'No events found for today.';

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
