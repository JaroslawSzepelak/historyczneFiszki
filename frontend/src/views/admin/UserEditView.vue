<template>
  <div class="admin-user-edit">
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
      <div>
        <h3 class="h5 mb-1">{{ isCreateMode ? 'Nowy użytkownik' : 'Edycja użytkownika' }}</h3>
        <p class="text-muted mb-0">{{ isCreateMode ? 'Utwórz nowe konto użytkownika' : 'Zmodyfikuj dane konta lub zresetuj hasło użytkownika.' }}</p>
      </div>
      <router-link to="/admin/users" class="btn btn-secondary">Powrót do listy</router-link>
    </div>

    <div v-if="loadingDetail && !isCreateMode" class="alert alert-info">
      <i class="fa fa-spinner fa-spin"></i> Ładowanie danych użytkownika...
    </div>
    <div v-if="detailError && !isCreateMode" class="alert alert-danger">
      <i class="fa fa-exclamation-circle"></i> {{ detailError }}
    </div>
    <div v-if="operationError && isCreateMode" class="alert alert-danger alert-dismissible fade show">
      <i class="fa fa-exclamation-circle"></i> {{ operationError }}
      <button type="button" class="btn-close" @click="clearOperationError"></button>
    </div>

    <div v-if="isCreateMode || selectedUser" class="card shadow-sm border-0 bg-white p-4">
      <form @submit.prevent="submitForm" novalidate>
        <!-- Sekcja danych podstawowych -->
        <div class="form-section mb-4">
          <h5 class="mb-3">Dane podstawowe</h5>
          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label class="form-label">
                Email
                <span class="text-danger">*</span>
              </label>
              <input
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                v-model="form.email"
                @blur="validateEmail"
                placeholder="np. user@example.com"
              />
              <div v-if="errors.email" class="invalid-feedback d-block">
                <i class="fa fa-exclamation-triangle"></i> {{ errors.email }}
              </div>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Nazwa użytkownika</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                v-model="form.username"
                @blur="validateUsername"
                placeholder="np. john.doe"
              />
              <div v-if="errors.username" class="invalid-feedback d-block">
                <i class="fa fa-exclamation-triangle"></i> {{ errors.username }}
              </div>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Imię</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.first_name }"
                v-model="form.first_name"
                @blur="validateFirstName"
              />
              <div v-if="errors.first_name" class="invalid-feedback d-block">
                <i class="fa fa-exclamation-triangle"></i> {{ errors.first_name }}
              </div>
            </div>
            <div class="col-12 col-md-6">
              <label class="form-label">Nazwisko</label>
              <input
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.last_name }"
                v-model="form.last_name"
                @blur="validateLastName"
              />
              <div v-if="errors.last_name" class="invalid-feedback d-block">
                <i class="fa fa-exclamation-triangle"></i> {{ errors.last_name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Sekcja hasła dla tworzenia -->
        <template v-if="isCreateMode">
          <hr class="my-4" />
          <div class="form-section mb-4">
            <h5 class="mb-3">Bezpieczeństwo</h5>
            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label">
                  Hasło
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  v-model="form.password"
                  @blur="validatePassword"
                  placeholder="Minimum 8 znaków"
                />
                <div v-if="errors.password" class="invalid-feedback d-block">
                  <i class="fa fa-exclamation-triangle"></i> {{ errors.password }}
                </div>
                <small class="text-muted d-block mt-2">
                  <i class="fa fa-info-circle"></i> Hasło musi zawierać co najmniej 8 znaków
                </small>
              </div>
              <div class="col-12 col-md-6">
                <label class="form-label">
                  Potwierdź hasło
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.passwordConfirm }"
                  v-model="form.passwordConfirm"
                  @blur="validatePasswordConfirm"
                  placeholder="Powtórz hasło"
                />
                <div v-if="errors.passwordConfirm" class="invalid-feedback d-block">
                  <i class="fa fa-exclamation-triangle"></i> {{ errors.passwordConfirm }}
                </div>
              </div>
            </div>
          </div>

          <hr class="my-4" />
          <div class="form-section mb-4">
            <h5 class="mb-3">Uprawnienia</h5>
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="form-label">Rola</label>
                <div class="form-check form-switch mt-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="adminRoleCreate"
                    v-model="form.isAdmin"
                  />
                  <label class="form-check-label" for="adminRoleCreate">
                    Administrator
                  </label>
                </div>
                <small class="text-muted d-block mt-2">
                  <i class="fa fa-shield-alt"></i> Administratorzy mają pełny dostęp do panelu
                </small>
              </div>
            </div>
          </div>

          <hr class="my-4" />
          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
            <i class="fa fa-check-circle"></i> {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''"></button>
          </div>

          <div class="d-flex gap-2">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isFormValid || isSubmitting"
            >
              <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
              <i v-else class="fa fa-save"></i>
              {{ isSubmitting ? 'Tworzenie...' : 'Utwórz użytkownika' }}
            </button>
            <router-link to="/admin/users" class="btn btn-outline-secondary">
              <i class="fa fa-times"></i> Anuluj
            </router-link>
          </div>
        </template>

        <!-- Sekcja edycji dla istniejącego użytkownika -->
        <template v-else>
          <div class="d-flex gap-2 mb-4">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isFormValid || isSubmitting"
            >
              <i v-if="isSubmitting" class="fa fa-spinner fa-spin"></i>
              <i v-else class="fa fa-save"></i>
              {{ isSubmitting ? 'Zapisywanie...' : 'Zapisz zmiany' }}
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="loadSelectedUser"
            >
              <i class="fa fa-undo"></i> Przywróć dane
            </button>
          </div>

          <hr class="my-4" />

          <div class="form-section mb-4">
            <h5 class="mb-3">Resetowanie hasła</h5>
            <div class="row g-3">
              <div class="col-12 col-md-4">
                <label class="form-label">Nowe hasło</label>
                <input
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.newPassword }"
                  v-model="password"
                  @blur="validateNewPassword"
                  placeholder="Minimum 8 znaków"
                />
                <div v-if="errors.newPassword" class="invalid-feedback d-block">
                  <i class="fa fa-exclamation-triangle"></i> {{ errors.newPassword }}
                </div>
              </div>
              <div class="col-12 col-md-8 d-flex align-items-end gap-2">
                <button
                  type="button"
                  class="btn btn-warning"
                  @click="resetPassword"
                  :disabled="!password || password.length < 8 || isResetting"
                >
                  <i v-if="isResetting" class="fa fa-spinner fa-spin"></i>
                  <i v-else class="fa fa-key"></i>
                  {{ isResetting ? 'Resetowanie...' : 'Resetuj hasło' }}
                </button>
              </div>
            </div>
          </div>

          <hr class="my-4" />

          <div class="form-section mb-4">
            <h5 class="mb-3">Status i uprawnienia</h5>
            <div class="row g-3 align-items-center">
              <div class="col-12 col-md-6">
                <label class="form-label">Status konta</label>
                <select class="form-select mb-2 mb-md-0" v-model="form.status">
                  <option value="active">Aktywny</option>
                  <option value="inactive">Nieaktywny</option>
                  <option value="banned">Zbanowany</option>
                </select>
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label">Rola</label>
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="form-check form-switch mt-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        id="adminRole"
                        v-model="form.isAdmin"
                      />
                      <label class="form-check-label" for="adminRole">Administrator</label>
                    </div>
                  </div>

                  <div>
                    <button
                      class="btn btn-primary"
                      :disabled="!statusRoleDirty || isApplyingStatusRole"
                      @click.prevent="applyStatusAndRole"
                    >
                      <i v-if="isApplyingStatusRole" class="fa fa-spinner fa-spin"></i>
                      {{ isApplyingStatusRole ? 'Zapisuję...' : 'Zapisz status i rolę' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
            <i class="fa fa-check-circle"></i> {{ successMessage }}
            <button type="button" class="btn-close" @click="successMessage = ''"></button>
          </div>
        </template>
      </form>
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
        isAdmin: false,
        password: '',
        passwordConfirm: ''
      },
      password: '',
      successMessage: '',
      isSubmitting: false,
      isResetting: false,
      isUpdatingStatus: false,
      isUpdatingRole: false,
      isApplyingStatusRole: false,
      errors: {
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        passwordConfirm: '',
        newPassword: ''
      }
    }
  },
  computed: {
    isCreateMode() {
      return this.$route.name === 'admin-user-create'
    },
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
      return this.$store.getters['admin/getError']('createUser') || this.$store.getters['admin/getError']('updateUser') || this.$store.getters['admin/getError']('resetUserPassword')
    },
    isFormValid() {
      if (this.isCreateMode) {
        return (
          !this.errors.email &&
          !this.errors.password &&
          !this.errors.passwordConfirm &&
          this.form.email.trim() !== '' &&
          this.form.password.trim() !== '' &&
          this.form.passwordConfirm.trim() !== ''
        )
      } else {
        return (
          !this.errors.email &&
          !this.errors.username &&
          !this.errors.first_name &&
          !this.errors.last_name &&
          this.form.email.trim() !== ''
        )
      }
    },
    // Returns true when either status or role value differs from loaded selectedUser
    statusRoleDirty() {
      if (!this.selectedUser) return false
      return this.selectedUser.status !== this.form.status || this.selectedUser.isAdmin !== this.form.isAdmin
    }
  },
  methods: {
    validateEmail() {
      const email = this.form.email.trim()
      if (!email) {
        this.errors.email = 'Email jest wymagany'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.errors.email = 'Wprowadź poprawny adres email'
      } else {
        this.errors.email = ''
      }
    },
    validateUsername() {
      const username = this.form.username.trim()
      if (username && username.length < 3) {
        this.errors.username = 'Nazwa użytkownika musi mieć co najmniej 3 znaki'
      } else if (username && !/^[a-zA-Z0-9._-]+$/.test(username)) {
        this.errors.username = 'Nazwa zawiera niedozwolone znaki'
      } else {
        this.errors.username = ''
      }
    },
    validateFirstName() {
      const firstName = this.form.first_name.trim()
      if (firstName && firstName.length > 50) {
        this.errors.first_name = 'Imię nie może przekraczać 50 znaków'
      } else {
        this.errors.first_name = ''
      }
    },
    validateLastName() {
      const lastName = this.form.last_name.trim()
      if (lastName && lastName.length > 50) {
        this.errors.last_name = 'Nazwisko nie może przekraczać 50 znaków'
      } else {
        this.errors.last_name = ''
      }
    },
    validatePassword() {
      const password = this.form.password.trim()
      if (!password) {
        this.errors.password = 'Hasło jest wymagane'
      } else if (password.length < 8) {
        this.errors.password = 'Hasło musi mieć co najmniej 8 znaków'
      } else if (!/(?=.*[a-z])/.test(password)) {
        this.errors.password = 'Hasło musi zawierać co najmniej jedną małą literę'
      } else if (!/(?=.*[A-Z])/.test(password)) {
        this.errors.password = 'Hasło musi zawierać co najmniej jedną dużą literę'
      } else if (!/(?=.*\d)/.test(password)) {
        this.errors.password = 'Hasło musi zawierać co najmniej jedną cyfrę'
      } else {
        this.errors.password = ''
      }
      this.validatePasswordConfirm()
    },
    validatePasswordConfirm() {
      const passwordConfirm = this.form.passwordConfirm.trim()
      const password = this.form.password.trim()
      if (!passwordConfirm) {
        this.errors.passwordConfirm = 'Potwierdzenie hasła jest wymagane'
      } else if (password !== passwordConfirm) {
        this.errors.passwordConfirm = 'Hasła nie zgadzają się'
      } else {
        this.errors.passwordConfirm = ''
      }
    },
    validateNewPassword() {
      const password = this.password.trim()
      if (!password) {
        this.errors.newPassword = ''
      } else if (password.length < 8) {
        this.errors.newPassword = 'Hasło musi mieć co najmniej 8 znaków'
      } else if (!/(?=.*[a-z])/.test(password)) {
        this.errors.newPassword = 'Hasło musi zawierać co najmniej jedną małą literę'
      } else if (!/(?=.*[A-Z])/.test(password)) {
        this.errors.newPassword = 'Hasło musi zawierać co najmniej jedną dużą literę'
      } else if (!/(?=.*\d)/.test(password)) {
        this.errors.newPassword = 'Hasło musi zawierać co najmniej jedną cyfrę'
      } else {
        this.errors.newPassword = ''
      }
    },
    clearOperationError() {
      this.$store.commit('admin/clearOperationError', 'createUser')
    },
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
      this.errors = {
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        passwordConfirm: '',
        newPassword: ''
      }
    },
    async submitForm() {
      if (!this.isFormValid) {
        return
      }

      this.isSubmitting = true
      this.successMessage = ''

      try {
        if (this.isCreateMode) {
          await this.$store.dispatch('admin/createUser', {
            email: this.form.email.trim(),
            username: this.form.username.trim(),
            first_name: this.form.first_name.trim(),
            last_name: this.form.last_name.trim(),
            password: this.form.password,
            isAdmin: this.form.isAdmin
          })
          this.successMessage = 'Nowy użytkownik został utworzony. Przekierowanie...'
          setTimeout(() => {
            this.$router.push('/admin/users')
          }, 1500)
        } else {
          await this.$store.dispatch('admin/updateUser', {
            userId: this.$route.params.id,
            userData: {
              email: this.form.email.trim(),
              username: this.form.username.trim(),
              first_name: this.form.first_name.trim(),
              last_name: this.form.last_name.trim()
            }
          })
          this.successMessage = 'Dane użytkownika zostały zapisane.'
        }
      } catch (error) {
        // błąd obsługowany przez store
      } finally {
        this.isSubmitting = false
      }
    },
    async resetPassword() {
      if (!this.password || this.password.length < 8) {
        return
      }

      this.isResetting = true
      this.successMessage = ''

      try {
        await this.$store.dispatch('admin/resetUserPassword', {
          userId: this.$route.params.id,
          password: this.password
        })
        this.successMessage = 'Hasło zostało zresetowane.'
        this.password = ''
        this.errors.newPassword = ''
      } catch (error) {
        // błąd obsługiwany przez store
      } finally {
        this.isResetting = false
      }
    },
    async updateStatus() {
      this.successMessage = ''
      this.isUpdatingStatus = true
      try {
        await this.$store.dispatch('admin/changeUserStatus', {
          userId: this.$route.params.id,
          status: this.form.status
        })
        this.successMessage = 'Status konta został zaktualizowany.'
      } catch (error) {
        // obsługa w store
      } finally {
        this.isUpdatingStatus = false
      }
    },
    async updateAdminRole() {
      this.successMessage = ''
      this.isUpdatingRole = true
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
      } finally {
        this.isUpdatingRole = false
      }
    },
    async applyStatusAndRole() {
      if (!this.statusRoleDirty) return
      this.successMessage = ''
      this.isApplyingStatusRole = true
      try {
        // Apply status if changed
        if (this.selectedUser && this.selectedUser.status !== this.form.status) {
          await this.$store.dispatch('admin/changeUserStatus', {
            userId: this.$route.params.id,
            status: this.form.status
          })
        }
        // Apply role if changed
        if (this.selectedUser && this.selectedUser.isAdmin !== this.form.isAdmin) {
          await this.$store.dispatch('admin/toggleAdminRole', {
            userId: this.$route.params.id,
            isAdmin: this.form.isAdmin
          })
        }
        this.successMessage = 'Status i/lub rola zostały zaktualizowane.'
        // Refresh selected user
        await this.$store.dispatch('admin/fetchUserById', Number(this.$route.params.id))
        this.loadSelectedUser()
      } catch (error) {
        // errors handled in store
      } finally {
        this.isApplyingStatusRole = false
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
    sessionStorage.setItem('adminLastView', this.$route.fullPath)
    if (!this.isCreateMode) {
      this.$store.dispatch('admin/fetchUserById', Number(this.$route.params.id))
        .then(() => {
          this.loadSelectedUser()
        })
        .catch(() => {})
    }
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

.form-section {
  background-color: #fafbfc;
  padding: 1.5rem;
  border-radius: 0.375rem;
  border-left: 3px solid #0d6efd;
}

.form-section h5 {
  color: #212529;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.form-label {
  font-weight: 500;
  color: #212529;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-label .text-danger {
  margin-left: 0.25rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #86b7fe;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.form-control.is-invalid,
.form-select.is-invalid {
  border-color: #dc3545;
}

.form-control.is-invalid:focus,
.form-select.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.invalid-feedback i {
  margin-right: 0.25rem;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.btn i {
  margin-right: 0.375rem;
}

.alert i {
  margin-right: 0.5rem;
}

small.text-muted i {
  margin-right: 0.375rem;
  opacity: 0.7;
}
</style>
