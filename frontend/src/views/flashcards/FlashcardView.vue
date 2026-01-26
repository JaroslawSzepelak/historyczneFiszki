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

export default {
    components: {
        UndefinedEraOrArea
    },

    data() {
        return {
            currentIndex: Number(sessionStorage.getItem('flashcardIndex')) || 0,
            hasAnswered: sessionStorage.getItem('flashcardHasAnswered') === 'true',
            userChoice: sessionStorage.getItem('flashcardChoice') || null
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
            // zapis wyboru użytkownika
            this.hasAnswered = true;
            this.userChoice = choice;

            sessionStorage.setItem('flashcardHasAnswered', true);
            sessionStorage.setItem('flashcardChoice', choice);

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

                // zapis nowego indeksu
                sessionStorage.setItem(
                    'flashcardIndex',
                    this.currentIndex
                );

                // reset stanu odpowiedzi
                this.hasAnswered = false;
                this.userChoice = null;

                sessionStorage.removeItem('flashcardHasAnswered');
                sessionStorage.removeItem('flashcardChoice');
            } else {
                alert("To była ostatnia fiszka w tym zestawie!");

                // czyszczenie sesji nauki
                sessionStorage.removeItem('flashcardIndex');
                sessionStorage.removeItem('flashcardHasAnswered');
                sessionStorage.removeItem('flashcardChoice');

                this.$router.back();
            }
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
        currentFlashcard(newVal) {
            if (newVal) {
                // zabezpieczenie przed błędnym indeksem
                if (this.currentIndex >= this.flashcards.length) {
                    this.currentIndex = 0;
                    sessionStorage.setItem('flashcardIndex', 0);
                }
            }
        }
    },

    mixins: [categoriesChecker]
};
</script>
