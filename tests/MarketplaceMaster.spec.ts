import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import '@ton-community/test-utils';
import { toNano } from 'ton-core';
import { MarketplaceMaster } from '../wrappers/MarketplaceMaster';
import { MarketplaceProfile } from '../wrappers/MarketplaceProfile';

describe('MarketplaceMaster', () => {
    let blockchain: Blockchain;
    let marketplaceMaster: SandboxContract<MarketplaceMaster>;
    let marketplaceProfile: SandboxContract<MarketplaceProfile>;
    let deployer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        marketplaceMaster = blockchain.openContract(await MarketplaceMaster.fromInit());
        // marketplaceProfile = blockchain.openContract(await MarketplaceProfile.fromInit());

        deployer = await blockchain.treasury('deployer');

        await marketplaceMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
    });

    it('should deploy profile', async () => {
        await marketplaceMaster.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'MintProfile',
            }
        );

        console.log(await marketplaceMaster.getMarketplaceProfile(deployer.address));
    });
});
