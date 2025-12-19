<template>
    <div>
        <div class="row p-4 mb-5">
            <h3 class="text-center">Wystąpił błąd podczas pobierania danych. Prawdopodobnie próbowałes ręcznie wpisać adres URL. Upewnij się, że obszar geograficzny (<span class="fw-bold" v-bind:class="validAreaName">{{ userAreaName }}</span>) oraz epoka historyczna (<span class="fw-bold" v-bind:class="validEraName">{{ userEraName }}</span>) są wpisane poprawnie</h3>
        </div>
        <div class="row justify-content-sm-center text-white">
            <div class="bg-warning col-6 fs-5 p-5">
                <h4>Upewnij się, że podałeś właściwe nazwy w adresie URL:</h4>
                <ul>
                    <li>Dla obszaru geograficznego dostępne nazwy w URL to: {{ allAreasRouteNamesString }}</li>
                    <li>Dla epoki historycznej dostępne nazwy w URL to: {{ allErasRouteNamesString }}</li>
                </ul>
            </div>
        </div>
        <div class="row text-center mt-5">
            <h4>Popraw adres URL ręcznie lub wróć opcji wyboru epoki historycznej i obszaru geograficznego. Możesz również wrócić do strony głownej</h4>
            <div class="d-flex justify-content-center gap-3 p-3">
            <button class="btn btn-primary" v-on:click="$router.push('/testing')">Powrót do opcji wyboru</button>
            <button class="btn btn-secondary" v-on:click="$router.push('/')">Powrót do strony głównej</button>
            </div>
        </div>
    </div>
</template>

<script>
    import categoriesChecker from '@/mixins/categoriesChecker';
    export default {
        computed: {
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
            }
        },

        mixins: [categoriesChecker]
    }
</script>