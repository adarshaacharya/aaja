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
      const $ = cheerio.load(res.body);

      const today = $('section[aria-label="Today"]');

      const npDate = today.find('a[href^="/en/date/"]').first();
      aaja.npDate = npDate.text().trim();

      const paragraphs = today.find('p');
      aaja.enDate = paragraphs.eq(0).text().trim();
      aaja.tithi = paragraphs.eq(1).text().trim() || 'No tithi found.';

      // Today's calendar cell carries its events in the aria-label,
      // e.g. "23, Dashami, Bhanu Jayanti, holiday, today"
      const todayCell = $('[aria-label$="today"]').first();
      const label = todayCell.attr('aria-label') || '';
      const events = label
        .split(',')
        .map((part) => part.trim())
        .slice(2) // drop day number and tithi
        .filter((part) => part && part !== 'holiday' && part !== 'today');

      aaja.events = events.length ? events : 'No events found for today.';

      // Time is rendered client-side on the site, so compute it locally
      aaja.time = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());

      spinner.stop();
      showOutput(aaja);
    })
    .catch((err) => {
      console.log(err);
      if (err) showError();
    });
};

main();
