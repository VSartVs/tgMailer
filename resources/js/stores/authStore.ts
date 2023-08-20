import {defineStore} from 'pinia'
import {reactive, ref} from 'vue'
import api from '../services/auth/api'
import router from "../router";


export const useAuthStore = defineStore('auth', () => {

    const errors = ref({})
    const validated = ref(false)

    const tokens = localStorage.getItem('tokens') === null ?
        reactive({accessToken: null, refreshToken: null}) :
        reactive(JSON.parse(localStorage.getItem('tokens')))

    const login = async (email, password) => {
        return await api.post('login', {
            email,
            password
        }).then( (response) => {
            setTokens(response.data.accessToken, response.data.refreshToken)
            errors.value = {}
            validated.value = false
            router.push('/')
        }).catch( (err) => {
            errors.value = err.response.data.errors
            validated.value = true
            return Promise.reject(err)
        })

    }
    const logout = async (sessionExpired= false) => {
        localStorage.removeItem('tokens')
        if(!sessionExpired)
           return await api.post('logout')
        await router.push('/')
    }

    const setTokens = (accessToken, refreshToken) => {
        tokens.accessToken = accessToken
        tokens.refreshToken = refreshToken
        localStorage.setItem('tokens', JSON.stringify(tokens));
    }


    return { tokens, errors, validated, login, logout, setTokens }
})
