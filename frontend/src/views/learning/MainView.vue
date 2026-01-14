<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent nauki</h2>
    </div>
    <undefined-era-or-area v-if="undefinedArea || undefinedEra" />
    <div v-else>
        <div class="row justify-content-md-center p-3">
            <p class="col-6 fs-5"><span class="fw-bold">{{ era.name }}</span> - {{ era.description }}</p>
        </div>
        <div class="d-flex justify-content-center gap-3 p-3">
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
        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>