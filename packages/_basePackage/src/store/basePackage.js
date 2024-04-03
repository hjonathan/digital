import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Example Store
 */
export default defineStore('basePackage', () => {
    const data = ref('BASE PACKAGE')

    const response = ref()

    const fetchData = async () => {
        response.value = await fetch('https://api.thecatapi.com/v1/images/search')

        return response.value
    }

    return { data, fetchData }
})
