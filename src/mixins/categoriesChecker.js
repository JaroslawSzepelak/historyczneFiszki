export default {
    data() {
        return {
            userAreaName: this.$route.params.area,
            userEraName: this.$route.params.era,
            undefinedArea: false,
            undefinedEra: false
        }
    },

    methods: {
        checkArea() {
            let area = this.$store.state.categories.allAreas.find(({ routeName }) => routeName == this.userAreaName);
            if (area == undefined) {
                this.undefinedArea = true;
            } else {
                this.$store.commit("categories/setHistoryArea", area);
                this.undefinedArea = false;
            }
        },

        checkEra() {
            let era = this.$store.state.categories.allEras.find(({ routeName }) => routeName == this.userEraName);
            if (era == undefined) {
                this.undefinedEra = true;
            } else {
                this.$store.commit("categories/setHistoryEra", era);
                this.undefinedEra = false;
            }
        }
    }
}