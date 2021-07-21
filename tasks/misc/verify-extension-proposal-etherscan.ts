import { task } from 'hardhat/config';
import {
  AaveProtocolDataProvider__factory,
  IERC20Detailed__factory,
  ILendingPool,
  ILendingPoolAddressesProvider__factory,
  ILendingPoolData__factory,
} from '../../types';
import { verifyContract } from '../../helpers/etherscan-verification';

const {
  POOL_PROVIDER = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
  TREASURY = '0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c',
} = process.env;

if (!POOL_PROVIDER || !TREASURY) {
  throw new Error('You have not set correctly the .env file, make sure to read the README.md');
}

const AAVE_LENDING_POOL = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9';
const INCENTIVES_PROXY = '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5';

task('verify-extension-proposal-etherscan', 'Verify proposals')
  .addParam('proposalPayloadAddress')
  .setAction(async ({ proposalPayloadAddress }, localBRE) => {
    await localBRE.run('set-DRE');
    const [deployer] = await localBRE.ethers.getSigners();

    console.log('==== Etherscan verification ====');
    console.log('- Verify proposal payload');
    await verifyContract(proposalPayloadAddress, []);
    console.log('- Verify aTokens');
  });