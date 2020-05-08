/**
 * Information to be stored in the order object:
 *      - orderID
 *      - orderContents
 *      - orderCost
 *      - orderStatus (open (true)/closed (false))
 *      - orderLoc ('delivered' if delivered, 'assembling' if items are in multiple loc's)
 */


export class Order {
    
    id: number;
    customerId: number;
    status: boolean;
    location: string;
    destination: string;

    constructor(ID: number, customerId: number, status: boolean, location: string, destination: string) {
        this.id = ID;
        this.customerId = customerId;
        this.status = status;
        this.location = location;
        this.destination = destination;
    }
}