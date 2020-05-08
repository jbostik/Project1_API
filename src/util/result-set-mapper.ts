/**
 * Basic methods for creating User, Order, and Item objects.
 */

import { UserSchema, OrderSchema, ItemSchema } from './schemas';
import { User } from '../models/user';
import { Order } from '../models/order';
import { Item } from '../models/item';

export function mapUserResultSet(resultSet: UserSchema): User {
    
    if (!resultSet) {
        return {} as User;
    }

    return new User(
        resultSet.id,
        resultSet.username,
        resultSet.password,
        resultSet.first_name,
        resultSet.last_name,
        resultSet.email,
        resultSet.role_name
    );
}

export function mapOrderResultSet(resultSet: OrderSchema): Order {
    
    if (!resultSet) {
        return {} as Order;
    }

    return new Order(
        resultSet.id,
        resultSet.customerId,
        resultSet.status,
        resultSet.location,
        resultSet.destination
    );
}

export function mapItemResultSet(resultSet: ItemSchema): Item {
    
    if (!resultSet) {
        return {} as Item;
    }

    return new Item(
        resultSet.id,
        resultSet.name,
        resultSet.description,
        resultSet.cost,
        resultSet.amount
    );
}
