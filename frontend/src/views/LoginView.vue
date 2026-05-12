<template>
  <div class="login-view">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title text-center mb-4">Logowanie</h2>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="form-control"
                    :class="{ 'is-invalid': error }"
                    required
                    placeholder="Wpisz swój email"
                  >
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Hasło</label>
                  <input
                    type="password"
                    id="password"
                    v-model="form.password"
                    class="form-control"
                    :class="{ 'is-invalid': error }"
                    required
                    placeholder="Wpisz swoje hasło"
                  >
                </div>

                <div v-if="error" class="alert alert-danger mb-3">
                  {{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                  {{ loading ? 'Logowanie...' : 'Zaloguj się' }}
                </button>

                <div class="text-center">
                  <router-link to="/register" class="text-decoration-none">
                    Nie masz konta? Zarejestruj się
                  </router-link>
                </div>

                <div class="text-center mt-3">
                  <router-link to="/admin-login" class="text-decoration-none text-muted">
                    Logowanie administratora
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
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
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
    }
  },
  methods: {
    async handleLogin() {
      try {
        await this.$store.dispatch('auth/login', this.form)
        this.$router.push('/')
      } catch (error) {
        // Error is handled in store
      }
    }
  },
  mounted() {
    // Clear any previous errors
    this.$store.dispatch('auth/clearError')
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
}

.card {
  border: none;
  border-radius: 10px;
}

.card-title {
  color: #495057;
  font-weight: 600;
}
</style>