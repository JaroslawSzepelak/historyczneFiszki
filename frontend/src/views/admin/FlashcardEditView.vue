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
            <select v-model="form.area" class="form-select" :class="{ 'is-invalid': errors.area }" @change="clearError('area')">
              <option value="">Wybierz obszar</option>
              <option v-for="area in allAreas" :key="area.routeName" :value="area.name">
                {{ area.name }}
              </option>
            </select>
            <div v-if="errors.area" class="invalid-feedback d-block">{{ errors.area }}</div>
          </div>
          <div class="col-12 col-md-6">
            <label class="form-label">Epoka</label>
            <select v-model="form.era" class="form-select" :class="{ 'is-invalid': errors.era }" @change="clearError('era')">
              <option value="">Wybierz epokę</option>
              <option v-for="era in allEras" :key="era.routeName" :value="era.name">
                {{ era.name }}
              </option>
            </select>
            <div v-if="errors.era" class="invalid-feedback d-block">{{ errors.era }}</div>
          </div>
          <div class="col-12">
            <label class="form-label">Pytanie</label>
            <textarea v-model="form.question" class="form-control" :class="{ 'is-invalid': errors.question }" rows="3" @input="clearError('question')" placeholder="Treść pytania"></textarea>
            <div v-if="errors.question" class="invalid-feedback d-block">{{ errors.question }}</div>
          </div>
          <div class="col-12">
            <label class="form-label">Odpowiedzi</label>
            <div v-for="(answer, index) in form.answers" :key="index" class="input-group mb-2">
              <input v-model="form.answers[index]" type="text" class="form-control" :class="{ 'is-invalid': errors[`answer${index}`] }" @input="clearAnswerError(index)" :placeholder="`Odpowiedź ${index + 1}`" />
              <button type="button" class="btn btn-outline-danger" @click="removeAnswer(index)">Usuń</button>
            </div>
            <div v-if="errors.answers" class="invalid-feedback d-block">{{ errors.answers }}</div>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="addAnswer">Dodaj odpowiedź</button>
          </div>
          <div class="col-12">
            <label class="form-label">Prawidłowa odpowiedź</label>
            <select v-model="form.correctAnswer" class="form-select" :class="{ 'is-invalid': errors.correctAnswer }" :disabled="answerOptions.length === 0" @change="clearError('correctAnswer')">
              <option value="">Wybierz prawidłową odpowiedź</option>
              <option v-for="answer in answerOptions" :key="answer" :value="answer">
                {{ answer }}
              </option>
            </select>
            <div v-if="errors.correctAnswer" class="invalid-feedback d-block">{{ errors.correctAnswer }}</div>
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
      isSubmitting: false,
      errors: {}
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
    },
    allAreas() {
      return this.$store.state.categories.allAreas || []
    },
    allEras() {
      return this.$store.state.categories.allEras || []
    },
    answerOptions() {
      return [...new Set(
        this.form.answers
          .map(answer => typeof answer === 'string' ? answer.trim() : '')
          .filter(Boolean)
      )]
    }
  },
  methods: {
    clearError(field) {
      if (this.errors[field]) {
        delete this.errors[field]
      }
    },
    clearAnswerError(index) {
      this.clearError(`answer${index}`)
      this.clearError('answers')
    },
    validateForm() {
      const errors = {}
      const area = typeof this.form.area === 'string' ? this.form.area.trim() : ''
      const era = typeof this.form.era === 'string' ? this.form.era.trim() : ''
      const question = typeof this.form.question === 'string' ? this.form.question.trim() : ''
      const answers = this.form.answers.map(answer => typeof answer === 'string' ? answer.trim() : '')
      const nonEmptyAnswers = answers.filter(Boolean)
      const correctAnswer = typeof this.form.correctAnswer === 'string' ? this.form.correctAnswer.trim() : ''

      if (!area) errors.area = 'Wybierz obszar.'
      if (!era) errors.era = 'Wybierz epokę.'
      if (!question) {
        errors.question = 'Wpisz treść pytania.'
      } else if (question.length < 5) {
        errors.question = 'Pytanie musi mieć co najmniej 5 znaków.'
      } else if (question.length > 500) {
        errors.question = 'Pytanie może mieć maksymalnie 500 znaków.'
      }

      answers.forEach((answer, index) => {
        if (!answer) errors[`answer${index}`] = `Uzupełnij odpowiedź ${index + 1} albo usuń to pole.`
      })
      if (nonEmptyAnswers.length < 2) {
        errors.answers = 'Dodaj co najmniej dwie niepuste odpowiedzi.'
      }

      if (!correctAnswer) {
        errors.correctAnswer = 'Wybierz prawidłową odpowiedź.'
      } else if (!nonEmptyAnswers.includes(correctAnswer)) {
        errors.correctAnswer = 'Prawidłowa odpowiedź musi znajdować się na liście odpowiedzi.'
      }

      this.errors = errors
      return Object.keys(errors).length === 0
    },
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
      if (!this.validateForm()) {
        this.$nextTick(() => {
          const firstInvalidField = this.$el.querySelector('.is-invalid')
          if (firstInvalidField) firstInvalidField.focus()
        })
        return
      }

      const payload = {
        area: this.form.area,
        era: this.form.era,
        question: this.form.question,
        answers: this.form.answers.map(answer => answer.trim()).filter(Boolean),
        correctAnswer: this.form.correctAnswer.trim()
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
