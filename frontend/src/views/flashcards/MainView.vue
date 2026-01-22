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
        <div class="row text-center mt-5">
            <h4>Przejdź do zestawu fiszek lub wróć aby zmienić epokę historyczną lub obszar geograficzny</h4>
            <div class="d-flex justify-content-center gap-3 p-3">
                <button class="btn btn-secondary" v-on:click="$router.push('/testing')">Wstecz</button>
                <button class="btn btn-primary" v-on:click="goToFlashcards()">Zaczynamy!</button>
            </div>
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
        computed: {
            area() {
                return this.$store.state.categories.historyArea;
            },
            era() {
                return this.$store.state.categories.historyEra;
            }
        },
        methods: {
            goToFlashcards() {
                this.$store.commit("flashcards/setAccessible", true);
                this.$router.push(`/flashcards/${this.$route.params.area}/${this.$route.params.era}/flashcard`);
            },
        },
        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>