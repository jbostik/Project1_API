import { User } from '../models/user';
import { Role } from '../models/role';

let id: number = 1;

export default [
    new User(id++, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com',  new Role('Admin')),
    new User(id++, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com',  new Role('User')),
    new User(id++, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com',  new Role('User')),
    new User(id++, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', new Role('User')),
    new User(id++, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', new Role('User'))
];