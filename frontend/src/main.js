import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.min.css"

const app = createApp(App)
app.use(store).use(router)

// Check auth status on app init
store.dispatch('auth/checkAuth').catch(() => {
    // Ignore error if not authenticated
})

app.mount('#app')