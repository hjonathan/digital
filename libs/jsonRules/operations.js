import { get, isArray } from 'lodash'
/**
 * This file contains additional operations for jsonLogic
 */
export const extraOperations = {
    /**
     * Checks if the value a is not included in the array b
     * @param {*} a criteria
     * @param {*} b Array
     * @returns
     */
    notIn: (a, b) => !b.includes(a),
    /**
     * Checks if the value a is equal to each element of the array b
     * @param {*} a criteria
     * @param {*} b Array
     * @returns
     */
    every: (b, a) => b.every(e => e === a),
    /**
     * Checks on each value of array b the condition in function a
     * @param {*} a Function
     * @param {*} b Array
     * @returns
     */
    everyCollection: (b, a) => {
        if (typeof a === 'function') {
            return b.every(a)
        }

        return false
    },
    /**
     * All values of a certain property must be the same
     * @param {*} a Array
     * @param {*} b Poperty
     * @param {*} c Criteria
     * @returns
     */
    allEqual: (a, b, c) => {
        if (isArray(a) && !a.length) {
            return false
        }

        if (typeof b === 'string') {
            return a.every(e => {
                return get(e, b) === c
            })
        }

        return false
    },
    /**
     * All values for a given property must be within a value group.
     * @param {*} a Array
     * @param {*} b Property
     * @param {*} c Criteria
     * @returns
     */
    allIn: (a, b, c) => {
        if (isArray(a) && !a.length) {
            return false
        }

        if (typeof b === 'string') { return a.every(e => c.includes(get(e, b))) }

        return false
    }
}
