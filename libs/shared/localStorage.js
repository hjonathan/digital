// Set JSON with 'key' in local storage
export const setJSON = (key, value) => localStorage && localStorage.setItem(key, JSON.stringify(value))

// Set JSON with 'key' in local storage
export const removeItem = (key) => localStorage && localStorage.removeItem(key)

// Get JSON with 'key'
export const getJSON = (key) => localStorage ? JSON.parse(localStorage.getItem(key)) : null
