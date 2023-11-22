import "@stdlib/deploy";
import "@stdlib/ownable";
import "./marketplace_local.tact";
import "./messages.tact";

contract MarketplaceProfile with Deployable, Ownable {
    idx: Int = 0;
    max: Int as uint8 = 10;
    ads: map<Int, Address>;
    master: Address;
    owner: Address;
    init(master: Address, owner: Address){
        self.master = master;
        self.owner = owner;
    }

    receive(msg: AdInfo){
        self.requireOwner();
        let local_init: StateInit = initOf MarketplaceLocal(msg.location, self.master);
        self.ads.set(self.idx, contractAddress(local_init));
        self.idx = (self.idx + 1);
        send(SendParameters{
                to: contractAddress(local_init),
                value: ton("0.02"),
                body: AdInfo{
                    name: msg.name,
                    description: msg.description,
                    location: msg.location,
                    cost: msg.cost,
                    owner: self.owner
                }.toCell(),
                data: local_init.data,
                code: local_init.code
            }
        );
    }

    receive("Delete profile"){
        self.requireOwner();
        send(SendParameters{
                to: self.owner,
                value: 0,
                bounce: false,
                mode: ((SendIgnoreErrors + SendRemainingBalance) + SendDestroyIfZero)
            }
        );
    }

    get fun ads(): map<Int, Address> {
        return self.ads;
    }
}