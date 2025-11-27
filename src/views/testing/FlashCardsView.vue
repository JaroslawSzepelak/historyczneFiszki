<template>
    <h2 class="bg-info text-center text-white p-3">Zestaw pytań dla <span class="fw-bold">{{ area.name }}-{{ era.name }}</span></h2>
    <h3 class="text-center"></h3>
</template>

<script>
    import categoriesChecker from '@/mixins/categoriesChecker';
    export default {
        computed: {
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
        },

        created() {
            this.checkArea();
            this.checkEra();
        },

        mixins: [categoriesChecker]
    }
</script>