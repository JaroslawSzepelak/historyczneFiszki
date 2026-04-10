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
            <button class="btn btn-primary" @click="$emit('ok')">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: 'Sesja zakończona'
    },
    message: {
      type: String,
      default: 'Sesja testowa została zakończona. Nastąpi powrót do strony głównej.'
    }
  },
  emits: ['ok']
};
</script>