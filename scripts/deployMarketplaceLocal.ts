import { toNano } from 'ton-core';
import { MarketplaceLocal } from '../wrappers/MarketplaceLocal';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const marketplaceLocal = provider.open(await MarketplaceLocal.fromInit());

    await marketplaceLocal.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(marketplaceLocal.address);

    // run methods on `marketplaceLocal`
}
