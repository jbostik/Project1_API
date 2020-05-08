// import { UserRepository } from '../repos/user_repo';
// import { UserService } from '../services/user_service';
// import { ItemRepository } from '../repos/item_repo';
// import { ItemService } from '../services/item_service';
// import { OrderRepository } from '../repos/order_repo';
// import { OrderService } from '../services/order_service';


// class UserServiceInstance {
//     getInstance(): UserService {
//         const userRepo = new UserRepository();
//         const userService = new UserService(userRepo);
//         return userService;
//     }
// }

// class UserRepoInstance {
//     getInstance(): UserRepository {
//         const userRepo = new UserRepository();
//         return userRepo;
//     }
// }

// class ItemServiceInstance {
//     getInstance(): ItemService {
//         const itemRepo = new ItemRepository();
//         const itemService = new ItemService(itemRepo);
//         return itemService;
//     }
// }

// class ItemRepoInstance {
//     getInstance(): ItemRepository {
//         const itemRepo = new ItemRepository();
//         return itemRepo;
//     }
// }

// class OrderServiceInstance {
//     getInstance(): OrderService {
//         const orderRepo = new OrderRepository();
//         const orderService = new OrderService(orderRepo);
//         return orderService;
//     }
// }

// class OrderRepoInstance {
//     getInstance(): OrderRepository {
//         const orderRepo = new OrderRepository();
//         return orderRepo;
//     }
// }

// export {
//     // UserServiceInstance,
//     // UserRepoInstance,
//     ItemServiceInstance,
//     ItemRepoInstance,
//     OrderServiceInstance,
//     OrderRepoInstance
// };