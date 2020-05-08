import { Role } from '../models/role';

export interface UserSchema {
    id: number,
    username: string,
    password: string,
    first_name: string,
    last_name: string,
    email: string,
    role_name: Role
}

export interface OrderSchema {
    id: number,
    customerId: number,
    status: boolean,
    location: string,
    destination: string
}

export interface ItemSchema {
    id: number,
    name: string,
    description: string,
    cost: number,
    amount: number
}