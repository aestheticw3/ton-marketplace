import { toNano } from 'ton-core';
import { MarketplaceMaster } from '../wrappers/MarketplaceMaster';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const marketplaceMaster = provider.open(await MarketplaceMaster.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await marketplaceMaster.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(marketplaceMaster.address);

    console.log('ID', await marketplaceMaster.getId());
}
