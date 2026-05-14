<template>
  <aside class="admin-sidebar bg-light border rounded p-3 h-100 shadow-sm">
    <div class="d-flex align-items-center mb-4">
      <div class="admin-sidebar__icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
        <i class="fa fa-user-secret"></i>
      </div>
      <div>
        <h3 class="h6 mb-0">Panel admina</h3>
      </div>
    </div>

    <nav class="nav flex-column gap-2">
      <router-link
        v-for="item in items"
        :key="item.path"
        :to="item.path"
        class="nav-link rounded px-3 py-2 d-flex align-items-center gap-2"
        active-class="active"
        exact-active-class="active"
      >
        <span class="me-2" v-if="item.icon"><i :class="item.icon"></i></span>
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: {
    items: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.admin-sidebar {
  min-height: calc(100vh - 130px);
}

.admin-sidebar .nav-link {
  color: #343a40;
  font-weight: 500;
}

.admin-sidebar .nav-link.active {
  background-color: #0d6efd;
  color: #ffffff;
}

.admin-sidebar__icon {
  font-size: 1rem;
}
</style>
