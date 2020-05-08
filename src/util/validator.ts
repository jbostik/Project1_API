/**
 * Checks that the id passed is not falsy, is a number, and is an integer.
 */
export const isValidId = (id: number): boolean => {
    return !!(id && typeof id === 'number' && Number.isInteger(id) && id > 0);
};
/**
 * Checks to see that all strings in an array are not falsy and are string types.
 */
export const isValidStrings = (...strs: string[]): boolean => {
    return (strs.filter(str => !str || typeof str !== 'string').length == 0);
};


/**
 * Checks to see that an object is valid by ensuring it is not falsy, not
 * empty, and all properties of the object have values.
 */
export const isValidObject = (obj: Object, ...nullableProps: string[]) => {
    return obj && Object.keys(obj).every(key => {
        if (nullableProps.includes(key)) return true;
        return obj[key];
    });
};

/**
 * Checks to see if an object is of the specified type by creating an
 * object of the specified type and comparing it to the passed type
 * parameter.
 */
export const isPropertyOf = (prop: string, type: any) => {

    if (!prop || !type) {
        return false;
    }

    let typeCreator = <T>(Type: (new () => T)): T => {
        return new Type();
    }; 

    let tempInstance;
    try {
        tempInstance = typeCreator(type);
    } catch {
        return false;
    }
    
    return Object.keys(tempInstance).includes(prop);

};

/**
 * Checks to make sure an object is not empty by ensuring it is
 * not falsy and is not an empty object.
 */
export const isEmptyObject = (obj: any): boolean => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
};


export default {
    isValidId,
    isValidStrings,
    isValidObject,
    isPropertyOf,
    isEmptyObject
};








