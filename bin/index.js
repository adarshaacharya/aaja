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

updateNotifier({ pkg }).notify();

const spinner = ora();
const arg = process.argv[2];
const url = `hamropatro.com`;


if ( arg === '-h' || arg === '--help') {
  console.log(`
    ${chalk.cyan('Usage:')} 
  
    ${chalk.cyan('$ aaja')}     display today's nepali date
  `);
  process.exit(1);
}

dns.lookup(url, (err) => {
  if (err) {
    console.log(err)
    logUpdate(`\n ✖ You're offline! \n`);
    process.exit(1);
  } else {
    logUpdate();
    spinner.text = `Fetching today's date`;
    spinner.start();
  }
});
