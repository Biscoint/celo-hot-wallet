import { Logger } from 'nax-common/utils';
import Web3 from 'web3';
import { newKitFromWeb3, newKit } from '@celo/contractkit';
import * as bip32 from 'bip32';
import * as bip39 from 'bip39';
import config from 'config';
import { StableTokenWrapper } from '@celo/contractkit/lib/wrappers/StableTokenWrapper';
import express, { RequestHandler } from 'express';

const log = Logger('SendService');

class SendService {
  cUSD?: StableTokenWrapper;
  seed: string;
  app: express.Application;
  account: any;

  constructor() {
    this.seed = config.get('seed');

    this.app = express();

    this.app.use(express.json());

    this.app.post('/send-tx', this.send);
  }

  async start() {
    const web3Instance = new Web3(config.get('provider'));

    // @ts-ignore
    const kit = newKitFromWeb3(web3Instance);

    log.info(`Current block: ${await web3Instance.eth.getBlockNumber()}`);

    this.cUSD = await kit.contracts.getStableToken();

    const derivedSeed = bip32.fromSeed(bip39.mnemonicToSeedSync(this.seed));

    const { privateKey } = derivedSeed.derivePath(`m/44'/52752'/0'/0/1`);

    if (privateKey)
      this.account = web3Instance.eth.accounts.privateKeyToAccount(
        privateKey.toString('hex')
      );

    kit.addAccount(this.account.privateKey);

    this.app.listen(3000);

    log.debug('SEND SERVICE STARTED');
  }

  send: RequestHandler = async (req, res) => {
    const { address, amount } = req.body;

    if (this.cUSD) {
      // @ts-ignore
      const tx = await this.cUSD.transfer(address, amount).send({
        from: this.account.address,
      });

      res.send(await tx.waitReceipt());

      log.info(
        `Sent TX! Current balance ${(
          await this.cUSD.balanceOf(this.account.address)
        ).toString()}`
      );
    }
  };

  async stop() {
    log.debug('SEND SERVICE STOPPED');
  }
}

export { SendService };
