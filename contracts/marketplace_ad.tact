import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages.tact";

contract MarketplaceAd with Deployable, Ownable {
    name: String = "";
    description: String = "";
    cost: Int as coins = 0;
    location: String = "";
    master: Address;
    owner: Address;
    idx: Int;
    init(master: Address, location: String, idx: Int){
        self.master = master;
        self.owner = sender();
        self.location = location;
        self.idx = idx;
    }

    receive(msg: AdInfo){
        self.requireOwner();
        self.name = msg.name;
        self.description = msg.description;
        self.cost = msg.cost;
        self.owner = msg.owner;
    }

    get fun info(): AdInfo {
        return
            AdInfo{
                name: self.name,
                description: self.description,
                location: self.location,
                cost: self.cost,
                owner: self.owner
            };
    }
}