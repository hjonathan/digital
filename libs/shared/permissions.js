export const validatePermission = (permission, permissions) => {
    if (import.meta.env && import.meta.env.VITE_PERMISSIONS === 'false') {
        return true
    }

    if (permission && permissions.length) {
        if (permissions.includes(permission)) {
            return true
        }

        // IMPORTANT: if it has only wildcard .all it is true but if it has other related permission it is false
        if (wildCardRelated(permission, permissions)) {
            return true
        }
    }

    return false
}

export const validatePermissionArray = (permissionArray, permissions) => {
    const response = permissionArray.find(e => {
        return validatePermission(e, permissions)
    })

    return response
}

export const wildCardAll = (permission, permissions) => {
    let response = false

    const wild = permissions.filter(e => {
        return e.includes('.all')
    })

    // eslint-disable-next-line no-labels
    loop: for (let i = 0; i < wild.length; i++) {
        const permissionPrefix = wild[i].replace('.all', '.')

        if (permission.indexOf(permissionPrefix) === 0) {
            response = true

            // eslint-disable-next-line no-labels
            break loop
        }
    }

    return response
}

export const wildCardRelated = (permission, permissions) => {
    const prefix = permission.replace(/\.(\w+)$/, '.')

    const elements = permissions.filter(e => e.includes(prefix))

    const wildCard = elements.find(e => e.endsWith('.all'))

    return wildCard && elements.length === 1
}
