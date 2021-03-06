import * as sut from '../services/user_service';
import * as mockRepo from '../repos/user_repo';
import * as mockValidator from '../util/validator';

import { User } from '../models/user';
import { ResourceNotFoundError, BadRequestError, AuthenticationError} from '../errors/errors';
import { Role } from '../models/role';

/*
    In order to properly mock all of the functions exported by
    the a module, we will invoke jest.mock() and pass to it: 
        
        - a relative path to the module we wish to mock as string

        - a function which will return the mocked module's exposed 
          functions (which are all mocked as well)

    Interesting fact: jest.mock() is actually executed before any
    import statements.

*/
jest.mock('../repos/user_repo', () => {

    /* 
        It is important to note that the object that is being returned
        exposes properties that are named the exact same as the functions
        exposed by the user-repo module, and all of the properties a Jest
        mock functions.
    */
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
        getUserByUniqueKey: jest.fn(),
        getUserByCredentials: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        deleteById: jest.fn()
    };
});

jest.mock('../util/validator', () => {
    return {
        isValidId: jest.fn(),
        isValidStrings: jest.fn(),
        isValidObject: jest.fn(),
        isPropertyOf: jest.fn(),
        isEmptyObject: jest.fn()
    };
});

describe('userService', () => {

    let mockUsers = [
        new User(1, 'aanderson', 'password', 'Alice', 'Anderson', 'aanderson@revature.com', new Role(1)),
        new User(2, 'bbailey', 'password', 'Bob', 'Bailey', 'bbailey@revature.com', new Role(2)),
        new User(3, 'ccountryman', 'password', 'Charlie', 'Countryman', 'ccountryman@revature.com', new Role(3)),
        new User(4, 'ddavis', 'password', 'Daniel', 'Davis', 'ddavis@revature.com', new Role(4)),
        new User(5, 'eeinstein', 'password', 'Emily', 'Einstein', 'eeinstein@revature.com', new Role(5))
    ];

    beforeEach(() => {
        
        /*
            The mocking logic above makes all of the functions exposed 
            by the user-repo module mock functions. However, TypeScript 
            doesn't know that (because of that interesting fact from 
            earlier) so it will give us compiler errors if we use Mock
            methods (e.g. mockReturnValue, mockImplementation, etc.).

            The way around this is the either cast the operation as type
            jest.Mock, or to include the @ts-ignore directive to tell the
            TypeScript compiler to ignore it.

            Remember that Jest is a JavaScript framework, and it takes
            some configuring and syntactic gymnastics to get TypeScript
            to play nicely with it. 

        */

        // casting the function as jest.Mock -- option 1
        (mockRepo.getAll as jest.Mock).mockClear();

        // @ts-ignore -- option 2 (only ignores the next line of code)
        mockRepo.getById.mockClear();

        (mockRepo.getUserByUniqueKey as jest.Mock).mockClear();
        (mockRepo.getUserByCredentials as jest.Mock).mockClear();
        (mockRepo.save as jest.Mock).mockClear();
        (mockRepo.update as jest.Mock).mockClear();
        (mockRepo.deleteById as jest.Mock).mockClear();

        (mockValidator.isValidId as jest.Mock).mockClear();
        (mockValidator.isValidStrings as jest.Mock).mockClear();
        (mockValidator.isValidObject as jest.Mock).mockClear();
        (mockValidator.isPropertyOf as jest.Mock).mockClear();
        (mockValidator.isEmptyObject as jest.Mock).mockClear();
        
        
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        expect(mockRepo.getAll).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getAll).toBeCalledTimes(1);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockRepo.getById as jest.Mock).mockReturnValue(mockUsers[0]);

        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);
        (mockRepo.getById as jest.Mock).mockReturnValue({});

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserByUniqueKey is given a valid key and a valid/known value (id)', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);

        /*
            Sometimes you will need to mock a function which is a part of
            the same module as the one you are testing. For these kinds
            of cases, you can use Jest's spy feature.
        */
        let _spy = jest.spyOn(sut, 'getUserById');
        _spy.mockClear().mockReturnValue(Promise.resolve(mockUser));

        // Act
        let result = await sut.getUserByUniqueKey({id: 1});

        // Assert
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();
        expect(_spy).toBeCalledTimes(1);

    });

    test('should resolve to User when getUserByUniqueKey is given a valid key and a valid/known value (username)', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByUniqueKey as jest.Mock).mockReturnValue(mockUser);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        let result = await sut.getUserByUniqueKey({username: 'test'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();
        expect(mockValidator.isPropertyOf).toBeCalledTimes(1);
        expect(mockValidator.isValidStrings).toBeCalledTimes(1);
        expect(mockRepo.getUserByUniqueKey).toBeCalledTimes(1);
        expect(mockValidator.isEmptyObject).toBeCalledTimes(1);

    });

    test('should resolve to User when getUserByUniqueKey is given a valid key and an invalid value (id)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        let _spy = jest.spyOn(sut, 'getUserById');
        _spy.mockClear().mockReturnValue(Promise.reject(new BadRequestError()));

        // Act
        try {
            await sut.getUserByUniqueKey({id: NaN});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
            expect(_spy).toBeCalledTimes(1);

        }

    });

    test('should resolve to User when getUserByUniqueKey is given a valid key and an invalid value (id)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        let _spy = jest.spyOn(sut, 'getUserById');
        _spy.mockClear().mockReturnValue(Promise.reject(new BadRequestError()));

        // Act
        try {
            await sut.getUserByUniqueKey({id: NaN});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
            expect(_spy).toBeCalledTimes(1);

        }

    });

    test('should resolve to User when getUserByCredentials is given a valid username and password', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByCredentials as jest.Mock).mockReturnValue(mockUser);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        let result = await sut.getUserByCredentials('aanderson', 'password');
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();
        expect(mockRepo.getUserByCredentials).toBeCalledTimes(1);
    });

    test('should resolve to User when authUser is given a valid username and password', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByCredentials as jest.Mock).mockReturnValue(mockUser);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        let result = await sut.authenticateUser('aanderson', 'password');
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();
        expect(mockValidator.isValidStrings).toBeCalledTimes(1);
        expect(mockRepo.getUserByCredentials).toBeCalledTimes(1);
        expect(mockValidator.isEmptyObject).toBeCalledTimes(1);
    });

    test('should resolve to BadRequesterror when authUser is given an invalid username and password', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(false);
        //(mockRepo.getUserByCredentials as jest.Mock).mockReturnValue(mockUser);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        try {
            await sut.authenticateUser('', '');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);

        }
    });

    test('should resolve to AuthenticationError when authUser is given an invalid username and password', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByCredentials as jest.Mock).mockReturnValue({});
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);

        try {
            await sut.authenticateUser('bob', 'jenson');
        } catch (e) {

            // Assert
            expect(e instanceof AuthenticationError).toBe(true);

        }
    });

    test('should resolve to User when addNewUser is given a valid User object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(6, 'jdoe', 'password', 'john', 'doe', 'jdoe@gmail.com', new Role(3));
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.save as jest.Mock).mockReturnValue(mockUser);
        (mockRepo.getUserByUniqueKey as jest.Mock).mockReturnValue(Promise.reject(new BadRequestError()));
        

        // spy doesnt want to mock isUsernameAvailable and isEmailAvailable.
        // Made an integration test instead..
        // let _spy = jest.spyOn(sut, 'isUsernameAvailable')
        // _spy.mockClear().mockReturnValue(Promise.resolve(true));
        // let _spy2 = jest.spyOn(sut, 'isEmailAvailable')
        // _spy2.mockClear().mockReturnValue(Promise.resolve(true));

        // Act
        let result = await sut.addNewUser(mockUser);

        // Assert
        // expect(_spy).toBeCalledTimes(1);
        // expect(_spy2).toBeCalledTimes(1);
        expect(result).toBeTruthy();
        expect(result.password).toBeUndefined();
        expect(mockRepo.save).toBeCalledTimes(1);
    });

    test('should resolve to BadRequestError when addNewUser is given an invalid user', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = new User(6, 'jdoe', 'password', 'john', 'doe', 'jdoe@gmail.com', new Role(3));
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByCredentials as jest.Mock).mockReturnValue({});
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);

        try {
            await sut.addNewUser(mockUser);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);

        }
    });

    // test('should resolve to BadRequestError when addNewUser is given an invalid user', async () => {
    //     // Arrange
    //     expect.hasAssertions();

    //     let mockUser = {...mockUsers[0]};
    //     delete mockUser.password;
    //     (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
    //     (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
    //     (mockRepo.getUserByCredentials as jest.Mock).mockReturnValue(mockUser);
    //     (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);
    //     (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);

    //     try {
    //         await sut.addNewUser(mockUser);
    //     } catch (e) {

    //         // Assert
    //         expect(e instanceof ResourcePersistenceError).toBe(true);

    //     }
    // });
    
    test('should resolve to true when updateUser is given a valid user and id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = new User(null, 'jdoe', 'password', 'john', 'doe', 'jdoe@gmail.com', new Role(3));
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.update as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByUniqueKey as jest.Mock).mockReturnValue(Promise.reject(new BadRequestError()));

        let result = await sut.updateUser(6, mockUser);
        expect(result).toBeTruthy();
        expect(mockValidator.isValidObject).toBeCalledTimes(1);
        expect(mockRepo.update).toBeCalledTimes(1);
    });

    test('should resolve to false when updateUser is given an invalid user and id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isPropertyOf as jest.Mock).mockReturnValue(true);
        (mockValidator.isValidStrings as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
        (mockRepo.update as jest.Mock).mockReturnValue(true);
        (mockRepo.getUserByUniqueKey as jest.Mock).mockReturnValue(Promise.reject(new BadRequestError()));

        try {
            await sut.updateUser(1, mockUser);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);

        }
    });

    test('should resolve to true when deleteById is given a valid id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockUser = {...mockUsers[0]};
        delete mockUser.password;
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockRepo.deleteById as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(mockValidator.isValidId).toBeCalledTimes(1);
        expect(mockRepo.deleteById).toBeCalledTimes(1);
    });

    test('should resolve to false when deleteById is given a valid id', async () => {
        // Arrange
        expect.hasAssertions();

        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);
        (mockRepo.deleteById as jest.Mock).mockReturnValue(true);

        // Act
        try {
            await sut.deleteById(1);   
        } catch (e) {
        // Assert
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidId).toBeCalledTimes(1);
        }
    });
});