#!/usr/bin/env node

'use strict';

import dns from 'dns';
import got from 'got';
import cheerio from 'cheerio';
import chalk from 'chalk';
import ora from 'ora';
import logUpdate from 'log-update';
import updateNotifier from 'update-notifier';
import meow from 'meow';

import { promises as fsp } from 'fs';
const pkg = JSON.parse(await fsp.readFile('package.json', 'utf-8'));

updateNotifier({ pkg }).notify();

const spinner = ora();
const arg = process.argv[2];
const url = `english.hamropatro.com`;

const checkArgs = () => {
  if (arg === '-h' || arg === '--help') {
    console.log(`
      ${chalk.cyan('Usage:')} 
    
      ${chalk.cyan('$ aaja')}     display today's nepali date
    `);
    meow(`
	      Usage
	        $ aaja
    `);

    process.exit(1);
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
  logUpdate(`\n${dim('Could not fetch date. Please try again!')}\n`);
  process.exit(1);
};

const main = () => {
  const aaja = {};
  checkArgs();
  checkConnection();

  got(`https://${url}`)
    .then((res) => {
      const $ = cheerio.load(res.body, {
        xml: {
          normalizeWhitespace: true,
        },
      });

      const main = `#top .container12 .column4 .logo`;

      const npdate = $(`${main} .date`);
      aaja.date = npdate.text().trim();

      const [tithi, events] = $(`${main} .events`)
        .text()
        .trim()
        .split(',')
        .map((el) => el.trim());

      aaja.tithi = tithi;
      aaja.events = events.split('/');

      const time = $(`${main} .time > span:nth-child(1)`);
      aaja.time = time.text().trim();

      const ad = $(`${main} .time >span.eng`);
      aaja.ad = ad.text().trim();

      spinner.stop();
      console.log(aaja);
    })
    .catch((err) => {
      if (err) showError();
    });
};

main();
