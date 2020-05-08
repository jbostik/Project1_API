import * as sut from '../repos/user_repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { User } from '../models/user';
import { Role } from '../models/role';
// import { UserRepoInstance } from '../config/app';


/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    };
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    };
});

describe('userRepo', () => {

    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                username: 'aanderson',
                                password: 'password',
                                first_name: 'Alice',
                                last_name: 'Anderson',
                                email: 'aanderson@revature.com',
                                role_id: 1
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Users when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }; }), 
                release: jest.fn()
            };
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a User object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);

    });

    test('Should resolve to a User object when getUserByUniqueKey retrieves a record given a valid unique key.', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.getUserByUniqueKey('username', 'un');

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to a User object when getUserByCredentials retrieves a record given a valid username and password.', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.getUserByCredentials('un', 'pw');

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to a User object when save retrieves a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(6, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.save(mockUser);

        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);
    });

    test('Should resolve to true when deleteById deletes a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });

    test('Should resolve to true when update updates a valid user object', async () => {
        expect.hasAssertions();
        
        let mockUser = new User(1, 'un', 'pw', 'fn', 'ln', 'email', new Role(4));
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        let result = await sut.update(mockUser);

        expect(result).toBeTruthy();
    });

});

