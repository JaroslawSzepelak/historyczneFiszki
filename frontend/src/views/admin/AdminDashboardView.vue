<template>
  <section class="admin-dashboard container-fluid px-4 py-4">
    <div class="row gx-4">
      <div class="col-12 col-xl-3 col-xxl-2">
        <AdminSidebar :items="sidebarItems" />
      </div>

      <div class="col-12 col-xl-9 col-xxl-10">
        <div class="admin-workspace border rounded p-4 shadow-sm bg-white h-100">
          <div class="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h2 class="h4 mb-1">Panel administratora</h2>
              <p class="text-muted mb-0">Wybierz jedną z opcji po lewej stronie, aby rozpocząć.</p>
            </div>
          </div>

          <router-view />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AdminSidebar from '@/components/admin/AdminSidebar.vue'

export default {
  name: 'AdminDashboardView',
  components: {
    AdminSidebar
  },
  computed: {
    sidebarItems() {
      return [
        { path: '/admin', label: 'Strona główna', icon: 'fa fa-home' },
        { path: '/admin/users', label: 'Zarządzanie użytkownikami', icon: 'fa fa-users' }
      ]
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: calc(100vh - 120px);
}

.admin-workspace {
  min-height: 520px;
}

.admin-workspace h2 {
  font-weight: 700;
}
</style>
