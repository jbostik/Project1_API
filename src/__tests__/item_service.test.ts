import * as sut from '../services/item_service';
import * as mockRepo from '../repos/item_repo';
import * as mockValidator from '../util/validator';

import { Item } from '../models/item';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

/*
    In order to properly mock all of the functions exported by
    the a module, we will invoke jest.mock() and pass to it: 
        
        - a relative path to the module we wish to mock as string

        - a function which will return the mocked module's exposed 
          functions (which are all mocked as well)

    Interesting fact: jest.mock() is actually executed before any
    import statements.

*/
jest.mock('../repos/item_repo', () => {

    /* 
        It is important to note that the object that is being returned
        exposes properties that are named the exact same as the functions
        exposed by the user-repo module, and all of the properties a Jest
        mock functions.
    */
    return {
        getAll: jest.fn(),
        getById: jest.fn(),
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

describe('itemService', () => {

    let mockItems = [
        new Item(1, 'GoldGate Anti-cavity', 'GoldGate Toothpaste 12oz', 3.99,3),
        new Item(2, 'MalWart H2O', 'Water 1L', 0.99, 50),
        new Item(3, 'Generic Brand Pasta', 'Spaghetti 0.5 lbs', 3.99, 25),
        new Item(4, 'BlunderBread', 'White bread', 2.99, 20),
        new Item(5, 'Jimmy Lean\'s Ham', 'Thin sliced ham 24 slices', 5.99, 10),
        new Item(6, 'I Can\'t Believe It\'s Actually Butter', 'Downfield brand butter 8oz', 3.99, 100)
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

        (mockRepo.save as jest.Mock).mockClear();
        (mockRepo.update as jest.Mock).mockClear();
        (mockRepo.deleteById as jest.Mock).mockClear();

        (mockValidator.isValidId as jest.Mock).mockClear();
        (mockValidator.isValidStrings as jest.Mock).mockClear();
        (mockValidator.isValidObject as jest.Mock).mockClear();
        (mockValidator.isPropertyOf as jest.Mock).mockClear();
        (mockValidator.isEmptyObject as jest.Mock).mockClear();
        
        
    });

    test('should resolve to Item[] when getAllItems() successfully retrieves items from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue(mockItems);

        // Act
        let result = await sut.getAllItems();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(6);
        expect(mockRepo.getAll).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getAllItems fails to get any items from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue([]);

        // Act
        try {
            await sut.getAllItems();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getAll).toBeCalledTimes(1);
        }

    });

    test('should resolve to Item when getItemById is given a valid an known id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockRepo.getById as jest.Mock).mockReturnValue(mockItems[0]);

        // Act
        let result = await sut.getItemById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should reject with BadRequestError when getItemById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getItemById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getItemById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getItemById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getItemById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getItemById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getItemById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getItemById(-2);
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
            await sut.getItemById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });


    test('should resolve to User when addNewItem is given a valid Item object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(7, 'name', 'desc', 1.00, 10);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.save as jest.Mock).mockReturnValue(mockItem);
        

        // Act
        let result = await sut.addNewItem(mockItem, 1);

        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.save).toBeCalledTimes(1);
    });

    test('should resolve to User when addNewItem is given a valid Item object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(7, 'name', 'desc', 1.00, 10);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
        (mockRepo.save as jest.Mock).mockReturnValue(mockItem);
        

        try {
            // Act
            await sut.addNewItem(mockItem, 1);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidObject).toBeCalledTimes(1);
        }
    });
    
    test('should resolve to true when updateItem is given a valid Item and id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(7, 'name', 'desc', 1.00, 10);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.update as jest.Mock).mockReturnValue(true);

        let result = await sut.updateItem(3, mockItem);

        expect(result).toBeTruthy();
        expect(mockValidator.isValidObject).toBeCalledTimes(1);
        expect(mockRepo.update).toBeCalledTimes(1);
    });

    test('should resolve to false when updateItem is given an invalid Item object', async () => {
        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(7, 'name', 'desc', 1.00, 10);
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
        (mockRepo.update as jest.Mock).mockReturnValue(true);

        try {
            await sut.updateItem(3, mockItem);
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidObject).toBeCalledTimes(1);
        }
    });



    test('should resolve to true when  deleteById is given a valid id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockItem = {...mockItems[0]};
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