<template>
  <div class="admin-flashcard-edit">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="h5 mb-1">{{ isCreateMode ? 'Nowa fiszka' : 'Edycja fiszki' }}</h3>
        <p class="text-muted mb-0">{{ isCreateMode ? 'Utwórz nową fiszkę dla aplikacji' : 'Zmień dane istniejącej fiszki' }}</p>
      </div>
      <router-link to="/admin/flashcards" class="btn btn-secondary">Powrót do listy</router-link>
    </div>

    <div v-if="loadingFlashcardDetail && !isCreateMode" class="alert alert-info">Ładowanie danych fiszki...</div>
    <div v-if="operationError" class="alert alert-danger">{{ operationError }}</div>

    <div class="card shadow-sm border-0 bg-white p-4">
      <form @submit.prevent="submitForm" novalidate>
        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label">Obszar</label>
            <input v-model="form.area" type="text" class="form-control" placeholder="np. polska" />
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Epoka</label>
            <input v-model="form.era" type="text" class="form-control" placeholder="np. średniowiecze" />
          </div>
          <div class="col-12">
            <label class="form-label">Pytanie</label>
            <textarea v-model="form.question" class="form-control" rows="3" placeholder="Treść pytania"></textarea>
          </div>
          <div class="col-12">
            <label class="form-label">Odpowiedzi</label>
            <div v-for="(answer, index) in form.answers" :key="index" class="input-group mb-2">
              <input v-model="form.answers[index]" type="text" class="form-control" :placeholder="`Odpowiedź ${index + 1}`" />
              <button type="button" class="btn btn-outline-danger" @click="removeAnswer(index)">Usuń</button>
            </div>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="addAnswer">Dodaj odpowiedź</button>
          </div>
          <div class="col-12">
            <label class="form-label">Prawidłowa odpowiedź</label>
            <input v-model="form.correctAnswer" type="text" class="form-control" placeholder="Dokładnie taka sama jak w odpowiedziach" />
          </div>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Zapisywanie...' : isCreateMode ? 'Utwórz fiszkę' : 'Zapisz zmiany' }}
          </button>
          <router-link to="/admin/flashcards" class="btn btn-outline-secondary">Anuluj</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlashcardEditView',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        area: '',
        era: '',
        question: '',
        answers: ['', ''],
        correctAnswer: ''
      },
      isSubmitting: false
    }
  },
  computed: {
    isCreateMode() {
      return !this.id
    },
    loadingFlashcardDetail() {
      return this.$store.getters['admin/loadingFlashcardDetail']
    },
    operationError() {
      return this.$store.getters['admin/getError'](this.isCreateMode ? 'createFlashcard' : 'updateFlashcard')
    }
  },
  methods: {
    addAnswer() {
      this.form.answers.push('')
    },
    removeAnswer(index) {
      if (this.form.answers.length > 2) {
        this.form.answers.splice(index, 1)
      }
    },
    async loadFlashcard() {
      if (this.isCreateMode) return
      await this.$store.dispatch('admin/fetchFlashcardById', Number(this.id))
      const flashcard = this.$store.getters['admin/selectedFlashcard']
      if (flashcard) {
        this.form = {
          area: flashcard.area || '',
          era: flashcard.era || '',
          question: flashcard.question || '',
          answers: Array.isArray(flashcard.answers) ? [...flashcard.answers] : ['', ''],
          correctAnswer: flashcard.correct_answer || flashcard.correctAnswer || ''
        }
      }
    },
    async submitForm() {
      const payload = {
        area: this.form.area,
        era: this.form.era,
        question: this.form.question,
        answers: this.form.answers.filter(Boolean),
        correctAnswer: this.form.correctAnswer
      }

      this.isSubmitting = true
      try {
        if (this.isCreateMode) {
          await this.$store.dispatch('admin/createFlashcard', payload)
        } else {
          await this.$store.dispatch('admin/updateFlashcard', {
            flashcardId: Number(this.id),
            flashcardData: payload
          })
        }
        this.$router.push('/admin/flashcards')
      } finally {
        this.isSubmitting = false
      }
    }
  },
  created() {
    if (!this.isCreateMode) {
      this.loadFlashcard()
    }
  }
}
</script>
