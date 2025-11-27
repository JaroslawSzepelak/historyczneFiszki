import { loadRouteLocation } from "vue-router";

export default {
    namespaced: true,
    state: {
        accessible: false
    },
    getters: {

    },
    mutations: {
        setAccessible(state, value) {
            state.accessible = value;
        }
    },
    actions: {
        loadAccesible(context) {
            let accessibleValue = sessionStorage.getItem("flashcardAccessible");
            if (accessibleValue) {
                context.commit("setAccessible", JSON.parse(accessibleValue));
            }
        },

        storeAccessible(context) {
            sessionStorage.setItem("flashcardAccessible", JSON.stringify(context.state.accessible));
        },

        resetAccessible(context) {
            sessionStorage.setItem("flashcardAccessible", false);
        }
    },
    modules: {}
}