import { refresh } from 'api/authentication/auth'
import { AppDispatch, store } from 'app/store'
import axios from 'axios'
import { setIsAuthenticated } from 'features/institutional/UserSlice'

const api = axios.create({
  baseURL: process.env.REACT_APP_MICROSERVICE_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

const refreshToken = async (dispatch: AppDispatch) => {
  try {
    await refresh()
    dispatch(setIsAuthenticated(true))
    return true
  } catch {
    return false
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true

      const success = await refreshToken(store.dispatch)

      if (success) {
        return api(originalRequest)
      }

      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
