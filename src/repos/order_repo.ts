/** Remember CRUD - create read update delete
 * TODO:
 *      - addToOrder(itemID, orderID) --> 
 *          * calls getItemByID
 *          * adds item to orderContents
 *      
 *      REFACTOR TO USE SQL DATABASE & ASYNC
 *      CREATE ORDERCOST METHOD
 */
import { Order } from '../models/order';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapOrderResultSet, mapItemResultSet } from '../util/result-set-mapper';
import { Item } from '../models/item';

let baseQuery = `
    select
        ao.id, 
        ao.customerid, 
        ao.status, 
        ao.location,
        ao.destination
    from app_orders ao
`;

/*
    Gets everything in the Order database
*/

export async function getAll(): Promise<Order[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapOrderResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets all items by the specified serial Id
*/

export async function getById(id: number): Promise<Order> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where ao.id = $1`;
        let rs = await client.query(sql, [id]);
        return mapOrderResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets all orders assigned to the specified User
*/

export async function getOrdersByUserId(id: number): Promise<Order[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where ao.customerid = $1`;
        let rs = await client.query(sql, [id]);
        return rs.rows.map(mapOrderResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets All Items assigned to the speicified Order
*/

export async function getItemsByOrderId(id: number): Promise<Item[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            select i.id, i.name, i.description, i.cost, i.amount
            from app_items as i left join
                order_item_jc as j
                on j.itemid = i.id left join
                app_orders as o
                on j.orderid = $1
            where o.id = $1;
        `;
        let rs = await client.query(sql, [id]);
        return rs.rows.map(mapItemResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Saves an Order to a new unique serial number
 */

export async function save(newOrder: Order): Promise<Order> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            insert into app_orders (customerid, status, location, destination) 
            values ($1, $2, $3, $4) returning id
        `;
        let rs = await client.query(sql, [newOrder.customerId, newOrder.status, newOrder.location, newOrder.destination]);
        return mapOrderResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}
/*
    Updates an Order based on a new Order object
*/
export async function update(updatedOrder: Order): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            update app_orders
            set customerid = $2, status = $3, location = $4, destination = $5
            where app_orders.id = $1;
        `;
        console.log(updatedOrder.customerId);

        await client.query(sql, [updatedOrder.id, updatedOrder.customerId, updatedOrder.status, updatedOrder.location, updatedOrder.destination]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}


/*
    Deletes an order by its specified serial number
*/
export async function deleteById(id: number): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sqljc = `
            delete from order_item_jc where orderid = $1
        `;
        await client.query(sqljc, [id]);
        let sql = `
            delete from app_orders where id = $1
        `;
        await client.query(sql, [id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

