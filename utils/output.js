const boxen = require('boxen');
const logUpdate = require('log-update');
const chalk = require('chalk');

// Define options for Boxen
const options = {
  padding: 1,
  margin: 1,
  borderStyle: 'round',
};

const showOutput = (aaja) => {
  const { npDate, tithi, events, time, enDate } = aaja;

  // Text + chalk definitions
  const data = {
    name: chalk.white('               aaja - cli tool to '),
    npDate: chalk.cyan(npDate),
    tithi: chalk.cyan(tithi),
    events: chalk.cyan(events),
    time: chalk.cyan(time),
    enDate: chalk.cyan(enDate),
    labelNpDate: chalk.white.bold('   Nepali Date(BS):'),
    labelTithi: chalk.white.bold('             Tithi:'),
    labelEvents: chalk.white.bold('            Events:'),
    labelTime: chalk.white.bold('              Time:'),
    labelEnDate: chalk.white.bold('  English Date(AD):'),
  };

  // Actual strings we're going to output
  const newline = '\n';
  const heading = `${data.name}`;
  const strNpDate = `${data.labelNpDate}  ${data.npDate}`;
  const strTithi = `${data.labelTithi}  ${data.tithi}`;
  const strEvents = `${data.labelEvents}  ${data.events}`;
  const strTime = `${data.labelTime}  ${data.time}`;
  const strEnDate = `${data.labelEnDate}  ${data.enDate}`;

  // Put all our output together into a single variable
  const output =
    heading +
    newline +
    newline +
    strNpDate +
    newline +
    strTithi +
    newline +
    strEvents +
    newline +
    strTime +
    newline +
    strEnDate +
    newline;

  logUpdate(chalk.green(boxen(output, options)));
};

module.exports = {
  showOutput,
};
