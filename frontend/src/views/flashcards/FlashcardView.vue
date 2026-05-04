<template>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />

    <div v-else>
        <h2 class="bg-primary text-center text-white p-3">
            Fiszki dla obszaru <span class="fw-bold">{{ area.name }}</span> oraz ery <span class="fw-bold">{{ era.name }}</span>
        </h2>

        <div v-if="currentFlashcard" class="row justify-content-center mt-5">
            <div class="col-8 border rounded p-5 text-center">

                <h3 class="mb-4">
                    {{ currentFlashcard.question }}
                </h3>

                <div v-if="hasAnswered" class="alert alert-info mt-4">
                    <strong>Odpowiedź:</strong><br />
                    {{ currentFlashcard.correct_answer }}
                </div>

                <div class="d-flex justify-content-center gap-3 mt-5">
                    <button
                        class="btn btn-success btn-lg"
                        :disabled="hasAnswered"
                        @click="handleAnswer('remember')"
                    >
                        Pamiętam
                    </button>

                    <button
                        class="btn btn-warning btn-lg"
                        :disabled="hasAnswered"
                        @click="handleAnswer('partial')"
                    >
                        Słabo pamiętam
                    </button>

                    <button
                        class="btn btn-danger btn-lg"
                        :disabled="hasAnswered"
                        @click="handleAnswer('forgot')"
                    >
                        Nie pamiętam
                    </button>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-5">
            <button class="btn btn-secondary" @click="$router.back()">
                Wstecz
            </button>

            <button
                class="btn btn-primary"
                :disabled="!hasAnswered"
                @click="nextFlashcard"
            >
                Następna fiszka
            </button>
        </div>
    </div>
</template>

<script>
import categoriesChecker from '@/mixins/categoriesChecker';
import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';
import { flashcardSession } from '@/services/flashcardSession';

const session = flashcardSession();

export default {
    components: {
        UndefinedEraOrArea
    },

    data() {
        return {
            ...session.getInitialState()
        };
    },

    computed: {
        flashcards() {
            return this.$store.state.flashcards.data;
        },

        currentFlashcard() {
            return this.flashcards.length
                ? this.flashcards[this.currentIndex]
                : null;
        },

        area() {
            return this.$store.state.categories.historyArea;
        },

        era() {
            return this.$store.state.categories.historyEra;
        }
    },

    methods: {
        handleAnswer(choice) {
            this.hasAnswered = true;
            this.userChoice = choice;

            session.markAnswered();
            session.saveChoice(choice);

            /*
            LOGIKA KOLEJKI – DO ZROBIENIA PÓŹNIEJ
                ------------------------------------
                remember -> fiszka wypada z kolejki
                partial  -> fiszka wraca na koniec
                forgot   -> fiszka wraca blisko początku
            */
        },

        nextFlashcard() {
            if (this.currentIndex < this.flashcards.length - 1) {
                this.currentIndex++;
                session.saveIndex(this.currentIndex);

                this.hasAnswered = false;
                this.userChoice = null;
                session.resetAnswerState();
            } else {
                alert("To była ostatnia fiszka w tym zestawie!");
                this.resetSession();
                this.$router.back();
            }
        },
        resetSession() {
            this.currentIndex = null;
            this.hasAnswered = false;
            this.userChoice = null;
            session.resetSession();
            this.$store.dispatch("flashcards/resetAccessible");
        }
    },

    created() {
        this.checkArea();
        this.checkEra();

        this.$store.dispatch('flashcards/fetchFlashcards', {
            area: this.$route.params.area,
            era: this.$route.params.era
        });
    },

    watch: {
        flashcards(newVal) {
            if (!newVal.length) return;

            if (this.currentIndex === null) {
                this.currentIndex = 0;
                session.saveIndex(0);
            }

            if (this.currentIndex >= newVal.length) {
                this.currentIndex = 0;
                session.saveIndex(0);
            }
        },
        currentFlashcard(newVal) {
            if (newVal) {
                // zabezpieczenie przed błędnym indeksem
                if (this.currentIndex >= this.flashcards.length) {
                    this.currentIndex = 0;
                    session.saveIndex(0);
                }
            }
        }
    },

    mixins: [categoriesChecker]
};
</script>
