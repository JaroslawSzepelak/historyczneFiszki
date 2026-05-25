<template>
  <div class="admin-welcome d-flex align-items-center justify-content-center h-100">
    <div class="text-center p-5 rounded-4 border border-dashed bg-light">
      <h3 class="mb-3">Witaj w panelu administratora</h3>
      <p class="text-muted mb-4">
        Wybierz element z menu po lewej stronie, aby rozpocząć zarządzanie użytkownikami.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminWelcomeView'
}
</script>

<style scoped>
.admin-welcome {
  min-height: 420px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>
