<template>
  <div class="admin-user-edit">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="h5 mb-1">Edycja użytkownika</h3>
        <p class="text-muted mb-0">Zmodyfikuj dane konta lub zresetuj hasło użytkownika.</p>
      </div>
      <router-link to="/admin/users" class="btn btn-secondary">Powrót do listy</router-link>
    </div>

    <div v-if="loadingDetail" class="alert alert-info">Ładowanie danych użytkownika...</div>
    <div v-if="detailError" class="alert alert-danger">{{ detailError }}</div>

    <div v-if="selectedUser" class="card shadow-sm border-0 bg-white p-4">
      <form @submit.prevent="submitForm">
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" v-model="form.email" required />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Nazwa użytkownika</label>
            <input type="text" class="form-control" v-model="form.username" />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Imię</label>
            <input type="text" class="form-control" v-model="form.first_name" />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Nazwisko</label>
            <input type="text" class="form-control" v-model="form.last_name" />
          </div>
        </div>

        <div class="mt-4 d-flex flex-column flex-md-row gap-2">
          <button type="submit" class="btn btn-primary">Zapisz zmiany</button>
          <button type="button" class="btn btn-outline-secondary" @click="loadSelectedUser">Przywróć dane</button>
        </div>
      </form>

      <hr class="my-4" />

      <div class="row g-3">
        <div class="col-12 col-md-4">
          <div class="form-floating">
            <input type="password" class="form-control" v-model="password" placeholder="Nowe hasło" />
            <label>Nowe hasło</label>
          </div>
        </div>
        <div class="col-12 col-md-8 d-flex align-items-end gap-2">
          <button class="btn btn-warning" @click="resetPassword">Resetuj hasło</button>
          <small class="text-muted">Hasło musi mieć przynajmniej 8 znaków.</small>
        </div>
      </div>

      <hr class="my-4" />

      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Status konta</label>
          <select class="form-select" v-model="form.status" @change="updateStatus">
            <option value="active">Aktywny</option>
            <option value="inactive">Nieaktywny</option>
            <option value="banned">Zbanowany</option>
          </select>
        </div>
        <div class="col-12 col-md-4">
          <label class="form-label">Rola</label>
          <div class="form-check form-switch mt-2">
            <input class="form-check-input" type="checkbox" id="adminRole" v-model="form.isAdmin" @change="updateAdminRole" />
            <label class="form-check-label" for="adminRole">Administrator</label>
          </div>
        </div>
      </div>

      <div v-if="operationError" class="alert alert-danger mt-4">{{ operationError }}</div>
      <div v-if="successMessage" class="alert alert-success mt-4">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserEditView',
  data() {
    return {
      form: {
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        status: 'active',
        isAdmin: false
      },
      password: '',
      successMessage: ''
    }
  },
  computed: {
    selectedUser() {
      return this.$store.getters['admin/selectedUser']
    },
    loadingDetail() {
      return this.$store.getters['admin/loadingDetail']
    },
    detailError() {
      return this.$store.getters['admin/getError']('fetchUserById')
    },
    operationError() {
      return this.$store.getters['admin/getError']('updateUser') || this.$store.getters['admin/getError']('resetUserPassword')
    }
  },
  methods: {
    loadSelectedUser() {
      if (!this.selectedUser) {
        return
      }
      this.form.email = this.selectedUser.email
      this.form.username = this.selectedUser.username || ''
      this.form.first_name = this.selectedUser.first_name || ''
      this.form.last_name = this.selectedUser.last_name || ''
      this.form.status = this.selectedUser.status
      this.form.isAdmin = this.selectedUser.isAdmin
      this.successMessage = ''
      this.password = ''
    },
    async submitForm() {
      try {
        await this.$store.dispatch('admin/updateUser', {
          userId: this.$route.params.id,
          userData: {
            email: this.form.email,
            username: this.form.username,
            first_name: this.form.first_name,
            last_name: this.form.last_name
          }
        })
        this.successMessage = 'Dane użytkownika zostały zapisane.'
      } catch (error) {
        // błąd obsługowany przez store
      }
    },
    async resetPassword() {
      if (!this.password || this.password.length < 8) {
        this.successMessage = ''
        return
      }
      try {
        await this.$store.dispatch('admin/resetUserPassword', {
          userId: this.$route.params.id,
          password: this.password
        })
        this.successMessage = 'Hasło zostało zresetowane.'
        this.password = ''
      } catch (error) {
        // błąd obsługiwany przez store
      }
    },
    async updateStatus() {
      try {
        await this.$store.dispatch('admin/changeUserStatus', {
          userId: this.$route.params.id,
          status: this.form.status
        })
        this.successMessage = 'Status konta został zaktualizowany.'
      } catch (error) {
        // obsługa w store
      }
    },
    async updateAdminRole() {
      try {
        await this.$store.dispatch('admin/toggleAdminRole', {
          userId: this.$route.params.id,
          isAdmin: this.form.isAdmin
        })
        this.successMessage = 'Rola użytkownika została zaktualizowana.'
      } catch (error) {
        if (this.selectedUser && this.selectedUser.id === Number(this.$route.params.id)) {
          this.form.isAdmin = this.selectedUser.isAdmin
        }
      }
    }
  },
  watch: {
    selectedUser(newValue) {
      if (newValue) {
        this.loadSelectedUser()
      }
    }
  },
  created() {
    this.$store.dispatch('admin/fetchUserById', Number(this.$route.params.id))
      .then(() => {
        this.loadSelectedUser()
      })
      .catch(() => {})
  }
}
</script>

<style scoped>
.admin-user-edit {
  min-height: 420px;
}

.admin-user-edit .card {
  overflow: hidden;
}
</style>
