import { createStore } from 'vuex'
import categories from './categories'
import flashcards from './flashcards'
import auth from './auth'
import admin from './admin'

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        categories,
        flashcards,
        auth,
        admin
    }
})