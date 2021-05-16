import dns from 'dns';
import got from 'got';
import cheerio from 'cheerio';
import chalk from 'chalk';
import ora from 'ora';
import logUpdate from 'log-update';
import updateNotifier from 'update-notifier';
import pkg from './package.json';