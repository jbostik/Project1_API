import express from 'express';
// import {OrderServiceInstance} from '../config/app';
import { adminGuard } from '../middleware/auth_middleware';
import * as orderService from '../services/order_service';

export const OrderRouter = express.Router();

// const orderInstance = new OrderServiceInstance;
// const orderService = orderInstance.getInstance();

OrderRouter.get('', adminGuard, async (req, resp) => {
    try {
        
        let payload = await orderService.getAllOrders();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

OrderRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await orderService.getOrderById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

OrderRouter.get('/:id/items', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await orderService.getItemsByOrderId(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

/**
 * Implement add order
 */
OrderRouter.post('', async (req, resp) => {

    console.log('ORDER POST REQUEST RECEIVED AT /orders');
    console.log(req.body);
    try {
        let newUser = await orderService.addNewOrder(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});


OrderRouter.delete('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('ORDER DELETE REQUEST RECEIVED AT /orders');
    console.log(req.body);
    try {
        let status = await orderService.deleteById(id);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

OrderRouter.patch('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('ORDER UPDATE REQUEST RECEIVED AT /orders');
    console.log(req.body);
    try {
        let status = await orderService.updateOrder(id, req.body);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});