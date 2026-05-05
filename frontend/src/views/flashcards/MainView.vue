<template>
    <div class="flashcards-main">
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Fiszki</h2>
    </div>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else class="container py-4 py-lg-5">
        <div class="row p-2 mb-4">
            <h3 class="text-center">Pytania będą dotyczyć wybranego przez Ciebie obszaru, czyli: <span class="fw-bold">{{ area.name }}</span>. Dodatkowo wybrałeś grupę fiszek z następującej epoki: <span class="fw-bold">{{ era.name }}</span></h3>
        </div>
        <div class="row justify-content-center align-items-stretch mb-4">
            
            <!-- LEWA STRONA -->
            <div class="col-12 col-lg-5 text-white mb-3 mb-lg-0">
                <div class="info-card h-100 fs-5 p-4 p-lg-5">
                    <h4>Krótko o epoce:</h4>
                    <p>{{ era.description }}</p>
                </div>
            </div>

            <!-- PRAWA STRONA -->
            <div class="col-12 col-lg-5">
                
                <div v-if="hasActiveFlashcardSession" class="active-session-card border border-warning text-center p-4 p-lg-5 h-100">
                    <h3 class="mb-3 text-warning">
                        Masz aktywną sesję fiszek
                    </h3>
                    <p class="fs-5">
                        Nie ukończyłeś jeszcze rozpoczętej sesji fiszek dla tej epoki.
                    </p>
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button class="btn btn-warning btn-lg action-btn" @click="goToFlashcards">
                            Wróć do fiszek
                        </button>
                        <button class="btn btn-outline-danger action-btn" @click="openConfirmModal">
                            Zakończ sesję
                        </button>
                    </div>
                </div>
                <div v-else class="start-card text-center p-4 p-lg-5 h-100 d-flex flex-column justify-content-center align-items-center">
                    <h4>
                        Przejdź do zestawu fiszek lub wróć aby zmienić epokę historyczną lub obszar geograficzny
                    </h4>
                    <div class="d-flex flex-column flex-md-row justify-content-center gap-3 p-3 mt-5">
                        <button class="btn btn-secondary action-btn" @click="$router.back()">Wróć</button>
                        <button class="btn btn-primary action-btn" @click="goToFlashcards()">Przejdź do fiszek</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <confirm-end-test-modal
        :visible="showConfirmModal"
        title="Zakończyć sesję fiszek?"
        message="Czy na pewno chcesz zakończyć bieżącą sesję fiszek?"
        confirm-label="Tak, zakończ"
        @cancel="showConfirmModal = false"
        @confirm="handleConfirmEnd"
    />
    <test-ended-modal
        :visible="showEndedModal"
        title="Sesja fiszek zakończona"
        message="Sesja fiszek została zakończona. Nastąpi powrót do strony głównej."
        @ok="handleFinalRedirect"
    />
    </div>
</template>

<script>
    import categoriesChecker from '@/mixins/categoriesChecker';
    import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';
    import { flashcardSession } from '@/services/flashcardSession';
    import ConfirmEndTestModal from '@/components/modals/ConfirmEndTestModal.vue';
    import TestEndedModal from '@/components/modals/TestEndedModal.vue';

    const session = flashcardSession();

    export default {
        components: {
            UndefinedEraOrArea,
            ConfirmEndTestModal,
            TestEndedModal
        },
        data() {
            return {
                showConfirmModal: false,
                showEndedModal: false
            };
        },
        computed: {
            area() {
                return this.$store.state.categories.historyArea;
            },
            era() {
                return this.$store.state.categories.historyEra;
            },
            hasActiveFlashcardSession() {
                const state = session.getInitialState();
                return state.currentIndex !== null;
            }
        },
        methods: {
            goToFlashcards() {
                this.$store.commit("flashcards/setAccessible", true);
                this.$router.push(`/flashcards/${this.$route.params.area}/${this.$route.params.era}/flashcard`);
            },
            openConfirmModal() {
                this.showConfirmModal = true;
            },
            handleConfirmEnd() {
                this.showConfirmModal = false;
                session.resetSession();
                this.$store.dispatch("flashcards/resetAccessible");
                this.showEndedModal = true;
            },
            handleFinalRedirect() {
                this.showEndedModal = false;
                this.$router.push('/');
            }
        },
        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>

<style scoped>
.flashcards-main {
    background: linear-gradient(180deg, #f8fbff 0%, #ffffff 42%);
    min-height: calc(100vh - 160px);
}

.info-card {
    background: #0dcaf0;
    border-radius: 1rem;
    box-shadow: 0 12px 30px rgba(13, 202, 240, 0.24);
}

.active-session-card,
.start-card {
    background: #ffffff;
    border-radius: 1rem;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.action-btn {
    min-width: 170px;
    min-height: 46px;
    font-weight: 600;
}

@media (max-width: 768px) {
    .flashcards-main {
        min-height: auto;
    }

    .action-btn {
        width: 100%;
        min-width: 0;
    }
}
</style>