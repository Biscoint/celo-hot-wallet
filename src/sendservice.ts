import { Logger } from 'nax-common/utils';
import Web3 from 'web3';
import { newKitFromWeb3 } from '@celo/contractkit';
import config from 'config';

const log = Logger('SendService');

class SendService {

  constructor() {
  }

  async start() {
    const web3WsProvider = new Web3.providers.WebsocketProvider(config.get('websocket'), {
      timeout: 30000,
      reconnect: {
        auto: true,
        delay: 5000,
        maxAttempts: 5,
        onTimeout: false,
      },
    });

    const web3Instance = new Web3(web3WsProvider);

    // @ts-ignore
    const kit = newKitFromWeb3(web3Instance);

    log.info(`Current block: ${await web3Instance.eth.getBlockNumber()}`)
    log.debug('SEND SERVICE STARTED');
  }

  async stop() {
    log.debug('SEND SERVICE STOPPED');
  }
}

export { SendService };
