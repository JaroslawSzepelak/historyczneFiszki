<template>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div v-if="currentFlashcard">
            <h2 class="bg-info text-center text-white p-3">Zestaw pytań dla <span class="fw-bold">{{ area.name }}-{{ era.name }}</span></h2>
            <div class="row justify-content-sm-center">
                <div class="border w-50 p-5 mt-5 text-center">
                    <h3 class="text-center">{{ currentFlashcard.question }}</h3>
                    <div class="form check d-flex justify-content-sm-center gap-4 m-5">
                        <flashcard-answer-button v-for="(answer, i) in shuffledAnswers" v-bind:key="answer"
                            v-model:user-answer="userAnswer" 
                            :user-answer="userAnswer"
                            :button-answer="answer"
                            :answer-id="'answer' + i"
                            :button-class="answerButtonClass(answer)"
                            :disabled="isChecked"
                        />
                    </div>
                    <button @click="checkAnswer" class="btn btn-primary btn-lg">
                        Sprawdź
                    </button>
                </div>
            </div>
            <div class="d-flex justify-content-center gap-3 m-5">
                <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
                <button class="btn btn-primary" v-on:click="nextFlashcard" v-bind:disabled="!isChecked">Następne pytanie</button>
            </div>
        </div>
        <div v-else class="text-center mt-5">
            <strong>Ładowanie fiszek...</strong>
        </div>
    </div>
</template>

<script>
    import categoriesChecker from '@/mixins/categoriesChecker';
    import FlashcardAnswerButton from '@/components/FlashcardAnswerButton.vue';
    import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';

    export default {

        components: {
            FlashcardAnswerButton,
            UndefinedEraOrArea
        },
        data() {
            return {
                userAnswer: "",
                isChecked: false,
                currentIndex: 0
            }
        },
        computed: {
            flashcards() {
                return this.$store.state.flashcards.data;
            },
            currentFlashcard() {
                return this.flashcards.length > 0 ? this.flashcards[this.currentIndex] : null;
            },
            shuffledAnswers() {
                return this.$store.getters['flashcards/shuffledAnswers'](this.currentIndex);
            },
            area() {
                return this.$store.state.categories.historyArea;
            },
            era() {
                return this.$store.state.categories.historyEra;
            },
            correctAnswer() {
                return this.userAnswer === this.currentFlashcard?.correctAnswer;
            },
            answerButtonClass() {
                return (answer) => {
                    if (!this.isChecked) return 'btn-outline-primary'  

                    if (answer === this.currentFlashcard.correctAnswer) {
                        return 'btn-success'
                    }

                    if (answer === this.userAnswer) {
                        return 'btn-outline-danger'
                    }
                   /*
                    if (answer === this.userAnswer && answer === this.flashcards[0].correctAnswer) {
                        return 'btn-outline-success'
                    }

                    if (answer === this.userAnswer && answer !== this.flashcards[0].correctAnswer) {
                        return 'btn-outline-danger'
                    }
                        */

                    return 'btn-outline-primary'
                }
            }
        },

        methods: {
            checkAnswer() {
                this.isChecked = true;

                if(this.correctAnswer) {
                    console.log("Prawidłowa odpowiedź")
                } else {
                    console.log("Nieprawidłowa odpowiedź")
                }
            },
            nextFlashcard() {
                if (this.currentIndex < this.flashcards.length - 1) {
                    this.currentIndex++;
                    this.userAnswer = "";    // reset odpowiedzi
                    this.isChecked = false;  // reset przycisku Sprawdź
                } else {
                    // koniec zestawu - np. powrót lub komunikat
                    alert("To była ostatnia fiszka w tym zestawie!");
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

            console.log(this.currentFlashcard)
        },

        mixins: [categoriesChecker]
    }
</script>