import config from 'config';
import death from 'death';
import * as _ from 'lodash';
import { NaxCommon } from 'nax-common';
import { Logger, BN } from 'nax-common/utils';

import { SendService } from './sendservice';

NaxCommon.setOptions({
  log: config.get('log'),
});

const log = Logger('main', null, 2);

// -------------------------------------------------------------------
// Send Service
// -------------------------------------------------------------------

let sendService: SendService;

async function startSendService() {
  log.info('Starting SendService...');
  sendService = new SendService();
  await sendService.start();
}

async function stopSendService() {
  log.info('Stopping SendService...');
  await (sendService ? sendService.stop() : Promise.resolve());
}


// -------------------------------------------------------------------
// Main
// -------------------------------------------------------------------

async function startServices() {
  await startSendService();
}

async function stopServices() {
  await stopSendService();
}

async function main() {
  log.info('Starting celo-hot-wallet-...');

  try {
    await startServices();
  } catch (error) {
    log.error(error.message);
    log.error('%o', error);
    exit();
  }
}

// *******************************************************************
//  Clean up and exit
// *******************************************************************

async function cleanUp() {
  log.info('Cleaning up...');
  try {
    await stopServices();
  } catch (error) {
    log.warn(`Error cleaning up: ${error.message}`);
    log.error(error.stack);
  }
}

function exit(signal: 'SIGINT' | 'SIGTERM' | 'SIGQUIT' | null = null) {
  if (_.isFunction(process.stdout.cursorTo)) {
    process.stdout.cursorTo(0);
  }
  log.info(signal ? `Exiting (${signal})...` : 'Exiting...');
  cleanUp().then(() => {
    log.info('Bye!');
    process.exit(0);
  });
}

let isDead = false;

death((signal) => {
  if (isDead) {
    return;
  }
  isDead = true;
  exit(signal);
});

main();
