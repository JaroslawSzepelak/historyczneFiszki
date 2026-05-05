<template>
    <div class="category-select">
        <h2 class="bg-info text-center text-white p-3 m-0">
            {{ isLearning ? "Nauka" : "Fiszki" }}
        </h2>
        <div class="container py-4 py-lg-5">
          <div class="selection-card mx-auto p-4 p-lg-5">
            <h3 class="mb-4 text-center">Wybierz interesujący Cię obszar geograficzny:</h3>
            <div class="option-grid mb-4">
              <div v-for="(area, i) in allHistoryAreas" v-bind:key="area.routeName" class="form-check">
                <input type="radio" class="btn-check" v-model="historyArea" v-bind:value="area" v-bind:id="'area' + i" autocomplete="off" v-on:change="resetHistoryEra"/>
                <label class="btn btn-outline-primary btn-lg option-btn" v-bind:for="'area' + i">{{ area.name }}</label>
              </div>
            </div>

            <div v-if="showEraContainer" class="era-section pt-4">
              <h3 class="mb-4 text-center">Wybierz interesującą Cię epokę historyczną:</h3>
              <div class="option-grid">
                <div v-for="(era, i) in activeEras" v-bind:key="era.routeName" class="form-check">
                  <input type="radio" class="btn-check" v-model="historyEra" v-bind:value="era" v-bind:id="'era' + i" autocomplete="off"/>
                  <label class="btn btn-outline-primary btn-lg option-btn" v-bind:for="'era' + i">{{ era.name }}</label>
                </div>
              </div>
            </div>

            <div class="d-flex flex-column flex-md-row justify-content-center gap-3 pt-4 mt-4 border-top">
              <button class="btn btn-secondary action-btn" v-on:click="$router.back()">Wstecz</button>
              <button class="btn btn-primary action-btn" v-on:click="goForward" v-bind:disabled="!canGoForward">Dalej</button>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      isLearning: false
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
      return this.historyArea ? true : false;
    },

    activeEras() {
      return this.historyArea.name === "Polska" ? this.allEras.slice(2) : this.allEras;
    },

    canGoForward() {
      return (this.historyArea && this.historyEra) ? true : false
    }
  },

  methods: {
    resetHistoryEra() {
      this.$store.commit("categories/setHistoryEra", null);
    },

    goForward() {
      if (this.canGoForward) {
        this.$router.push(`${this.$route.path}/${this.historyArea.routeName}/${this.historyEra.routeName}`);
      }
    }
  },

  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from) {
    this.$store.commit("categories/setHistoryArea", null);
    this.$store.commit("categories/setHistoryEra", null);
  },
  
  created() {
    if (this.$route.params.op === "flashcards") {
        this.isLearning = false;
    } else {
        this.isLearning = true;
    }
  }
}
</script>

<style scoped>
.category-select {
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 42%);
  min-height: calc(100vh - 160px);
}

.selection-card {
  max-width: 980px;
  background: #ffffff;
  border: 1px solid #e8eef8;
  border-radius: 1rem;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.9rem;
}

.option-btn {
  width: 100%;
  min-height: 52px;
  font-weight: 600;
}

.era-section {
  border-top: 1px solid #edf1f7;
}

.action-btn {
  min-width: 170px;
  min-height: 46px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .category-select {
    min-height: auto;
  }

  .action-btn {
    width: 100%;
    min-width: 0;
  }
}
</style>