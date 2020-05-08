import url from 'url';
import express from 'express';
// import {UserServiceInstance} from '../config/app';
import { isEmptyObject } from '../util/validator';
import { adminGuard } from '../middleware/auth_middleware';
import * as userService from '../services/user_service';
import * as orderService from '../services/order_service';

export const UserRouter = express.Router();

// const userInstance = new UserServiceInstance;
// const userService = userInstance.getInstance();

UserRouter.get('', adminGuard, async (req, resp) => {
    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

UserRouter.get('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

UserRouter.get('/:id/orders', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await orderService.getOrdersByUserId(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});


UserRouter.post('', async (req, resp) => {

    console.log('USER POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

UserRouter.delete('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('USER DELETE REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let status = await userService.deleteById(id);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

UserRouter.patch('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('USER UPDATE REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let status = await userService.updateUser(id, req.body);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});