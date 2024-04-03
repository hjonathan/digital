import axios from 'axios'

// Base instance of axios to use throughout the project
export default axios.create({
    timeout: 60000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
})
