<template>
    <h2 class="bg-info text-center text-white p-3">Zestaw pytań dla <span class="fw-bold">{{ area.name }}-{{ era.name }}</span></h2>
    <div class="row justify-content-sm-center">
        <div class="border w-50 p-5 mt-5 text-center">
            <h3 class="text-center">{{flashcards[0].question}}</h3>
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
          <button class="btn btn-primary" v-on:click="goForward" v-bind:disabled="!isChecked">Następne pytanie</button>
    </div>
</template>

<script>
    import categoriesChecker from '@/mixins/categoriesChecker';
    import FlashcardAnswerButton from '@/components/FlashcardAnswerButton.vue';

    export default {

        components: {
            FlashcardAnswerButton
        },
        data() {
            return {
                userAnswer: "",
                isChecked: false
            }
        },
        computed: {
            flashcards() {
                return this.$store.state.flashcards.data;
            },
            shuffledAnswers() {
                return this.$store.getters['flashcards/shuffledAnswers']
            },
            area() {
                return this.$store.state.categories.historyArea;
            },
            era() {
                return this.$store.state.categories.historyEra;
            },
            allAreasRouteNamesString() {
                return this.$store.getters['categories/allAreasRouteNamesString'];
            },
            allErasRouteNamesString() {
                return this.$store.getters['categories/allErasRouteNamesString'];
            },
            validAreaName() {
                return this.undefinedArea ? ["text-danger"] : ["text-black"]
            },

            validEraName() {
                return this.undefinedEra ? ["text-danger"] : ["text-black"]
            },
            correctAnswer() {
                return this.userAnswer == this.flashcards[0].correctAnswer ? true : false
            },
            answerButtonClass() {
                return (answer) => {
                    if (!this.isChecked) return 'btn-outline-primary'  

                    if (answer === this.flashcards[0].correctAnswer) {
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
            }
        },

        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>