<template>
  <div class="admin-login-view">
    <div class="container py-3">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow border-warning">
            <div class="card-header bg-warning text-white text-center p-3">
              <h4 class="mb-0">
                <i class="fas fa-shield-alt me-2"></i>
                Panel Administratora
              </h4>
            </div>
            <div class="card-body p-5">
              <h2 class="card-title text-center mb-5">Logowanie administratora</h2>

              <form @submit.prevent="handleLogin">
                <div class="mb-4">
                  <label for="email" class="form-label">Email administratora</label>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="form-control"
                    :class="{ 'is-invalid': error }"
                    required
                    placeholder="admin@historycznefiszki.local"
                  >
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Hasło</label>
                  <input
                    type="password"
                    id="password"
                    v-model="form.password"
                    class="form-control"
                    :class="{ 'is-invalid': error }"
                    required
                    placeholder="Wpisz hasło administratora"
                  >
                </div>

                <div v-if="error" class="alert alert-danger mb-4">
                  {{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-warning w-100 mb-4"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ loading ? 'Logowanie...' : 'Zaloguj się jako administrator' }}
                </button>

                <div class="text-center">
                  <router-link to="/login" class="text-decoration-none">
                    Powrót do logowania użytkownika
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLoginView',
  data() {
    return {
      form: {
        email: 'admin@historycznefiszki.local',
        password: ''
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['auth/loading']
    },
    error() {
      return this.$store.getters['auth/error']
    },
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin']
    }
  },
  methods: {
    async handleLogin() {
      try {
        const user = await this.$store.dispatch('auth/login', this.form)

        if (!user.isAdmin) {
          this.$store.commit('auth/setError', 'To konto nie ma uprawnień administratora')
          return
        }

        this.$router.push('/admin')
      } catch (error) {
        // Error is handled in store
      }
    }
  },
  created() {
    this.$store.dispatch('auth/clearError')
    if (this.isAuthenticated) {
      this.$router.replace(this.isAdmin ? '/admin' : '/')
    }
  }
}
</script>

<style scoped>
.admin-login-view {
  padding-top: 50px;
  display: flex;
  align-items: center;
}

.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.card-header {
  border-radius: 10px 10px 0 0;
}

.card-title {
  color: #495057;
  font-weight: 600;
}
</style>