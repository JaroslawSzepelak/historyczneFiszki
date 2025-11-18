<template>
    <div class="row">
        <h2 class=" bg-primary text-center text-white p-3">Główny komponent rozwiązywania testów</h2>
    </div>
    <div v-if="undefinedArea || undefinedEra">
        <div class="row p-4 mb-5">
            <h3 class="text-center">Wystąpił błąd podczas pobierania danych. Prawdopodobnie próbowałes ręcznie wpisać adres URL. Upewnij się, że obszar geograficzny (<span class="fw-bold" v-bind:class="validAreaName">{{ userAreaName }}</span>) oraz epoka historyczna (<span class="fw-bold" v-bind:class="validEraName">{{ userEraName }}</span>) są wpisane poprawnie</h3>
        </div>
        <div class="row text-center mt-5">
            <h4>Popraw adres URL ręcznie lub wróć opcji wyboru epoki historycznej i obszaru geograficznego</h4>
            <div class="d-flex justify-content-center gap-3 p-3">
            <button class="btn btn-primary" v-on:click="$router.push('/testing')">Powrót</button>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="row p-2 mb-5">
            <h3 class="text-center">Pytania będą dotyczyć wybranego przez Ciebie obszaru, czyli: <span class="fw-bold">{{ area }}</span>. Dodatkowo wybrałeś grupę fiszek z następującej epoki: <span class="fw-bold">{{ era.name }}</span></h3>
        </div>
        <div class="row justify-content-md-center text-white">
            <div class="bg-info col-6 fs-5 p-5">
                <h4>Krótko o epoce:</h4>
                <p > {{ era.description }}</p>
            </div>
        </div>
        <div class="row text-center mt-5">
            <h4>Przejdź do zestawu fiszek lub wróć aby zmienić epokę historyczną lub obszar geograficzny</h4>
            <div class="d-flex justify-content-center gap-3 p-3">
            <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
            <button class="btn btn-primary" v-on:click="goToFlashcards()">Zaczynamy!</button>
            </div>
        </div>
    </div>
    

</template>

<script>
    export default {
        data() {
            return {
                userAreaName: this.$route.params.area,
                userEraName: this.$route.params.era, 
                undefinedArea: false,
                undefinedEra: false
            }
        },
        computed: {
            area() {
                return this.$store.state.categories.historyArea;
            },
            era() {
                return this.$store.state.categories.historyEra;
            },
            validAreaName() {
                return this.undefinedArea ? ["text-danger"] : ["text-black"]
            },

            validEraName() {
                return this.undefinedEra ? ["text-danger"] : ["text-black"]
            },
        },
        methods: {
            goToFlashcards() {
                this.$router.push()
            }
        },
        created() {
            let area = this.$store.state.categories.allAreas.find((name) => name == this.userAreaName);
            if(area == undefined) {
                this.undefinedArea = true;
            } else {
                this.$store.commit("categories/setHistoryArea", this.userArea);
                this.undefinedArea = false;
            }

            let era = this.$store.state.categories.allEras.find(({name}) => name == this.userEraName);
            console.log(era);

            if(era == undefined) {
                this.undefinedEra = true;
            } else {
                this.$store.commit("categories/setHistoryEra", era);
                this.undefinedEra = false;
            }
        }
    }
</script>