import express from 'express';
// import { ItemServiceInstance } from '../config/app';
import { adminGuard } from '../middleware/auth_middleware';
import * as itemService from '../services/item_service';

export const ItemRouter = express.Router();

// const itemInstance = new ItemServiceInstance;
// const itemService = itemInstance.getInstance();

ItemRouter.get('', adminGuard, async (req, resp) => {
    try {
        
        let payload = await itemService.getAllItems();
        return resp.status(200).json(payload);

    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

ItemRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await itemService.getItemById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

/**
 * Implement add item 
 */
ItemRouter.post('/:id', async (req, resp) => {

    const id = +req.params.id;
    console.log('Item POST REQUEST RECEIVED AT /items');
    console.log(req.body);
    try {
        let newItem = await itemService.addNewItem(req.body, id);
        return resp.status(201).json(newItem).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

ItemRouter.delete('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('ITEM DELETE REQUEST RECEIVED AT /items');
    console.log(req.body);
    try {
        let status = await itemService.deleteById(id);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});

ItemRouter.patch('/:id', async (req, resp) => {
    const id = +req.params.id;

    console.log('ITEM UPDATE REQUEST RECEIVED AT /items');
    console.log(req.body);
    try {
        let status = await itemService.updateItem(id, req.body);
        return resp.status(204).json(status).send();
    } catch (e) {
        return resp.status(e.statusCode).json(e).send();
    }
});