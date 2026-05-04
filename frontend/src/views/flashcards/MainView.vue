<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent rozwiązywania testów</h2>
    </div>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div class="row p-2 mb-5">
            <h3 class="text-center">Pytania będą dotyczyć wybranego przez Ciebie obszaru, czyli: <span class="fw-bold">{{ area.name }}</span>. Dodatkowo wybrałeś grupę fiszek z następującej epoki: <span class="fw-bold">{{ era.name }}</span></h3>
        </div>
        <div class="row justify-content-sm-center text-white">
            <div class="bg-info w-50 fs-5 p-5">
                <h4>Krótko o epoce:</h4>
                <p > {{ era.description }}</p>
            </div>
        </div>
        <div v-if="hasActiveFlashcardSession" class="row justify-content-md-center p-3 mt-4">
            <div class="border border-warning w-50 col-6 text-center p-4">
                <h3 class="mb-3 text-warning">
                    Masz aktywną sesję fiszek
                </h3>
                <p class="fs-5">
                    Nie ukończyłeś jeszcze rozpoczętej sesji fiszek dla tej epoki.
                </p>
                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button class="btn btn-warning btn-lg" @click="goToFlashcards">
                        Wróć do fiszek
                    </button>
                    <button class="btn btn-outline-danger" @click="openConfirmModal">
                        Zakończ sesję
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="row text-center mt-5">
            <h4>Przejdź do zestawu fiszek lub wróć aby zmienić epokę historyczną lub obszar geograficzny</h4>
            <div class="d-flex justify-content-center gap-3 p-3">
                <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
                <button class="btn btn-primary" v-on:click="goToFlashcards()">Zaczynamy!</button>
            </div>
        </div>
        <div class="d-flex justify-content-center gap-3 p-3 my-5">
            <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
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