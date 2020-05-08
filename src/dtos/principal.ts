import { Role } from '../models/role';

export class Principal {

    id: number;
    username: string;
    role: Role;

    constructor(id: number, un: string, role: Role) {
        this.id = id;
        this.username = un;
        this.role = role;
    }
    
}