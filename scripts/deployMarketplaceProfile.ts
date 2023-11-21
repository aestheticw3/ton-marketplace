import { toNano } from 'ton-core';
import { MarketplaceProfile } from '../wrappers/MarketplaceProfile';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const marketplaceProfile = provider.open(await MarketplaceProfile.fromInit());

    await marketplaceProfile.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(marketplaceProfile.address);

    // run methods on `marketplaceProfile`
}
