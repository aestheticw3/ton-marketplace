import "@stdlib/deploy";
import "@stdlib/ownable";
import "./marketplace_profile.tact";
import "./marketplace_ad.tact";
import "./marketplace_local.tact";
import "./messages.tact";

contract MarketplaceMaster with Deployable, OwnableTransferable {
    owner: Address;
    init(){
        self.owner = sender();
    }

    receive("Mint"){
        let profile_init: StateInit = initOf MarketplaceProfile(myAddress(), sender());
        send(SendParameters{
                to: contractAddress(profile_init),
                value: ton("0.02"),
                bounce: false,
                code: profile_init.code,
                data: profile_init.data
            }
        );
    }

    get fun marketplace_profile(owner: Address): Address {
        let profile_init: StateInit = initOf MarketplaceProfile(myAddress(), owner);
        return contractAddress(profile_init);
    }
}