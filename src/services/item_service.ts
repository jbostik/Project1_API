/**
 * The purpose of item_service ensures that all properties passed to item_repo are valid.
 */

import { Item } from '../models/item';
import * as itemRepo from '../repos/item_repo';
import { isValidId, isValidObject, isEmptyObject } from '../util/validator';
import { BadRequestError, 
    ResourceNotFoundError 
} from '../errors/errors';


/**
 * Retrieves all items from the itemRepo and returns them
 * if they exist.
 */
export async function getAllItems(): Promise<Item[]> {

    let items = await itemRepo.getAll();

    if (items.length == 0) {
        throw new ResourceNotFoundError();
    }

    return items;

}

/**
 * Gets an item by its serial ID value
 */
export async function getItemById(id: number): Promise<Item> {

    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let item = await itemRepo.getById(id);

    if (isEmptyObject(item)) {
        throw new ResourceNotFoundError();
    }

    return item;

}


//Note to self: Maybe add some sort of equivalent for:
// getUserByUniqueKey(queryObj: any): Promise<User> {}
// getUserByCredentials(un: string, pw: string): Promise<User> {}
// authenticateUser(un: string, pw: string): Promise<User> {}

/**
 * Adds a new item to the database
 */
export async function addNewItem(newItem: Item, orderId: number): Promise<Item> {
    
    //May want to check if a order is found by the specified id

    if (!isValidObject(newItem, 'id')) {
        throw new BadRequestError('Invalid property values found in provided user.');
    }

    //Note to self: consider re-using items: if you do... 
    //check to see if the item exists in the database before 
    //adding new ones.

    const persistedItem = await itemRepo.save(newItem, orderId);

    return persistedItem;

}

/**
 * Updates an item at the specified index given a new item object and a
 * specified index.
 */
export async function updateItem(id: number, updatedItem: Item): Promise<boolean> {
    
    if (!isValidObject(updatedItem)) {
        throw new BadRequestError('Invalid item provided (invalid values found).');
    }

    // let repo handle some of the other checking since we are still mocking db
    updatedItem.id = id;
    
    return await itemRepo.update(updatedItem);

}

/**
 * Deletes an item given its serial ID
 */
export async function deleteById(id: number): Promise<boolean> {
    
    if(!isValidId(id)) {
        throw new BadRequestError();
    }

    return await itemRepo.deleteById(id);

}


