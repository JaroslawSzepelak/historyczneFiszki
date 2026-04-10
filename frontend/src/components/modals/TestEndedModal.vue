<template>
  <div v-if="visible">
    <div class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sesja zakończona</h5>
          </div>

          <div class="modal-body">
            Sesja testowa została zakończona.
            Nastąpi powrót do strony głównej.
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
    visible: Boolean
  },
  emits: ['ok']
};
</script>