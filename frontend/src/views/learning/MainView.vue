<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent nauki</h2>
    </div>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div class="row justify-content-md-center p-3">
            <h3 class="col-6 fs-5"><span class="fw-bold">{{ era.name }}</span> - {{ era.description }}</h3>
        </div>
        <div v-if="hasActiveTestSession" class="row justify-content-md-center p-3">
            <div class="border border-warning w-50 col-6 text-center p-4">
                <h3 class="mb-3 text-warning">
                    Masz aktywną sesję testową
                </h3>

                <p class="fs-5">
                    Nie ukończyłeś jeszcze rozpoczętego testu dla tej epoki.
                </p>

                <div class="d-flex justify-content-center gap-3 mt-4">
                    <button
                        class="btn btn-warning btn-lg"
                        @click="goToTests"
                    >
                        Wróć do testu
                    </button>

                    <button
                        class="btn btn-outline-danger"
                        @click="resetTestSession"
                    >
                        Zakończ test
                    </button>
                </div>
            </div>
        </div>
        <div v-else class="row justify-content-md-center p-3">
            <div class="border w-50 col-6 text-center p-4">
                <h3 class="mb-4">Wybierz sposób nauki dla wybranej epoki historycznej:</h3>
                <div class="d-flex justify-content-center gap-3 p-3">
                    <button class="btn btn-primary btn-lg" v-on:click="goToReading()">Czytaj treści</button>
                    <button class="btn btn-success btn-lg" v-on:click="goToTests()">Rozwiązuj testy</button>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center gap-3 p-3 my-5">
            <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
        </div>
    </div>
</template>

<script>
import categoriesChecker from '@/mixins/categoriesChecker';
import UndefinedEraOrArea from '@/components/UndefinedEraOrArea.vue';
import { testSession } from '@/services/testSession';

const session = testSession();

export default {
    components: {
        UndefinedEraOrArea
    },

    computed: {
        area() {
            return this.$store.state.categories.historyArea;
        },

        era() {
            return this.$store.state.categories.historyEra;
        },

        hasActiveTestSession() {
            const state = session.getInitialState();
            return state.currentIndex !== null;
        }
    },

    methods: {
        goToTests() {
            const path = `/learning/${this.$route.params.area}/${this.$route.params.era}/tests`;
            this.$router.push(path);
        },

        goToReading() {
            const path = `/learning/${this.$route.params.area}/${this.$route.params.era}/reading`;
            this.$router.push(path);
        },

        resetTestSession() {
            session.resetSession();
        }
    },

    created() {
        this.checkArea();
        this.checkEra();
    },

    mixins: [categoriesChecker]
};
</script>