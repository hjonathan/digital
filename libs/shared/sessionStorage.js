// Set JSON with 'key' in session storage
export const setSessionJSON = (key, value) => sessionStorage && sessionStorage.setItem(key, JSON.stringify(value))

// Set JSON with 'key' in session storage
export const removeSessionItem = (key) => sessionStorage && sessionStorage.removeItem(key)

// Get JSON with 'key' from session storage
export const getSessionJSON = (key) => sessionStorage ? JSON.parse(sessionStorage.getItem(key)) : null
