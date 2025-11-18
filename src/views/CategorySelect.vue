<template>
    <div class="text-center">
        <h2 class="bg-info text-center text-white p-3 m-0">
            {{ isTesting ? "Testy" : "Nauka" }}
        </h2>
        <div class="bg-light p-5">
            <h3 class="mb-4">Wybierz interesujący Cię obszar geograficzny:</h3>
            <div v-for="(area, i) in allHistoryAreas" v-bind:key="area" class="form-check d-grid gap-2 col-2 mx-auto">
              <input type="radio" class="btn-check" v-model="historyArea" v-bind:value="area" v-bind:id="'area' + i" autocomplete="off" v-on:change="resetHistoryEra"/>
              <label class="btn btn-outline-primary btn-lg mb-2" v-bind:for="'area' + i">{{ area }}</label>
            </div>
        </div>
        <div v-if="showEraContainer" class="p-5">
            <h3 class="mb-4">Wybierz interesującą Cię epokę historyczną:</h3>
            <div v-for="(era, i) in activeEras" v-bind:key="era.name" class="form-check d-grid gap-2 col-2 mx-auto">
              <input type="radio" class="btn-check" v-model="historyEra" v-bind:value="era" v-bind:id="'era' + i" autocomplete="off"/>
              <label class="btn btn-outline-primary btn-lg mb-2" v-bind:for="'era' + i">{{ era.name }}</label>
            </div>
        </div>
        <div class="d-flex justify-content-center gap-3 p-3">
          <button class="btn btn-secondary" v-on:click="$router.back()">Wstecz</button>
          <button class="btn btn-primary" v-on:click="goForward" v-bind:disabled="!canGoForward">Dalej</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isTesting: false,
      //allHistoryAreas: ["Polska", "Świat", "Wszystko"],
      //allEras: ["Prehistoria", "Starożytność", "Średniowiecze", "Nowożytność", "XIX wiek", "XX wiek", "Współczesność"],
      //historyArea: "",
      //historyEra: ""

    }
  },

  computed: {
    allHistoryAreas() {
      return this.$store.state.categories.allAreas
    },
    allEras() {
      return this.$store.state.categories.allEras
    },
    historyArea: {
      get() {
        return this.$store.state.categories.historyArea
      },
      set(value) {
        this.$store.commit("categories/setHistoryArea", value)
      }
    },
    historyEra: {
      get() {
        return this.$store.state.categories.historyEra
      },
      set(value) {
        this.$store.commit("categories/setHistoryEra", value)
      }
    },
    showEraContainer() {
      return this.historyArea == "" ? false : true;
    },

    activeEras() {
      return this.historyArea == "Polska" ? this.allEras.slice(2) : this.allEras;
    },

    canGoForward() {
      return this.historyArea != "" && this.historyEra != {} ? true : false
    }
  },

  methods: {
    resetHistoryEra() {
      this.$store.commit("categories/setHistoryEra", {});
    },

    goForward() {
      if (this.canGoForward) {
        console.log(this.$route.path);
        this.$router.push(`${this.$route.path}/${this.historyArea}/${this.historyEra.name}`);
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    this.$store.commit("categories/setHistoryArea", "");
    this.$store.commit("categories/setHistoryEra", {});
  },
  
  created() {
    if (this.$route.params.op == "testing") {
        this.isTesting = true;
    } else {
        this.isTesting = false;
    }
  }
}
</script>