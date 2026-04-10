<template>
  <div v-if="visible">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
          </div>

          <div class="modal-body">
            {{ message }}
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="$emit('cancel')">
              Anuluj
            </button>
            <button class="btn btn-danger" @click="$emit('confirm')">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: 'Zakończyć test?'
    },
    message: {
      type: String,
      default: 'Czy na pewno chcesz zakończyć bieżącą sesję testową?'
    },
    confirmLabel: {
      type: String,
      default: 'Tak, zakończ'
    }
  },
  emits: ['cancel', 'confirm']
};
</script>