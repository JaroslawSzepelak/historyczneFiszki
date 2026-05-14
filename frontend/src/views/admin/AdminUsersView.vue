<template>
  <div class="admin-users-view">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="h5 mb-1">Zarządzanie użytkownikami</h3>
        <p class="text-muted mb-0">Przeglądaj konta, filtruj je oraz wykonuj operacje administracyjne.</p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-outline-secondary" @click="fetchUsers">Odśwież</button>
        <router-link to="/admin" class="btn btn-secondary">Powrót do panelu</router-link>
      </div>
    </div>

    <div class="card mb-4 p-3 shadow-sm border-0 bg-white">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Szukaj</label>
          <input type="text" class="form-control" v-model="localFilters.search" @keyup.enter="applyFilters" placeholder="Email, użytkownik, imię, nazwisko" />
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="localFilters.status" @change="applyFilters">
            <option value="">Wszystkie</option>
            <option value="active">Aktywne</option>
            <option value="inactive">Nieaktywne</option>
            <option value="banned">Zbanowane</option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Rola</label>
          <select class="form-select" v-model="localFilters.isAdmin" @change="applyFilters">
            <option value="">Wszystkie</option>
            <option value="true">Administratorzy</option>
            <option value="false">Użytkownicy</option>
          </select>
        </div>
        <div class="col-12 col-md-2 d-flex align-items-end">
          <button class="btn btn-primary w-100" @click="resetFilters">Wyczyść filtry</button>
        </div>
      </div>
    </div>

    <div v-if="operationError" class="alert alert-danger">{{ operationError }}</div>

    <div class="table-responsive mb-3">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Email</th>
            <th>Nazwa</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>Status</th>
            <th>Rola</th>
            <th class="text-end">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.email }}</td>
            <td>{{ user.username || '-' }}</td>
            <td>{{ user.first_name || '-' }}</td>
            <td>{{ user.last_name || '-' }}</td>
            <td><span class="badge" :class="statusBadgeClass(user.status)">{{ user.status }}</span></td>
            <td>
              <span class="badge" :class="user.isAdmin ? 'bg-warning text-dark' : 'bg-secondary'">
                {{ user.isAdmin ? 'Administrator' : 'Użytkownik' }}
              </span>
            </td>
            <td class="text-end">
              <div class="btn-group" role="group">
                <router-link :to="`/admin/users/${user.id}/edit`" class="btn btn-sm btn-outline-primary">Edytuj</router-link>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(user)">Usuń</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loadingUsers && users.length === 0">
            <td colspan="7" class="text-center text-muted py-4">Brak użytkowników do wyświetlenia.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <div class="text-muted">Łącznie: {{ pagination.total }} użytkowników</div>
      <div class="btn-group">
        <button class="btn btn-outline-secondary" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">Poprzednia</button>
        <button class="btn btn-outline-secondary" :disabled="pagination.page >= pagination.pages" @click="changePage(pagination.page + 1)">Następna</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminUsersView',
  data() {
    return {
      localFilters: {
        search: '',
        status: '',
        isAdmin: ''
      }
    }
  },
  computed: {
    users() {
      return this.$store.getters['admin/users']
    },
    loadingUsers() {
      return this.$store.getters['admin/loadingUsers']
    },
    operationError() {
      return this.$store.getters['admin/getError']('fetchUsers')
    },
    pagination() {
      return this.$store.getters['admin/pagination']
    }
  },
  methods: {
    async fetchUsers() {
      await this.$store.dispatch('admin/setFiltersAndFetch', {
        search: this.localFilters.search,
        status: this.localFilters.status,
        isAdmin: this.localFilters.isAdmin === '' ? '' : this.localFilters.isAdmin
      })
    },
    applyFilters() {
      this.fetchUsers()
    },
    resetFilters() {
      this.localFilters = { search: '', status: '', isAdmin: '' }
      this.$store.dispatch('admin/clearFilters')
    },
    changePage(page) {
      this.$store.dispatch('admin/changePage', page)
    },
    statusBadgeClass(status) {
      return {
        'bg-success': status === 'active',
        'bg-warning': status === 'inactive',
        'bg-danger': status === 'banned'
      }
    },
    confirmDelete(user) {
      if (window.confirm(`Na pewno usunąć użytkownika ${user.email}?`)) {
        this.$store.dispatch('admin/deleteUser', user.id)
          .then(() => {
            this.fetchUsers()
          })
          .catch(() => {})
      }
    }
  },
  created() {
    this.fetchUsers()
  }
}
</script>

<style scoped>
.admin-users-view {
  min-height: 420px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
