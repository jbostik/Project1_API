import * as sut from '../repos/item_repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Item } from '../models/item';
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
        mapItemResultSet: jest.fn()
    };
});

describe('itemRepo', () => {

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
                                itemName: 'Water',
                                description: 'Generic Brand',
                                cost: 0.99,
                                amount: 1
                            }
                        ]
                    };
                }), 
                release: jest.fn()
            };
        });
        (mockMapper.mapItemResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Items when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(1, 'name', 'desc', 1.00, 1);
        (mockMapper.mapItemResultSet as jest.Mock).mockReturnValue(mockItem);

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

    test('should resolve to aa Item object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockItem = new Item(1, 'name', 'desc', 1.00, 1);
        (mockMapper.mapItemResultSet as jest.Mock).mockReturnValue(mockItem);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Item).toBe(true);

    });



    test('Should resolve to an Item object when save retrieves a valid item object', async () => {
        expect.hasAssertions();
        
        let mockItem = new Item(1, 'name', 'desc', 1.00, 1);
        (mockMapper.mapItemResultSet as jest.Mock).mockReturnValue(mockItem);

        let result = await sut.save(mockItem, 1);

        expect(result).toBeTruthy();
        expect(result instanceof Item).toBe(true);
    });

    test('Should resolve to true when deleteById deletes a valid item object', async () => {
        expect.hasAssertions();
        
        let mockItem = new Item(1, 'name', 'desc', 1.00, 1);
        (mockMapper.mapItemResultSet as jest.Mock).mockReturnValue(mockItem);

        let result = await sut.deleteById(1);

        expect(result).toBeTruthy();
    });

    test('Should resolve to true when update updates a valid item object', async () => {
        expect.hasAssertions();
        
        let mockItem = new Item(1, 'name', 'desc', 1.00, 1);
        (mockMapper.mapItemResultSet as jest.Mock).mockReturnValue(mockItem);

        let result = await sut.update(mockItem);

        expect(result).toBeTruthy();
    });

});
