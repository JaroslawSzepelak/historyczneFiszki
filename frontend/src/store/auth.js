import axios from 'axios'

export default {
    namespaced: true,
    state: {
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null
    },
    getters: {
        user: state => state.user,
        isAuthenticated: state => state.isAuthenticated,
        isAdmin: state => state.isAdmin,
        loading: state => state.loading,
        error: state => state.error
    },
    mutations: {
        setUser(state, user) {
            state.user = user
            state.isAuthenticated = !!user
            state.isAdmin = user ? user.isAdmin : false
        },
        setLoading(state, loading) {
            state.loading = loading
        },
        setError(state, error) {
            state.error = error
        },
        clearError(state) {
            state.error = null
        },
        logout(state) {
            state.user = null
            state.isAuthenticated = false
            state.isAdmin = false
            state.error = null
        }
    },
    actions: {
        async register({ commit }, userData) {
            commit('setLoading', true)
            commit('clearError')
            try {
                const response = await axios.post('/api/auth/register', userData)
                const user = response.data.user
                commit('setUser', user)
                return user
            } catch (error) {
                const message = error.response?.data?.error || 'Błąd rejestracji'
                commit('setError', message)
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        async login({ commit }, credentials) {
            commit('setLoading', true)
            commit('clearError')
            try {
                const response = await axios.post('/api/auth/login', credentials)
                const user = response.data.user
                commit('setUser', user)
                return user
            } catch (error) {
                const message = error.response?.data?.error || 'Błąd logowania'
                commit('setError', message)
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        async logout({ commit }) {
            try {
                await axios.post('/api/auth/logout')
            } catch (error) {
                console.warn('Logout error:', error)
            } finally {
                commit('logout')
            }
        },

        async checkAuth({ commit }) {
            try {
                const response = await axios.get('/api/auth/me')
                const user = response.data.user
                commit('setUser', user)
                return user
            } catch (error) {
                commit('logout')
                throw error
            }
        },

        clearError({ commit }) {
            commit('clearError')
        }
    }
}