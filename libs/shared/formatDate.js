/*
|--------------------------------------------------------------------------
| formatDate
|--------------------------------------------------------------------------
|
| Formats dates using Moment.js.
|
| To add date formats please visit https://momentjs.com/
|
*/

import moment from 'moment-timezone'

// IMPORTANT: If the timeZone cannot be obtained from the system or browser, it will take the application configuration variable.
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || import.meta.env.VITE_TIMEZONE

moment.relativeTimeRounding(Math.floor)

moment.relativeTimeThreshold('s', 60)
moment.relativeTimeThreshold('m', 60)
moment.relativeTimeThreshold('h', 24)
moment.relativeTimeThreshold('d', 7)
moment.relativeTimeThreshold('w', 4)
moment.relativeTimeThreshold('M', 12)

// Format: 03/17/2023
export const formatBasicDate = (date) => {
    return moment(date).tz(timezone).format('L')
}

// Format: March 17, 2023
export const formatLiteralMonthDate = (date) => {
    return moment(date).tz(timezone).format('LL')
}

// Format: Fri, Mar 24, 2023 12:04 PM
export const formatFullFormatDate = (date) => {
    return moment(date).tz(timezone).format('llll')
}

// Format: August 25th, 2023
export const formatAmericanDate = (date) => {
    return moment(date).tz(timezone).format('MMMM Do, YYYY')
}

// Format: August 25th, 2023
export const formatAmericanSimplifiedDate = (date) => {
    return moment(date).tz(timezone).format('MMMM Do')
}

// Gets time durations in human readable format
export const formatDiffForHumans = (date) => {
    return moment(date).tz(timezone).fromNow()
}

// Convert dates to UTC format with date and time. Format: 2023-08-25 20:56:27
export const utcDateTime = (date) => {
    return moment.utc(date).format('YYYY-MM-DD HH:mm:ss')
}

// Imports all date formats from a single method
export const formatDate = (value, option = 'basic') => {
    let formattedDate

    option === 'basic' && (formattedDate = formatBasicDate(value))

    option === 'literalMonth' && (formattedDate = formatLiteralMonthDate(value))

    option === 'fullFormat' && (formattedDate = formatFullFormatDate(value))

    option === 'americanFormat' && (formattedDate = formatAmericanDate(value))

    option === 'americanSimplifiedFormat' && (formattedDate = formatAmericanSimplifiedDate(value))

    option === 'diffForHumans' && (formattedDate = formatDiffForHumans(value))

    option === 'utcDateTime' && (formattedDate = utcDateTime(value))

    return formattedDate
}

/**
 * Datetime comparator filter used on table
 * @param {*} filterValue
 * @param {*} cellValue
 * @returns
 */
export const comparatorFilterDate = (filterValue, cellValue) => {
    const equal = 0
    const valueLessThan = -1
    const valueGreaterThan = 1

    const filterValueString = formatDate(filterValue)
    const cellValueString = formatDate(cellValue)

    if (filterValue === null) {
        return equal
    }

    if (cellValueString < filterValueString) {
        return valueLessThan
    }

    if (cellValueString > filterValueString) {
        return valueGreaterThan
    }

    return equal
}
