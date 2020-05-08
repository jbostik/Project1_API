/** 
 * Information to be stored in the item object:
 *      - itemID
 *      - itemName
 *      - itemDescription
 *      - itemCost
 *      - itemLoc
 *      - itemStatus (available (0) -or- orderID)
 *      - amount
 */

//maybe have a stock associated to the item, and when a new item is ordered,
//create a new item with stock 1 linked to the order, and remove 1 stock 
//from the item database, if there are no items left, remove the item from 
//the database.

export class Item {
    
    id: number;
    name: string;
    description: string;
    cost: number;
    amount: number;

    constructor(ID: number, itemName: string, description: string, cost: number, amount: number) {
        this.id = ID;
        this.name = itemName;
        this.description = description;
        this.cost = cost;
        this.amount = amount;
    }
}