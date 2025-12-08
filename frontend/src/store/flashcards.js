export default {
    namespaced: true,
    state: {
        accessible: false,
        data: [{
                id: 1,
                area: "polska",
                era: "sredniowiecze",
                question: "W którym roku miał miejsce chrzest Polski?",
                answers: ["1025", "972", "1018", "966"],
                correctAnswer: "966"
            },
            {
                id: 2,
                area: "polska",
                era: "sredniowiecze",
                question: "Kto był pierwszym historycznym władcą Polski?",
                answers: ["Mieszko I", "Bolesław Chrobry", "Kazimierz Odnowiciel", "Siemowit"],
                correctAnswer: "Mieszko I"
            },
            {
                id: 3,
                area: "polska",
                era: "sredniowiecze",
                question: "W którym roku odbyła się bitwa pod Grunwaldem?",
                answers: ["1385", "1410", "1331", "1492"],
                correctAnswer: "1410"
            },
            {
                id: 4,
                area: "polska",
                era: "sredniowiecze",
                question: "Jak nazywa się dynastia, od której wywodzili się pierwsi polscy władcy?",
                answers: ["Piastowie", "Jagiellonowie", "Wazowie", "Habsburgowie"],
                correctAnswer: "Piastowie"
            }
        ]
    },
    getters: {
        shuffledAnswers: (state) => {
            const answers = state.data[0].answers

            const shuffled = [...answers]

            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
            }

            return shuffled
        }
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