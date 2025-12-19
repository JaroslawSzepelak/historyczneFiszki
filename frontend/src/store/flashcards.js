import axios from "axios";

export default {
    namespaced: true,
    state: {
        accessible: false,
        data: []
    },
    getters: {
        shuffledAnswers: (state) => (index = 0) => {
            if (!state.data[index]) return [];
            const answers = state.data[index].answers;
            const shuffled = [...answers];

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            return shuffled;
        }
    },

    mutations: {
        setAccessible(state, value) {
            state.accessible = value;
        },
        setFlashcards(state, flashcards) {
            state.data = flashcards;
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
        },
        async fetchFlashcards({ commit }, { area, era }) {
            try {
                const response = await axios.get("http://localhost:3000/api/flashcards", {
                    params: { area, era }
                });

                commit("setFlashcards", response.data);
            } catch (error) {
                console.error("Błąd pobierania fiszek:", error);
            }
        }
    },
    modules: {}
}