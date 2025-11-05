<template>
    <div class="text-center">
        <h2 class="bg-info text-center text-white p-3 m-0">
            {{ isTesting ? "Testy" : "Nauka" }}
        </h2>
        <div class="bg-light p-5">
            <h3 class="mb-4">Wybierz interesujący Cię zakres historii:</h3>
            <div v-for="(n, i) in allHistoryAreas" v-bind:key="n" class="form-check d-grid gap-2 col-2 mx-auto">
              <input type="radio" class="btn-check" v-model="historyArea" v-bind:value="n" v-bind:id="'area' + i" autocomplete="off" v-on:change="resetHistoryEra"/>
              <label class="btn btn-outline-primary btn-lg mb-2" v-bind:for="'area' + i">{{ n }}</label>
            </div>
        </div>
        <div v-if="showEraContainer" class="p-5">
            <h3 class="mb-4">Wybierz interesującą Cię epokę historyczną:</h3>
            <div v-for="(n, i) in activeEras" v-bind:key="n" class="form-check d-grid gap-2 col-2 mx-auto">
              <input type="radio" class="btn-check" v-model="historyEra" v-bind:value="n" v-bind:id="'era' + i" autocomplete="off"/>
              <label class="btn btn-outline-primary btn-lg mb-2" v-bind:for="'era' + i">{{ n }}</label>
            </div>
        </div>
        <div class="p-3">
          <button class="btn btn-primary" v-on:click="$router.back()">Wstecz</button>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isTesting: false,
      allHistoryAreas: ["Polska", "Świat", "Wszystko"],
      allEras: ["Prehistoria", "Starożytność", "Średniowiecze", "Nowożytność", "XIX wiek", "XX wiek", "Współczesność"],
      historyArea: "",
      historyEra: ""

    }
  },

  computed: {
    showEraContainer() {
      return this.historyArea == "" ? false : true;
    },

    activeEras() {
      return this.historyArea == "Polska" ? this.allEras.slice(2) : this.allEras;
    }
  },

  methods: {
    resetHistoryEra() {
      this.historyEra = "";
    }
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