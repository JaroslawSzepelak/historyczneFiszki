<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent nauki</h2>
    </div>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div class="row justify-content-md-center p-3">
            <h3 class="col-6 fs-5"><span class="fw-bold">{{ era.name }}</span> - {{ era.description }}</h3>
        </div>
        <div class="row justify-content-md-center p-3">
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
            goToTests() {
                this.$router.push(`/learning/${this.$route.params.area}/${this.$route.params.era}/tests`);
            }
        },
        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>