/**
 * The purpose of order_service ensures that all properties passed to order_repo are valid.
 */

import { Order } from '../models/order';
import * as orderRepo  from '../repos/order_repo';
import { isValidId, 
    isValidObject, 
    isEmptyObject 
} from '../util/validator';
import { BadRequestError, 
    ResourceNotFoundError
} from '../errors/errors';
import { Item } from '../models/item';


/**
 * Retrieves all orders from the orderRepo and returns them
 * if they exist.
 */
export async function getAllOrders(): Promise<Order[]> {



    let orders = await orderRepo.getAll();

    if (orders.length == 0) {
        throw new ResourceNotFoundError();
    }

    return orders;

}

/**
 * Gets an order by its serial ID value
 */
export async function getOrderById(id: number): Promise<Order> {

    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let order = await orderRepo.getById(id);

    if (isEmptyObject(order)) {
        throw new ResourceNotFoundError();
    }

    return order;

}

export async function getOrdersByUserId(id: number): Promise<Order[]> {

    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let orders = await orderRepo.getOrdersByUserId(id);

    if (isEmptyObject(orders)) {
        throw new ResourceNotFoundError();
    }

    return orders;

}

export async function getItemsByOrderId(id: number): Promise<Item[]> {
    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let items = await orderRepo.getItemsByOrderId(id);

    if (isEmptyObject(items)) {
        throw new ResourceNotFoundError();
    }

    return items;
}

//Maybe add equivalent methods for :
// getUserByCredentials(un: string, pw: string): Promise<User> {}
// authenticateUser(un: string, pw: string): Promise<User> {}


/**
 * Adds a new order to the database
 */
export async function addNewOrder(newOrder: Order): Promise<Order> {
    
    if (!isValidObject(newOrder, 'id')) {
        throw new BadRequestError('Invalid property values found in provided user.');
    }

    const persistedOrder = await orderRepo.save(newOrder);

    return persistedOrder;

}

/**
 * Updates an order at the specified index given a new order object and a
 * specified index.
 */
export async function updateOrder(id: number, updatedOrder: Order): Promise<boolean> {
    


    if (!isValidObject(updatedOrder)) {
        throw new BadRequestError('Invalid order provided (invalid values found).');
    }

    // let repo handle some of the other checking since we are still mocking db
    updatedOrder.id = id;

    return await orderRepo.update(updatedOrder);

}

/**
 * Deletes an item given its serial ID
 */
export async function deleteById(id: number): Promise<boolean> {
    
    if(!isValidId(id)) {
        throw new BadRequestError();
    }

    return await orderRepo.deleteById(id);

}


