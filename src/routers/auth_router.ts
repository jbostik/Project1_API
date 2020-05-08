import express from 'express';
// import { UserServiceInstance } from '../config/app';
import { Principal } from '../dtos/principal';
import * as userService from '../services/user_service';

export const AuthRouter = express.Router();

// const userInstance = new UserServiceInstance;
// const userService = UserInstance.getInstance();

AuthRouter.get('', (req, resp) => {
    delete req.session.principal;
    resp.status(204).send();
});

AuthRouter.post('', async (req, resp) => {

    try {

        const { username, password } = req.body;
        let authUser = await userService.authenticateUser(username, password);
        let payload = new Principal(authUser.id, authUser.username, authUser.role);
        req.session.principal = payload;
        resp.status(200).json(payload);
        
    } catch (e) {
        resp.status(e.statusCode || 500).json(e);
    }

    resp.send();

});
