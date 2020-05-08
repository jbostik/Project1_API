import { User } from '../models/user';
import {
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapUserResultSet } from '../util/result-set-mapper';


let baseQuery = `
    select
        au.id, 
        au.username, 
        au.password, 
        au.first_name,
        au.last_name,
        au.email,
        ur.name as role_name
    from app_users au
    join user_roles ur
    on au.role_id = ur.id
`;

/*
    Gets everything in the User Database
*/

export async function getAll(): Promise<User[]> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapUserResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets all users assigned to the specified serial ID
*/

export async function getById(id: number): Promise<User> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where au.id = $1`;
        let rs = await client.query(sql, [id]);
        return mapUserResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Gets a user by a specified unique key given its data type value
*/

export async function getUserByUniqueKey(key: string, val: string): Promise<User> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where au.${key} = $1`;
        let rs = await client.query(sql, [val]);
        return mapUserResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }    
}


/*
    Gets a user given username and password
*/

export async function getUserByCredentials(un: string, pw: string): Promise<User> {
    
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${baseQuery} where au.username = $1 and au.password = $2`;
        let rs = await client.query(sql, [un, pw]);
        return mapUserResultSet(rs.rows[0]);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Assigns a new User to the database with a new unique serial ID
*/

export async function save(newUser: User): Promise<User> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();

        let sql = `
            insert into app_users (username, password, first_name, last_name, email, role_id) 
            values ($1, $2, $3, $4, $5, $6) returning id
        `;

        let rs = await client.query(sql, [newUser.username, newUser.password, newUser.firstName, newUser.lastName, newUser.email, newUser.role.id]);
        
        newUser.id = rs.rows[0].id;
        
        return newUser;

    } catch (e) {
        console.log(e);
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*
    Updates a user in the database given a new user object.
*/

export async function update(updatedUser: User): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();

        let sql = `
            update app_users
            set username = $2, password = $3, first_name = $4, last_name = $5, email = $6, role_id = $7
            where app_users.id = $1;
        `;
        console.log(updatedUser);
        await client.query(sql, [updatedUser.id, updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.role.id]);

        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}

/*  
    Deletes a User given its unique serial Id
*/
export async function deleteById(id: number): Promise<boolean> {
    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `
            delete from app_users where id = $1
        `;
        await client.query(sql, [id]);
        return true;
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }
}


