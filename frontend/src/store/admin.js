import adminService from '../services/adminService'

export default {
    namespaced: true,

    state: {
        users: [],
        selectedUser: null,
        loading: false,
        loadingUsers: false,
        loadingDetail: false,
        flashcards: [],
        selectedFlashcard: null,
        loadingFlashcards: false,
        loadingFlashcardDetail: false,
        
        error: null,
        errors: {},
        
        filters: {
            search: '',
            status: '',
            isAdmin: ''
        },
        
        pagination: {
            page: 1,
            limit: 50,
            total: 0,
            pages: 0
        },

        flashcardFilters: {
            area: '',
            era: '',
            q: ''
        },

        flashcardPagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
        },
        
        stats: {
            total_users: 0,
            admin_count: 0,
            active_users: 0,
            inactive_users: 0,
            banned_users: 0,
            verified_users: 0,
            last_user_created: null,
            last_login_time: null
        }
    },

    getters: {
        // Użytkownicy
        users: state => state.users,
        getUsers: state => (filters = {}) => {
            return state.users.filter(user => {
                if (filters.status && user.status !== filters.status) return false
                // Ignore empty string filter for isAdmin
                if (filters.isAdmin !== undefined && filters.isAdmin !== '' && user.isAdmin !== filters.isAdmin) return false
                return true
            })
        },
        
        // Wybrany użytkownik
        selectedUser: state => state.selectedUser,
        getUserById: state => id => {
            return state.users.find(user => user.id === id)
        },
        
        // Stany ładowania
        loading: state => state.loading,
        loadingUsers: state => state.loadingUsers,
        loadingDetail: state => state.loadingDetail,
        loadingFlashcards: state => state.loadingFlashcards,
        loadingFlashcardDetail: state => state.loadingFlashcardDetail,
        isLoading: state => state.loading || state.loadingUsers || state.loadingDetail || state.loadingFlashcards || state.loadingFlashcardDetail,

        // Fiszki
        flashcards: state => state.flashcards,
        selectedFlashcard: state => state.selectedFlashcard,
        getFlashcardById: state => id => {
            return state.flashcards.find(flashcard => flashcard.id === id)
        },
        flashcardFilters: state => state.flashcardFilters,
        flashcardPagination: state => state.flashcardPagination,
        
        // Błędy
        error: state => state.error,
        getError: state => (operation = null) => {
            if (operation) {
                return state.errors[operation] || null
            }
            return state.error
        },
        
        // Filtry
        filters: state => state.filters,
        
        // Paginacja
        pagination: state => state.pagination,
        totalPages: state => state.pagination.pages,
        currentPage: state => state.pagination.page,
        
        // Statystyki
        stats: state => state.stats,
        statsPercentage: state => {
            const total = state.stats.total_users || 1
            return {
                admins: Math.round((state.stats.admin_count / total) * 100),
                active: Math.round((state.stats.active_users / total) * 100),
                inactive: Math.round((state.stats.inactive_users / total) * 100),
                banned: Math.round((state.stats.banned_users / total) * 100),
                verified: Math.round((state.stats.verified_users / total) * 100)
            }
        }
    },

    mutations: {
        // Użytkownicy
        setUsers(state, users) {
            state.users = users
        },
        updateUser(state, updatedUser) {
            const index = state.users.findIndex(u => u.id === updatedUser.id)
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser)
            }
            if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
                state.selectedUser = updatedUser
            }
        },
        removeUser(state, userId) {
            state.users = state.users.filter(u => u.id !== userId)
            if (state.selectedUser && state.selectedUser.id === userId) {
                state.selectedUser = null
            }
        },
        addUser(state, user) {
            state.users.unshift(user)
        },

        // Fiszki
        setFlashcards(state, flashcards) {
            state.flashcards = flashcards
        },
        updateFlashcard(state, updatedFlashcard) {
            const index = state.flashcards.findIndex(f => f.id === updatedFlashcard.id)
            if (index !== -1) {
                state.flashcards.splice(index, 1, updatedFlashcard)
            }
            if (state.selectedFlashcard && state.selectedFlashcard.id === updatedFlashcard.id) {
                state.selectedFlashcard = updatedFlashcard
            }
        },
        removeFlashcard(state, flashcardId) {
            state.flashcards = state.flashcards.filter(f => f.id !== flashcardId)
            if (state.selectedFlashcard && state.selectedFlashcard.id === flashcardId) {
                state.selectedFlashcard = null
            }
        },
        addFlashcard(state, flashcard) {
            state.flashcards.unshift(flashcard)
        },
        
        // Wybrany użytkownik
        setSelectedUser(state, user) {
            state.selectedUser = user
        },
        clearSelectedUser(state) {
            state.selectedUser = null
        },
        setSelectedFlashcard(state, flashcard) {
            state.selectedFlashcard = flashcard
        },
        clearSelectedFlashcard(state) {
            state.selectedFlashcard = null
        },
        
        // Stany ładowania
        setLoading(state, loading) {
            state.loading = loading
        },
        setLoadingUsers(state, loading) {
            state.loadingUsers = loading
        },
        setLoadingDetail(state, loading) {
            state.loadingDetail = loading
        },
        setLoadingFlashcards(state, loading) {
            state.loadingFlashcards = loading
        },
        setLoadingFlashcardDetail(state, loading) {
            state.loadingFlashcardDetail = loading
        },
        
        // Błędy
        setError(state, error) {
            state.error = error
        },
        setOperationError(state, { operation, error }) {
            state.errors[operation] = error
        },
        clearError(state) {
            state.error = null
        },
        clearOperationError(state, operation) {
            delete state.errors[operation]
        },
        clearAllErrors(state) {
            state.error = null
            state.errors = {}
        },
        
        // Filtry
        setFilters(state, filters) {
            state.filters = { ...state.filters, ...filters }
        },
        clearFilters(state) {
            state.filters = {
                search: '',
                status: '',
                isAdmin: ''
            }
        },
        setFlashcardFilters(state, filters) {
            state.flashcardFilters = { ...state.flashcardFilters, ...filters }
        },
        clearFlashcardFilters(state) {
            state.flashcardFilters = {
                area: '',
                era: '',
                q: ''
            }
        },
        
        // Paginacja
        setPagination(state, pagination) {
            state.pagination = { ...state.pagination, ...pagination }
        },
        setPage(state, page) {
            state.pagination.page = page
        },
        setFlashcardPagination(state, pagination) {
            state.flashcardPagination = { ...state.flashcardPagination, ...pagination }
        },
        setFlashcardPage(state, page) {
            state.flashcardPagination.page = page
        },
        
        // Statystyki
        setStats(state, stats) {
            state.stats = stats
        }
    },

    actions: {
        /**
         * Pobierz listę użytkowników
         */
        async fetchUsers({ commit, state }, options = {}) {
            commit('setLoadingUsers', true)
            commit('clearOperationError', 'fetchUsers')
            
            try {
                const requestOptions = {
                    page: options.page || state.pagination.page,
                    limit: options.limit || state.pagination.limit,
                    ...state.filters
                }
                
                const response = await adminService.getUsers(requestOptions)
                
                commit('setUsers', response.users)
                commit('setPagination', {
                    page: response.pagination.page,
                    limit: response.pagination.limit,
                    total: response.pagination.total,
                    pages: response.pagination.pages
                })
                
                return response
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas pobierania użytkowników'
                commit('setOperationError', { operation: 'fetchUsers', error: errorMessage })
                throw error
            } finally {
                commit('setLoadingUsers', false)
            }
        },

        /**
         * Pobierz szczegóły użytkownika
         */
        async fetchUserById({ commit }, userId) {
            commit('setLoadingDetail', true)
            commit('clearOperationError', 'fetchUserById')
            
            try {
                const user = await adminService.getUserById(userId)
                commit('setSelectedUser', user)
                return user
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas pobierania danych użytkownika'
                commit('setOperationError', { operation: 'fetchUserById', error: errorMessage })
                throw error
            } finally {
                commit('setLoadingDetail', false)
            }
        },

        /**
         * Aktualizuj dane użytkownika
         */
        async updateUser({ commit }, { userId, userData }) {
            commit('setLoading', true)
            commit('clearOperationError', 'updateUser')
            
            try {
                const updatedUser = await adminService.updateUser(userId, userData)
                commit('updateUser', updatedUser)
                commit('setSelectedUser', updatedUser)
                return updatedUser
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas aktualizacji użytkownika'
                commit('setOperationError', { operation: 'updateUser', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Usuń użytkownika
         */
        async deleteUser({ commit }, userId) {
            commit('setLoading', true)
            commit('clearOperationError', 'deleteUser')
            
            try {
                const result = await adminService.deleteUser(userId)
                commit('removeUser', userId)
                return result
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas usuwania użytkownika'
                commit('setOperationError', { operation: 'deleteUser', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Zmień status użytkownika
         */
        async changeUserStatus({ commit }, { userId, status }) {
            commit('setLoading', true)
            commit('clearOperationError', 'changeUserStatus')
            
            try {
                const updatedUser = await adminService.changeUserStatus(userId, status)
                commit('updateUser', updatedUser)
                return updatedUser
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas zmiany statusu użytkownika'
                commit('setOperationError', { operation: 'changeUserStatus', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Przełącz rolę administratora
         */
        async toggleAdminRole({ commit }, { userId, isAdmin }) {
            commit('setLoading', true)
            commit('clearOperationError', 'toggleAdminRole')
            
            try {
                const updatedUser = await adminService.toggleAdminRole(userId, isAdmin)
                commit('updateUser', updatedUser)
                return updatedUser
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas zmiany roli administratora'
                commit('setOperationError', { operation: 'toggleAdminRole', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Resetuj hasło użytkownika
         */
        async resetUserPassword({ commit }, { userId, password }) {
            commit('setLoading', true)
            commit('clearOperationError', 'resetUserPassword')
            
            try {
                const updatedUser = await adminService.resetUserPassword(userId, password)
                commit('updateUser', updatedUser)
                return updatedUser
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas resetowania hasła'
                commit('setOperationError', { operation: 'resetUserPassword', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Pobierz statystyki użytkowników
         */
        async fetchStats({ commit }) {
            commit('clearOperationError', 'fetchStats')
            
            try {
                const stats = await adminService.getStats()
                commit('setStats', stats)
                return stats
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas pobierania statystyk'
                commit('setOperationError', { operation: 'fetchStats', error: errorMessage })
                throw error
            }
        },

        /**
         * Utwórz nowego użytkownika
         */
        async createUser({ commit }, userData) {
            commit('setLoading', true)
            commit('clearOperationError', 'createUser')
            
            try {
                const newUser = await adminService.createUser(userData)
                commit('addUser', newUser)
                return newUser
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas tworzenia użytkownika'
                commit('setOperationError', { operation: 'createUser', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Ustaw filtry i pobierz użytkowników na stronie 1
         */
        async setFiltersAndFetch({ commit, dispatch }, filters) {
            commit('setFilters', filters)
            commit('setPage', 1)
            return dispatch('fetchUsers', { page: 1 })
        },

        /**
         * Wyczyść filtry
         */
        clearFilters({ commit, dispatch }) {
            commit('clearFilters')
            commit('setPage', 1)
            return dispatch('fetchUsers', { page: 1 })
        },

        /**
         * Zmień stronę
         */
        changePage({ dispatch }, page) {
            return dispatch('fetchUsers', { page })
        },

        /**
         * Pobierz listę fiszek
         */
        async fetchFlashcards({ commit, state }, options = {}) {
            commit('setLoadingFlashcards', true)
            commit('clearOperationError', 'fetchFlashcards')

            try {
                const requestOptions = {
                    page: options.page || state.flashcardPagination.page,
                    limit: options.limit || state.flashcardPagination.limit,
                    ...state.flashcardFilters
                }

                const response = await adminService.getFlashcards(requestOptions)
                const data = response.data || []
                const pagination = response.pagination || {}

                commit('setFlashcards', data)
                commit('setFlashcardPagination', {
                    page: pagination.page || state.flashcardPagination.page,
                    limit: pagination.limit || state.flashcardPagination.limit,
                    total: pagination.total || 0,
                    pages: pagination.total ? Math.ceil(pagination.total / (pagination.limit || state.flashcardPagination.limit)) : 0
                })

                return response
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas pobierania fiszek'
                commit('setOperationError', { operation: 'fetchFlashcards', error: errorMessage })
                throw error
            } finally {
                commit('setLoadingFlashcards', false)
            }
        },

        /**
         * Pobierz szczegóły fiszki
         */
        async fetchFlashcardById({ commit }, flashcardId) {
            commit('setLoadingFlashcardDetail', true)
            commit('clearOperationError', 'fetchFlashcardById')

            try {
                const flashcard = await adminService.getFlashcardById(flashcardId)
                commit('setSelectedFlashcard', flashcard)
                return flashcard
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas pobierania danych fiszki'
                commit('setOperationError', { operation: 'fetchFlashcardById', error: errorMessage })
                throw error
            } finally {
                commit('setLoadingFlashcardDetail', false)
            }
        },

        /**
         * Utwórz nową fiszkę
         */
        async createFlashcard({ commit }, flashcardData) {
            commit('setLoading', true)
            commit('clearOperationError', 'createFlashcard')

            try {
                const newFlashcard = await adminService.createFlashcard(flashcardData)
                commit('addFlashcard', newFlashcard)
                return newFlashcard
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas tworzenia fiszki'
                commit('setOperationError', { operation: 'createFlashcard', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Zaktualizuj fiszkę
         */
        async updateFlashcard({ commit }, { flashcardId, flashcardData }) {
            commit('setLoading', true)
            commit('clearOperationError', 'updateFlashcard')

            try {
                const updatedFlashcard = await adminService.updateFlashcard(flashcardId, flashcardData)
                commit('updateFlashcard', updatedFlashcard)
                commit('setSelectedFlashcard', updatedFlashcard)
                return updatedFlashcard
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas aktualizacji fiszki'
                commit('setOperationError', { operation: 'updateFlashcard', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Usuń fiszkę
         */
        async deleteFlashcard({ commit }, flashcardId) {
            commit('setLoading', true)
            commit('clearOperationError', 'deleteFlashcard')

            try {
                const result = await adminService.deleteFlashcard(flashcardId)
                commit('removeFlashcard', flashcardId)
                return result
            } catch (error) {
                const errorMessage = error.message || 'Błąd podczas usuwania fiszki'
                commit('setOperationError', { operation: 'deleteFlashcard', error: errorMessage })
                throw error
            } finally {
                commit('setLoading', false)
            }
        },

        /**
         * Ustaw filtry fiszek i pobierz listę od strony 1
         */
        async setFlashcardFiltersAndFetch({ commit, dispatch }, filters) {
            commit('setFlashcardFilters', filters)
            commit('setFlashcardPage', 1)
            return dispatch('fetchFlashcards', { page: 1 })
        },

        /**
         * Wyczyść filtry fiszek
         */
        clearFlashcardFiltersAndFetch({ commit, dispatch }) {
            commit('clearFlashcardFilters')
            commit('setFlashcardPage', 1)
            return dispatch('fetchFlashcards', { page: 1 })
        },

        /**
         * Zmień stronę listy fiszek
         */
        changeFlashcardPage({ dispatch }, page) {
            return dispatch('fetchFlashcards', { page })
        },

        /**
         * Wyczyść zaznaczony użytkownika
         */
        clearSelectedUser({ commit }) {
            commit('clearSelectedUser')
        },

        /**
         * Wyczyść zaznaczoną fiszkę
         */
        clearSelectedFlashcard({ commit }) {
            commit('clearSelectedFlashcard')
        },

        /**
         * Wyczyść wszystkie błędy
         */
        clearErrors({ commit }) {
            commit('clearAllErrors')
        }
    }
}
