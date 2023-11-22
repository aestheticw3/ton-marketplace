import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import '@ton-community/test-utils';
import { Address, toNano } from 'ton-core';
import { MarketplaceMaster } from '../wrappers/MarketplaceMaster';
import { MarketplaceProfile } from '../wrappers/MarketplaceProfile';

describe('MarketplaceMaster', () => {
    let blockchain: Blockchain;
    let marketplaceMaster: SandboxContract<MarketplaceMaster>;
    let deployer: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        marketplaceMaster = blockchain.openContract(await MarketplaceMaster.fromInit());
        deployer = await blockchain.treasury('deployer');
        await marketplaceMaster.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
    });

    it('should mint profile', async () => {
        await marketplaceMaster.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            'Mint'
        );

        const deployerProfileAddress: Address = await marketplaceMaster.getMarketplaceProfile(deployer.address);
        const profileContract = MarketplaceProfile.fromAddress(deployerProfileAddress);
        const deployerProfile: SandboxContract<MarketplaceProfile> = blockchain.openContract(profileContract);

        expect((await deployerProfile.getOwner()).toString()).toBe(deployer.address.toString());
    });

    it('should delete profile', async () => {
        await marketplaceMaster.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            'Mint'
        );

        const deployerProfileAddress: Address = await marketplaceMaster.getMarketplaceProfile(deployer.address);
        const profileContract = MarketplaceProfile.fromAddress(deployerProfileAddress);
        const deployerProfile: SandboxContract<MarketplaceProfile> = blockchain.openContract(profileContract);

        expect((await deployerProfile.getOwner()).toString()).toBe(deployer.address.toString());

        await deployerProfile.send(deployer.getSender(), { value: toNano('1') }, 'Delete profile');

        expect(deployerProfile.getOwner()).rejects.toThrow();
    });
});
