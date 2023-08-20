import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL + import.meta.env.VITE_CURRENT_API_VERSION,
    headers: {
        'Content-Type': 'application/json',
    },
})
export default api
