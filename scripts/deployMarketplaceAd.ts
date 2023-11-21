import { toNano } from 'ton-core';
import { MarketplaceAd } from '../wrappers/MarketplaceAd';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const marketplaceAd = provider.open(await MarketplaceAd.fromInit());

    await marketplaceAd.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(marketplaceAd.address);

    // run methods on `marketplaceAd`
}
