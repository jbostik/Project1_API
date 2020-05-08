/**
 * The purpose of order_service ensures that all properties passed to order_repo are valid.
 */

import { User } from '../models/user';
import * as userRepo from '../repos/user_repo';
import { isValidId, isValidStrings, isValidObject, isPropertyOf, isEmptyObject } from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from '../errors/errors';
import { Role } from '../models/role';


/**
 * Retrieves all Users from the userRepo and returns them
 * if they exist.
 */
export async function getAllUsers(): Promise<User[]> {


    let users = await userRepo.getAll();

    if (users.length == 0) {
        throw new ResourceNotFoundError();
    }

    return users.map(removePassword);


}

/**
 * Gets a user by its serial ID value
 */
export async function getUserById(id: number): Promise<User> {



    if (!isValidId(id)) {
        throw new BadRequestError();
    }

    let user = await userRepo.getById(id);

    if (isEmptyObject(user)) {
        throw new ResourceNotFoundError();
    }

    return removePassword(user);


}

/**
 * Retrieves a user from the database given a unique user key
 * (e.g. username, email)
 */
export async function getUserByUniqueKey(queryObj: any): Promise<User> {

    try {

        let queryKeys = Object.keys(queryObj);

        if(!queryKeys.every(key => isPropertyOf(key, User))) {
            throw new BadRequestError();
        }

        // we will only support single param searches (for now)
        let key = queryKeys[0];
        let val = queryObj[key];

        // if they are searching for a user by id, reuse the logic we already have
        if (key === 'id') {
            return await this.getUserById(+val);
        }

        // ensure that the provided key value is valid
        if(!isValidStrings(val)) {
            throw new BadRequestError();
        }

        let user = await userRepo.getUserByUniqueKey(key, val);

        if (isEmptyObject(user)) {
            throw new ResourceNotFoundError();
        }

        return removePassword(user);

    } catch (e) {
        throw e;
    }

}

/**
 * Inputs a username and password to return a user object.
 */
export async function getUserByCredentials(un: string, pw: string): Promise<User> {
    

    try {
        const user = {...await userRepo.getUserByCredentials(un, pw)};
        return removePassword(user);  
    } catch (e) {
        return e;
    }

}

/**
 * Authenticates a user given a username and password. Returns
 * the authenticated user.
 */
export async function authenticateUser(un: string, pw: string): Promise<User> {


    try {

        if (!isValidStrings(un, pw)) {
            throw new BadRequestError();
        }

        let authUser: User;
        
        authUser = await userRepo.getUserByCredentials(un, pw);

        if (isEmptyObject(authUser)) {
            throw new AuthenticationError('Bad credentials provided.');
        }

        return removePassword(authUser);

    } catch (e) {
        throw e;
    }


}

/**
 * Adds a new user to the database
 */
export async function addNewUser(newUser: User): Promise<User> {
    

    try {

        if (!isValidObject(newUser, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        let usernameAvailable = await isUsernameAvailable(newUser.username);

        if (!usernameAvailable) {
            throw new ResourcePersistenceError('The provided username is already taken.');
        }
    
        let emailAvailable = await isEmailAvailable(newUser.email);

        if (!emailAvailable) {
            throw new  ResourcePersistenceError('The provided email is already taken.');
        }

        newUser.role = new Role('User'); // all new registers have 'User' role by default
        const persistedUser = await userRepo.save(newUser);

        return removePassword(persistedUser);

    } catch (e) {
        throw e;
    }
}

/**
 * Updates a user at the specified index given a new user object and a
 * specified index.
 */
export async function updateUser(id: number, updatedUser: User): Promise<boolean> {

    try {

        if (!isValidObject(updatedUser, 'id')) {
            throw new BadRequestError('Invalid property values found in provided user.');
        }

        let usernameAvailable = await isUsernameAvailable(updatedUser.username, id);

        if (!usernameAvailable) {
            throw new ResourcePersistenceError('The provided username is already taken.');
        }

        let emailAvailable = await isEmailAvailable(updatedUser.email, id);

        if (!emailAvailable) {
            throw new  ResourcePersistenceError('The provided email is already taken.');
        }

        // let repo handle some of the other checking since we are still mocking db
        
        updatedUser.id = id;
        updatedUser.role = new Role('User'); // all new registers have 'User' role by default
        
        return await userRepo.update(updatedUser);

    } catch (e) {
        throw e;
    }

}

/**
 * Deletes a user with the specified serial ID
 */
export async function deleteById(id: number): Promise<boolean> {
    
    try {

        if(!isValidId(id)) {
            throw new BadRequestError();
        }

        return await userRepo.deleteById(id);
    } catch (e) {
        throw e;
    }
}

/**
 * Returns a boolean value based on whether or not a username is available in the database.
 * An id parameter is passed optionally to ignore a specified serial number.
 * Exported for testing purposes
 */
export async function isUsernameAvailable(username: string, id?: number): Promise<boolean> {

    try {
        if (await (await getUserByUniqueKey({'username': username})).id == id) {
            return true;
        }
    } catch (e) {
        console.log('username is available');
        return true;
    }

    console.log('username is unavailable');
    return false;

}

/**
 * Returns a boolean value based on whether or not an email is available in the database.
 * An id parameter is passed optionally to ignore a specified serial number.
 * Exported for testing purposes
 */
export async function isEmailAvailable(email: string, id?: number): Promise<boolean> {
    
    try {
        if (await (await getUserByUniqueKey({'email': email})).id == id) {
            console.log('email at id');
            return true;
        }
    } catch (e) {
        console.log('email is available');
        return true;
    }

    console.log('email is unavailable');
    return false;
}

/**
 * Inputs a user and returns the user without its password.
 */
function removePassword(user: User): User {
    if(!user || !user.password) return user;
    let usr = {...user};
    delete usr.password;
    return usr;   
}
