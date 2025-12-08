<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent nauki</h2>
    </div>
    <div class="row justify-content-md-center p-3">
        <p class="col-6 fs-5"><span class="fw-bold">{{ era.name }}</span> - {{ era.description }}</p>
    </div>
    <div class="d-flex justify-content-center gap-3 p-3">
          <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
    </div>
</template>

<script>
    export default {
        computed: {
            era() {
                return this.$store.state.categories.historyEra;
            }
        },
        created() {
            this.$store.commit("categories/setHistoryArea", this.$route.params.area);

            let eraName = this.$route.params.era;
            let era = this.$store.state.categories.allEras.find(({name}) => name == eraName);
            this.$store.commit("categories/setHistoryEra", era);
        }
    }
</script>