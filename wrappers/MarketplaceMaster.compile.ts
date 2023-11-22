import { CompilerConfig } from '@ton-community/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/marketplace_master.tact',
    options: {
        debug: true,
        experimental: {
            inline: true,
        },
    },
};
