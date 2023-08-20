import api from './api'
import {useAuthStore} from '../../stores/authStore'

const setup = () => {
  const store = useAuthStore()

  api.interceptors.request.use(
    (config) => {
      const accessToken = store.tokens.accessToken
      if (accessToken)
        config.headers['x-access-token'] = accessToken
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
  api.interceptors.response.use(
    (res) => {
      return res
    },
    async (err) => {
      const originalConfig = err.config
      if (originalConfig.url !== '/login' && err.response) {
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true
          if (err.response && err.response.status === 401
            && err.response.data.detail === 'Refresh token expired'
            && err.response.request.responseURL === '/refresh/token') {
            await store.logout(true)
          }
          try {
            const rs = await api.post('/refresh/token', {
              refresh_token: store.tokens.refreshToken
            })
            const { accessToken, refreshToken } = rs.data
            store.setTokens(accessToken, refreshToken)
            return api(originalConfig)
          } catch (_error) {
            return Promise.reject(_error)
          }
        }
      }
      return Promise.reject(err)
    }
  )
}
export default setup
