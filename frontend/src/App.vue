<template>
      <nav class="navbar bg-dark border-bottom border-body m-0 p-3" data-bs-theme="dark">
            <div class="d-flex justify-content-between align-items-center w-100">
                  <div class="d-flex align-items-center">
                        <span class="navbar-brand h1 mb-0">HistoryczneFiszki</span>
                        <div>
                              <ul class="navbar-nav">
                                    <li class="nav-item">
                                          <router-link to="/" class="nav-link text-white">Strona główna</router-link>
                                    </li>
                              </ul>
                        </div>
                  </div>
                  <div class="d-flex align-items-center gap-3">
                        <div v-if="isAuthenticated" class="text-white">
                              <span v-if="currentUser">{{ currentUser.username }}</span>
                              <span v-if="isAdmin" class="badge bg-warning text-dark ms-2">Admin</span>
                        </div>
                        <div>
                              <router-link v-if="!isAuthenticated" to="/login" class="nav-link text-white d-inline">Zaloguj się</router-link>
                              <button v-else @click="handleLogout" class="btn btn-outline-light btn-sm">Wyloguj</button>
                        </div>
                  </div>
            </div>
      </nav>
      <router-view></router-view>
      <LogoutSuccessModal
        :visible="showLogoutModal"
        @ok="handleLogoutModalOk"
      />
      <footer class="position-absolute bottom-0 w-100">
            <div class="text-center bg-light p-4">
                  <h5>© 2025 Jarosław Szepelak</h5>
            </div>
      </footer>
</template>

<script>
import LogoutSuccessModal from '@/components/modals/LogoutSuccessModal.vue'

      export default {
            components: {
                  LogoutSuccessModal
            },
            data() {
                  return {
                        showLogoutModal: false
                  }
            },
            computed: {
                  flashcardsAccessible() {
                        return this.$store.state.flashcards.accessible;
                  },
                  isAuthenticated() {
                        return this.$store.getters['auth/isAuthenticated'];
                  },
                  currentUser() {
                        return this.$store.getters['auth/user'];
                  },
                  isAdmin() {
                        return this.$store.getters['auth/isAdmin'];
                  }
            },

            created() {
                  this.$store.dispatch("flashcards/loadAccessible");
            },

            watch: {
                  flashcardsAccessible() {
                        this.$store.dispatch("flashcards/storeAccessible");
                  }
            },

            methods: {
                  async handleLogout() {
                        try {
                              await this.$store.dispatch('auth/logout');
                              this.showLogoutModal = true;
                        } catch (error) {
                              console.error('Logout failed:', error);
                        }
                  },
                  handleLogoutModalOk() {
                        this.showLogoutModal = false;
                        window.location.href = '/';
                  }
            }
      }
</script>

