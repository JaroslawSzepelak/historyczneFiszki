<template>
  <div class="admin-flashcards-view">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="h5 mb-1">Zarządzanie fiszkami</h3>
        <p class="text-muted mb-0">Przeglądaj, filtruj i edytuj fiszki dostępne w aplikacji.</p>
      </div>
      <div class="d-flex gap-2 flex-wrap">
        <router-link to="/admin/flashcards/create" class="btn btn-success">Nowa fiszka</router-link>
        <button class="btn btn-outline-secondary" @click="fetchFlashcards">Odśwież</button>
      </div>
    </div>

    <div class="card mb-4 p-3 shadow-sm border-0 bg-white">
      <div class="row g-3">
        <div class="col-12 col-md-4">
          <label class="form-label">Szukaj</label>
          <input type="text" class="form-control" v-model="localFilters.q" @keyup.enter="applyFilters" placeholder="Pytanie" />
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Obszar</label>
          <select class="form-select" v-model="localFilters.area" @change="applyFilters">
            <option value="">Wszystkie</option>
            <option v-for="area in allAreas" :key="area.routeName" :value="area.name">
              {{ area.name }}
            </option>
          </select>
        </div>
        <div class="col-6 col-md-3">
          <label class="form-label">Epoka</label>
          <select class="form-select" v-model="localFilters.era" @change="applyFilters">
            <option value="">Wszystkie</option>
            <option v-for="era in allEras" :key="era.routeName" :value="era.name">
              {{ era.name }}
            </option>
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
            <th>ID</th>
            <th>Obszar</th>
            <th>Epoka</th>
            <th>Pytanie</th>
            <th class="text-end">Akcje</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flashcard in flashcards" :key="flashcard.id">
            <td>{{ flashcard.id }}</td>
            <td>{{ flashcard.area }}</td>
            <td>{{ flashcard.era }}</td>
            <td>{{ flashcard.question }}</td>
            <td class="text-end">
              <div class="btn-group" role="group">
                <router-link :to="`/admin/flashcards/${flashcard.id}/edit`" class="btn btn-sm btn-outline-primary">Edytuj</router-link>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(flashcard)">Usuń</button>
              </div>
            </td>
          </tr>
          <tr v-if="!loadingFlashcards && flashcards.length === 0">
            <td colspan="5" class="text-center text-muted py-4">Brak fiszek do wyświetlenia.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <div class="text-muted">Łącznie: {{ pagination.total }} fiszek</div>
      <div class="btn-group">
        <button class="btn btn-outline-secondary" :disabled="pagination.page <= 1" @click="changePage(pagination.page - 1)">Poprzednia</button>
        <button class="btn btn-outline-secondary" :disabled="pagination.page >= pagination.pages" @click="changePage(pagination.page + 1)">Następna</button>
      </div>
    </div>

    <confirm-delete-modal
      :visible="showDeleteModal"
      :title="`Usuń fiszkę #${flashcardToDelete ? flashcardToDelete.id : ''}?`"
      :message="flashcardToDelete ? `Czy na pewno chcesz usunąć fiszkę: ${flashcardToDelete.question}?` : ''"
      :confirmLabel="isDeleting ? 'Usuwanie...' : 'Usuń'"
      @cancel="cancelDelete"
      @confirm="handleDeleteConfirmed"
    />
  </div>
</template>

<script>
import ConfirmDeleteModal from '@/components/modals/ConfirmDeleteModal.vue'

export default {
  name: 'AdminFlashcardsView',
  components: {
    ConfirmDeleteModal
  },
  data() {
    return {
      localFilters: {
        area: '',
        era: '',
        q: ''
      },
      showDeleteModal: false,
      flashcardToDelete: null,
      isDeleting: false
    }
  },
  computed: {
    flashcards() {
      return this.$store.getters['admin/flashcards']
    },
    loadingFlashcards() {
      return this.$store.getters['admin/loadingFlashcards']
    },
    operationError() {
      return this.$store.getters['admin/getError']('fetchFlashcards')
    },
    pagination() {
      return this.$store.getters['admin/flashcardPagination']
    },
    allAreas() {
      return this.$store.state.categories.allAreas || []
    },
    allEras() {
      return this.$store.state.categories.allEras || []
    }
  },
  methods: {
    async fetchFlashcards() {
      await this.$store.dispatch('admin/fetchFlashcards', {
        page: this.pagination.page,
        limit: this.pagination.limit
      })
    },
    applyFilters() {
      this.$store.dispatch('admin/setFlashcardFiltersAndFetch', {
        area: this.localFilters.area,
        era: this.localFilters.era,
        q: this.localFilters.q
      })
    },
    resetFilters() {
      this.localFilters = { area: '', era: '', q: '' }
      this.$store.dispatch('admin/clearFlashcardFiltersAndFetch')
    },
    changePage(page) {
      this.$store.dispatch('admin/changeFlashcardPage', page)
    },
    confirmDelete(flashcard) {
      this.flashcardToDelete = flashcard
      this.showDeleteModal = true
    },
    async handleDeleteConfirmed() {
      if (!this.flashcardToDelete) return
      this.isDeleting = true
      try {
        await this.$store.dispatch('admin/deleteFlashcard', this.flashcardToDelete.id)
        this.showDeleteModal = false
        this.flashcardToDelete = null
        await this.fetchFlashcards()
      } finally {
        this.isDeleting = false
      }
    },
    cancelDelete() {
      this.showDeleteModal = false
      this.flashcardToDelete = null
    }
  },
  created() {
    sessionStorage.setItem('adminLastView', '/admin/flashcards')
    this.fetchFlashcards()
  }
}
</script>

<style scoped>
.admin-flashcards-view {
  min-height: 420px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
