// Custom Round Math function
export const round = (number, decimals = 2) => {
    const sign = (number >= 0 ? 1 : -1)

    number = number * sign

    if (decimals === 0) { return sign * Math.round(number) }

    // round(x * 10 ^ decimals)
    number = number.toString().split('e')

    number = Math.round(+(number[0] + 'e' + (number[1] ? (+number[1] + decimals) : decimals)))

    // x * 10 ^ (-decimals)
    number = number.toString().split('e')

    return sign * (number[0] + 'e' + (number[1] ? (+number[1] - decimals) : -decimals))
}
