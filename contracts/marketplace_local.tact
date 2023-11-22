import "@stdlib/deploy";
import "@stdlib/ownable";
import "./marketplace_profile.tact";
import "./marketplace_ad.tact";
import "./messages.tact";


contract MarketplaceLocal with Deployable {
    location: String;
    master: Address;
    idx: Int as uint32 = 0;
    init(location: String, master: Address){
        self.location = location;
        self.master = master;
        dump("MarketplaceLocal has been created");
    }

    receive(msg: AdInfo){
        let profile_init: StateInit = initOf MarketplaceProfile(self.master, msg.owner);
        require(sender() == contractAddress(profile_init), "Profile only.");
        dump("MarketplaceLocal has got a new ad");

        let ad_init: StateInit = initOf MarketplaceAd(self.master, self.location, self.idx);
        send(SendParameters{
                to: contractAddress(ad_init),
                value: ton("0.02"),
                bounce: false,
                body: AdInfo{
                    name: msg.name,
                    description: msg.description,
                    cost: msg.cost,
                    location: msg.location,
                    owner: msg.owner
                }.toCell(),
                data: ad_init.data,
                code: ad_init.code
            }
        );
        dump("MarketplaceLocal has sent deploy ad tx");
        self.idx = (self.idx + 1);
        dump("MarketplaceLocal has added a new ad");
    }

    get fun marketplace_ads(start: Int, end: Int): map<Int, Address> {
        let ads: map<Int, Address> = emptyMap();
        while (start <= end) {
            let ad_init: StateInit = initOf MarketplaceAd(self.master, self.location, start);
            ads.set(start, contractAddress(ad_init));
            start = start + 1;
        }
        dump("The loop is over!");

        return ads;
    }
}