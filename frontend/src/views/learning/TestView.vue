<template>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else class="test-view">
        <div v-if="currentFlashcard">
            <h2 class="bg-info text-center text-white p-3">Zestaw pytań dla <span class="fw-bold">{{ area.name }}-{{ era.name }}</span></h2>
            <div class="row justify-content-center mt-4">
                <div class="col-11 col-lg-9 col-xl-8 test-card border rounded p-4 p-lg-5">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge text-bg-light fs-6">
                            Pytanie {{ currentQuestionNumber }} / {{ totalQuestions }}
                        </span>
                        <span class="small text-muted">
                            Postęp: {{ progressPercentage }}%
                        </span>
                    </div>
                    <div class="progress mb-4" role="progressbar" :aria-valuenow="progressPercentage" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                    </div>

                    <h3 class="text-center">{{ currentFlashcard.question }}</h3>
                    <p class="text-center text-muted mb-4">
                        {{ isChecked ? "Sprawdź wynik i przejdź dalej." : "Wybierz jedną odpowiedź i sprawdź wynik." }}
                    </p>

                    <div class="answers-section form check d-flex flex-wrap justify-content-sm-center gap-3 mb-4">
                        <test-answer-button v-for="(answer, i) in shuffledAnswers" v-bind:key="answer"
                            v-model:user-answer="userAnswer" 
                            :user-answer="userAnswer"
                            :button-answer="answer"
                            :answer-id="'answer' + i"
                            :button-class="answerButtonClass(answer)"
                            :disabled="isChecked"
                        />
                    </div>
                    <div class="primary-actions d-flex justify-content-center gap-3">
                        <button 
                            @click="checkAnswer" 
                            class="btn btn-primary btn-lg action-btn"
                            :disabled="!hasSelectedAnswer || isChecked"
                        >
                            Sprawdź odpowiedź
                        </button>
                        <button class="btn btn-outline-danger btn-lg action-btn" @click="openConfirmModal">
                            Przerwij test
                        </button>
                    </div>
                </div>
            </div>
            <div class="secondary-actions d-flex justify-content-center gap-3 m-5">
                <button class="btn btn-secondary action-btn" v-on:click="goBack">Wstecz</button>
                <button class="btn btn-primary action-btn" v-on:click="nextFlashcard" v-bind:disabled="!isChecked">
                    {{ isLastQuestion ? "Zakończ test" : "Następne pytanie" }}
                </button>
            </div>
        </div>
        <div v-else class="text-center mt-5">
            <strong>Ładowanie pytań...</strong>
        </div>
    </div>
    <confirm-end-test-modal
        :visible="showConfirmModal"
        @cancel="showConfirmModal = false"
        @confirm="handleConfirmEnd"
    />
    <test-ended-modal
        :visible="showEndedModal"
        title="Test zakończony"
        message="Ukończyłeś wszystkie pytania w tym zestawie."
        @ok="handleFinalRedirect"
    />
</template>

<script>
import categoriesChecker from '@/mixins/categoriesChecker';
import TestAnswerButton from '@/components/TestAnswerButton.vue';
import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';
import { testSession } from '@/services/testSession';
import ConfirmEndTestModal from '@/components/modals/ConfirmEndTestModal.vue';
import TestEndedModal from '@/components/modals/TestEndedModal.vue';

const session = testSession();

export default {

    components: {
        TestAnswerButton,
        UndefinedEraOrArea,
        ConfirmEndTestModal,
        TestEndedModal
    },

    data() {
        return {
            ...session.getInitialState(),
            showConfirmModal: false,
            showEndedModal: false
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

        totalQuestions() {
            return this.flashcards.length;
        },

        currentQuestionNumber() {
            return this.currentIndex === null ? 0 : this.currentIndex + 1;
        },

        progressPercentage() {
            if (!this.totalQuestions || this.currentIndex === null) return 0;
            return Math.round((this.currentQuestionNumber / this.totalQuestions) * 100);
        },

        isLastQuestion() {
            if (!this.totalQuestions || this.currentIndex === null) return false;
            return this.currentIndex === this.totalQuestions - 1;
        },

        answerButtonClass() {
            return (answer) => {
                if (!this.isChecked) {
                    return answer === this.userAnswer ? 'btn-primary' : 'btn-outline-primary';
                }

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

    methods: {
        checkAnswer() {
            session.saveAnswer(this.userAnswer);
            session.markChecked();
            this.isChecked = true;
        },

        openConfirmModal() {
            this.showConfirmModal = true;
        },

        handleConfirmEnd() {
            this.showConfirmModal = false;
            this.resetSession();
            this.$router.back();
        },

        handleFinalRedirect() {
            this.showEndedModal = false;
            this.resetSession();
            this.$router.back();
        },

        nextFlashcard() {
            if (this.currentIndex < this.flashcards.length - 1) {
                this.currentIndex++;
                session.saveIndex(this.currentIndex);
            } else {
                this.showEndedModal = true;
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

    mixins: [categoriesChecker]
};
</script>

<style scoped>
.test-view {
    padding-bottom: 2rem;
}

.test-card {
    background-color: #ffffff;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.answers-section {
    padding: 1rem 0.5rem;
}

.primary-actions {
    margin-top: 3rem;
    padding-top: 0.75rem;
}

.secondary-actions {
    margin-top: 2.25rem;
}

.action-btn {
    min-width: 180px;
    min-height: 46px;
    font-weight: 600;
    letter-spacing: 0.01em;
}

@media (max-width: 768px) {
    .primary-actions,
    .secondary-actions {
        flex-direction: column;
        align-items: stretch;
    }

    .action-btn {
        width: 100%;
        min-width: 0;
    }
}
</style>