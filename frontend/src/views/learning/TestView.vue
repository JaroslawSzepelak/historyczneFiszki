<template>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div v-if="currentFlashcard">
            <h2 class="bg-info text-center text-white p-3">Zestaw pytań dla <span class="fw-bold">{{ area.name }}-{{ era.name }}</span></h2>
            <div class="row justify-content-sm-center">
                <div class="border w-50 p-5 mt-5 text-center">
                    <h3 class="text-center">{{ currentFlashcard.question }}</h3>
                    <div class="form check d-flex justify-content-sm-center gap-4 m-5">
                        <test-answer-button v-for="(answer, i) in shuffledAnswers" v-bind:key="answer"
                            v-model:user-answer="userAnswer" 
                            :user-answer="userAnswer"
                            :button-answer="answer"
                            :answer-id="'answer' + i"
                            :button-class="answerButtonClass(answer)"
                            :disabled="isChecked"
                        />
                    </div>
                    <button 
                        @click="checkAnswer" 
                        class="btn btn-primary btn-lg"
                        :disabled="!hasSelectedAnswer"
                    >
                        Sprawdź
                    </button>
                </div>
            </div>
            <div class="d-flex justify-content-center gap-3 m-5">
                <button class="btn btn-secondary" v-on:click="goBack">Wstecz</button>
                <button class="btn btn-primary" v-on:click="nextFlashcard" v-bind:disabled="!isChecked">Następne pytanie</button>
            </div>
        </div>
        <div v-else class="text-center mt-5">
            <strong>Ładowanie pytań...</strong>
        </div>
    </div>
</template>

<script>
import categoriesChecker from '@/mixins/categoriesChecker';
import TestAnswerButton from '@/components/TestAnswerButton.vue';
import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';
import { testSession } from '@/services/testSession';

const session = testSession();

export default {

    components: {
        TestAnswerButton,
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
            if (!this.flashcards.length) return null;
            if (this.currentIndex === null) return null;
            if (this.currentIndex >= this.flashcards.length) return null;

            return this.flashcards[this.currentIndex];
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

        hasSelectedAnswer() {
            return this.userAnswer !== '';
        },

        answerButtonClass() {
            return (answer) => {
                if (!this.isChecked) return 'btn-outline-primary'  

                if (answer === this.currentFlashcard.correct_answer) {
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

        currentIndex(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.resetAnswerState();
            }
        }
    },

    methods: {
        checkAnswer() {
            session.saveAnswer(this.userAnswer);
            session.markChecked();
            this.isChecked = true;
        },

        nextFlashcard() {
            if (this.currentIndex < this.flashcards.length - 1) {
                this.currentIndex++;
                session.saveIndex(this.currentIndex);
            } else {
                alert("To była ostatnia fiszka w tym zestawie!");
                this.resetSession();
                this.$router.back();
            }
        },

        resetAnswerState() {
            this.userAnswer = '';
            this.isChecked = false;
            session.resetAnswerState();
        },

        resetSession() {
            this.currentIndex = null;
            this.resetAnswerState();
            session.resetSession();
        },

        goBack() {
            this.$router.back();
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

    mixins: [categoriesChecker]
};
</script>