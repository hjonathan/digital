export const makeTitle = (string) => {
    if (!string) { return }

    string = remove_(string)

    string = removeMiddle_(string)

    string = removeTrailingDots(string)

    string = removeTrailingId(string)

    if (string === 'id') { return 'ID' }

    return string.charAt(0).toUpperCase() + remove_(string).slice(1)
}

export const remove_ = (string) => {
    return string.replace(/_/g, ' ')
}

export const removeMiddle_ = (string) => {
    return string.replace(/-/g, ' ')
}

export const removeTrailingDots = (string) => {
    return string.replace(/\.+$/, '')
}

export const removeTrailingId = (string) => {
    return string.replace(/_id/g, '')
}

// To trim the length of the ID from 36 characters to 8
export const showUuid = (uuid) => {
    if (!uuid) { return '-' }

    if (uuid.length === 36) { return `${uuid.slice(9, 13)}-${uuid.slice(14, 18)}` }

    return uuid
}

export const uuid = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}
