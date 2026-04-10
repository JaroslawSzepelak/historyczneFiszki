<template>
      <nav class="navbar bg-dark border-bottom border-body m-0 p-3" data-bs-theme="dark">
            <div class="d-flex">
                  <span class="navbar-brand h1 mb-0">HistoryczneFiszki</span>
                  <div>
                        <ul class="navbar-nav">
                              <li class="nav-item">
                                    <router-link to="/" class="nav-link text-white">Strona główna</router-link>
                              </li>
                        </ul>
                  </div>
            </div>
      </nav>
      <router-view></router-view>
      <footer class="position-absolute bottom-0 w-100">
            <div class="text-center bg-light p-4">
                  <h5>© 2025 Jarosław Szepelak</h5>
            </div>
      </footer>
</template>

<script>
      export default {
            computed: {
                  flashcardsAccessible() {
                        return this.$store.state.flashcards.accessible;
                  }
            },

            created() {
                  this.$store.dispatch("flashcards/loadAccessible");
            },

            watch: {
                  flashcardsAccessible() {
                        this.$store.dispatch("flashcards/storeAccessible");
                  }
            }
      }
</script>

