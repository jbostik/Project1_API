import { Order } from '../models/order';

let id: number = 1;

export default [
    new Order(id++, 1, true, 'Seattle, Washington', 'New York City, New York'),
    new Order(id++, 2, true, 'Seattle, Washington', 'New York City, New York')
];