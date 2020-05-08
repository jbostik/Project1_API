import * as sut from '../services/order_service';
import * as mockRepo from '../repos/order_repo';
import * as mockValidator from '../util/validator';

import { Order } from '../models/order';
import { ResourceNotFoundError, BadRequestError} from '../errors/errors';
import { Item } from '../models/item';

/*
    In order to properly mock all of the functions exported by
    the a module, we will invoke jest.mock() and pass to it: 
        
        - a relative path to the module we wish to mock as string

        - a function which will return the mocked module's exposed 
          functions (which are all mocked as well)

    Interesting fact: jest.mock() is actually executed before any
    import statements.

*/
jest.mock('../repos/order_repo', () => {

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
        deleteById: jest.fn(),
        getOrdersByUserId: jest.fn(),
        getItemsByOrderId: jest.fn()
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

describe('orderService', () => {

    let mockOrders = [
        new Order(1, 1, true, 'Seattle, Washington', 'New York City, New York'),
        new Order(2, 2, true, 'Seattle, Washington', 'New York City, New York')
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
        (mockRepo.getOrdersByUserId as jest.Mock).mockClear();
        (mockRepo.getItemsByOrderId as jest.Mock).mockClear();

        (mockValidator.isValidId as jest.Mock).mockClear();
        (mockValidator.isValidStrings as jest.Mock).mockClear();
        (mockValidator.isValidObject as jest.Mock).mockClear();
        (mockValidator.isPropertyOf as jest.Mock).mockClear();
        (mockValidator.isEmptyObject as jest.Mock).mockClear();
        
        
    });

    test('should resolve to Order[] when getAllOrders() successfully retrieves orders from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue(mockOrders);

        // Act
        let result = await sut.getAllOrders();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
        expect(mockRepo.getAll).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getAllOrders fails to get any orders from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getAll as jest.Mock).mockReturnValue([]);

        // Act
        try {
            await sut.getAllOrders();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getAll).toBeCalledTimes(1);
        }

    });

    test('should resolve to Order[] when getOrdersByUserId() successfully retrieves orders from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getOrdersByUserId as jest.Mock).mockReturnValue(mockOrders);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        let result = await sut.getOrdersByUserId(1);
        
        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(2);
        expect(mockRepo.getOrdersByUserId).toBeCalledTimes(1);

    });

    test('should reject with ResourceNotFoundError when getOrdersByUserId fails to get any orders from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getOrdersByUserId as jest.Mock).mockReturnValue(mockOrders);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getOrdersByUserId(1);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getOrdersByUserId is passed a bad ID', async () => {

        // Arrange
        expect.hasAssertions();
        (mockRepo.getOrdersByUserId as jest.Mock).mockReturnValue(mockOrders);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(true);

        // Act
        try {
            await sut.getOrdersByUserId(1);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
            expect(mockRepo.getOrdersByUserId).toBeCalledTimes(1);
        }

    });

    test('should resolve to Item[] when getItemsByOrderId() successfully retrieves items from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let mockItem = [new Item(1, 'name', 'desc', 1.00, 1)];
        (mockRepo.getItemsByOrderId as jest.Mock).mockReturnValue(mockItem);
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);

        // Act
        let result = await sut.getItemsByOrderId(1);
        
        console.log(result + '--------------------------------------------------------------------');
        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(1);
        expect(mockRepo.getItemsByOrderId).toBeCalledTimes(1);

    });

    test('should resolve to Order when getOrderById is given a valid an known id', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(true);
        (mockValidator.isEmptyObject as jest.Mock).mockReturnValue(false);
        (mockRepo.getById as jest.Mock).mockReturnValue(mockOrders[0]);

        // Act
        let result = await sut.getOrderById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getOrderById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        (mockValidator.isValidId as jest.Mock).mockReturnValue(false);

        // Act
        try {
            await sut.getOrderById(-2);
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
            await sut.getOrderById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });


    test('should resolve to User when addNewOrder is given a valid Order object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockOrder = new Order(1, 1, true, 'somewhere', 'somewhere else');
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.save as jest.Mock).mockReturnValue(mockOrder);
        

        // Act
        let result = await sut.addNewOrder(mockOrder);

        // Assert
        expect(result).toBeTruthy();
        expect(mockRepo.save).toBeCalledTimes(1);
    });

    test('should resolve to User when addNewOrder is given a valid Order object', async () => {

        // Arrange
        expect.hasAssertions();

        let mockOrder = new Order(3, 1, true, 'somewhere', 'somewhere else');
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
        (mockRepo.save as jest.Mock).mockReturnValue(mockOrder);
        

        try {
            // Act
            await sut.addNewOrder(mockOrder);
        } catch (e) {
            // Assert
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidObject).toBeCalledTimes(1);
        }
    });
    
    test('should resolve to true when updateOrder is given a valid order and id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockOrder = new Order(3, 1, true, 'somewhere', 'somewhere else');
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(true);
        (mockRepo.update as jest.Mock).mockReturnValue(true);

        let result = await sut.updateOrder(3, mockOrder);

        expect(result).toBeTruthy();
        expect(mockValidator.isValidObject).toBeCalledTimes(1);
        expect(mockRepo.update).toBeCalledTimes(1);
    });

    test('should resolve to false when updateOrder is given an invalid order object', async () => {
        // Arrange
        expect.hasAssertions();

        let mockOrder = new Order(3, 1, true, 'somewhere', 'somewhere else');
        (mockValidator.isValidObject as jest.Mock).mockReturnValue(false);
        (mockRepo.update as jest.Mock).mockReturnValue(true);

        try {
            await sut.updateOrder(3, mockOrder);
        } catch (e) {
            expect(e instanceof BadRequestError).toBeTruthy();
            expect(mockValidator.isValidObject).toBeCalledTimes(1);
        }
    });



    test('should resolve to true when  deleteById is given a valid id', async () => {
        // Arrange
        expect.hasAssertions();

        let mockOrder = {...mockOrders[0]};
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