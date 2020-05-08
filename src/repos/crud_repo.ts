export interface CrudRepository<T> {
    getAll(): Promise<T[]>;
    getByID(id: number): Promise<T>;
    save(newObj: T): Promise<T>;
    update(updatedObj: T): Promise<Boolean>;
    deleteById(id: number): Promise<Boolean>;
}