/**
 * Returns the data from a column, it's uses in Custom cell
 * @param {*} object
 * @param {*} property
 * @returns
 */
export const getValue = ({ data, column }) => {
    return data[column.colId]
}
