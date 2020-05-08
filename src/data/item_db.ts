import { Item } from '../models/item';

let id: number = 1;

export default [
    new Item(id++, 'GoldGate Anti-cavity', 'GoldGate Toothpaste 12oz', 3.99,3),
    new Item(id++, 'MalWart H2O', 'Water 1L', 0.99, 50),
    new Item(id++, 'Generic Brand Pasta', 'Spaghetti 0.5 lbs', 3.99, 25),
    new Item(id++, 'BlunderBread', 'White bread', 2.99, 20),
    new Item(id++, 'Jimmy Lean\'s Ham', 'Thin sliced ham 24 slices', 5.99, 10),
    new Item(id++, 'I Can\'t Believe It\'s Actually Butter', 'Downfield brand butter 8oz', 3.99, 100)
];