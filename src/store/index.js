import { createStore } from 'vuex'
import categories from './categories'
import flashcards from './flashcards'

export default createStore({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
    modules: {
        categories,
        flashcards
    }
})