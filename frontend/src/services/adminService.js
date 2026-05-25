import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/admin'

class AdminService {
    /**
     * Pobierz listę użytkowników
     * @param {Object} options - opcje filtrowania
     * @param {number} options.page - numer strony (default: 1)
     * @param {number} options.limit - ilość rekordów na stronę (default: 50)
     * @param {string} options.search - wyszukiwanie po email/username/imie/nazwisko
     * @param {string} options.status - filtrowanie po statusie (active/inactive/banned)
     * @param {boolean} options.isAdmin - filtrowanie po roli
     */
    async getUsers(options = {}) {
        try {
            const params = new URLSearchParams()
            if (options.page) params.append('page', options.page)
            if (options.limit) params.append('limit', options.limit)
            if (options.search) params.append('search', options.search)
            if (options.status) params.append('status', options.status)
            // Only append isAdmin when it's explicitly provided and not an empty string
            if (options.isAdmin !== undefined && options.isAdmin !== '') params.append('isAdmin', options.isAdmin)

            const response = await axios.get(`${API_BASE_URL}/users?${params.toString()}`, {
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Pobierz szczegóły użytkownika
     * @param {number} userId - ID użytkownika
     */
    async getUserById(userId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
                withCredentials: true
            })
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Aktualizuj dane użytkownika
     * @param {number} userId - ID użytkownika
     * @param {Object} userData - dane do aktualizacji
     */
    async updateUser(userId, userData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
                withCredentials: true
            })
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Usuń użytkownika
     * @param {number} userId - ID użytkownika
     */
    async deleteUser(userId) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/users/${userId}`, {
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Zmień status użytkownika
     * @param {number} userId - ID użytkownika
     * @param {string} status - nowy status (active/inactive/banned)
     */
    async changeUserStatus(userId, status) {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${userId}/status`,
                { status },
                { withCredentials: true }
            )
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Przełącz rolę administratora
     * @param {number} userId - ID użytkownika
     * @param {boolean} isAdmin - czy ma byc admin
     */
    async toggleAdminRole(userId, isAdmin) {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${userId}/admin`,
                { isAdmin },
                { withCredentials: true }
            )
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Resetuj hasło użytkownika
     * @param {number} userId - ID użytkownika
     * @param {string} password - nowe hasło
     */
    async resetUserPassword(userId, password) {
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/users/${userId}/password`,
                { password },
                { withCredentials: true }
            )
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Pobierz statystyki użytkowników
     */
    async getStats() {
        try {
            const response = await axios.get(`${API_BASE_URL}/stats`, {
                withCredentials: true
            })
            return response.data
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Utwórz nowego użytkownika
     * @param {Object} userData - dane nowego użytkownika
     */
    async createUser(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/users`, userData, {
                withCredentials: true
            })
            return response.data.user
        } catch (error) {
            throw this._handleError(error)
        }
    }

    /**
     * Prywatna metoda do obsługi błędów
     */
    _handleError(error) {
        if (error.response) {
            const message = error.response.data?.error || `Błąd ${error.response.status}`
            const apiError = new Error(message)
            apiError.status = error.response.status
            apiError.data = error.response.data
            return apiError
        } else if (error.request) {
            return new Error('Brak odpowiedzi z serwera')
        } else {
            return error
        }
    }
}

export default new AdminService()
