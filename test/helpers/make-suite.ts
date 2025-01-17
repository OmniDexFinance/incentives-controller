import { evmRevert, evmSnapshot, DRE } from '../../helpers/misc-utils';
import { Signer } from 'ethers';
import { getEthersSigners } from '../../helpers/contracts-helpers';
import { tEthereumAddress } from '../../helpers/types';

import chai from 'chai';
// @ts-ignore
import bignumberChai from 'chai-bignumber';
import { getOTokenMock } from '../../helpers/contracts-accessors';
import { MintableErc20 } from '../../types/MintableErc20';
import { OTokenMock } from '../../types/OTokenMock';
import {
  PullRewardsIncentivesController,
  PullRewardsIncentivesController__factory,
  StakedAaveV3,
  StakedTokenIncentivesController,
} from '../../types';

chai.use(bignumberChai());

export let stakedAaveInitializeTimestamp = 0;
export const setStakedAaveInitializeTimestamp = (timestamp: number) => {
  stakedAaveInitializeTimestamp = timestamp;
};

export interface SignerWithAddress {
  signer: Signer;
  address: tEthereumAddress;
}
export interface TestEnv {
  rewardsVault: SignerWithAddress;
  deployer: SignerWithAddress;
  users: SignerWithAddress[];
  aaveToken: MintableErc20;
  aaveIncentivesController: StakedTokenIncentivesController;
  pullRewardsIncentivesController: PullRewardsIncentivesController;
  stakedAave: StakedAaveV3;
  aDaiMock: OTokenMock;
  aWethMock: OTokenMock;
  aDaiBaseMock: OTokenMock;
  aWethBaseMock: OTokenMock;
}

let buidlerevmSnapshotId: string = '0x1';
const setBuidlerevmSnapshotId = (id: string) => {
  if (DRE.network.name === 'hardhat') {
    buidlerevmSnapshotId = id;
  }
};

const testEnv: TestEnv = {
  deployer: {} as SignerWithAddress,
  users: [] as SignerWithAddress[],
  aaveToken: {} as MintableErc20,
  stakedAave: {} as StakedAaveV3,
  aaveIncentivesController: {} as StakedTokenIncentivesController,
  pullRewardsIncentivesController: {} as PullRewardsIncentivesController,
  aDaiMock: {} as OTokenMock,
  aWethMock: {} as OTokenMock,
  aDaiBaseMock: {} as OTokenMock,
  aWethBaseMock: {} as OTokenMock,
} as TestEnv;

export async function initializeMakeSuite(
  aaveToken: MintableErc20,
  stakedAave: StakedAaveV3,
  aaveIncentivesController: StakedTokenIncentivesController,
  pullRewardsIncentivesController: PullRewardsIncentivesController
) {
  const [_deployer, _proxyAdmin, ...restSigners] = await getEthersSigners();
  const deployer: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  const rewardsVault: SignerWithAddress = {
    address: await _deployer.getAddress(),
    signer: _deployer,
  };

  for (const signer of restSigners) {
    testEnv.users.push({
      signer,
      address: await signer.getAddress(),
    });
  }
  testEnv.deployer = deployer;
  testEnv.rewardsVault = rewardsVault;
  testEnv.stakedAave = stakedAave;
  testEnv.aaveIncentivesController = aaveIncentivesController;
  testEnv.pullRewardsIncentivesController = pullRewardsIncentivesController;
  testEnv.aaveToken = aaveToken;
  testEnv.aDaiMock = await getOTokenMock({ slug: 'aDai' });
  testEnv.aWethMock = await getOTokenMock({ slug: 'aWeth' });
  testEnv.aDaiBaseMock = await getOTokenMock({ slug: 'aDaiBase' });
  testEnv.aWethBaseMock = await getOTokenMock({ slug: 'aWethBase' });
}

export function makeSuite(name: string, tests: (testEnv: TestEnv) => void) {
  describe(name, () => {
    before(async () => {
      setBuidlerevmSnapshotId(await evmSnapshot());
    });
    tests(testEnv);
    after(async () => {
      await evmRevert(buidlerevmSnapshotId);
    });
  });
}
