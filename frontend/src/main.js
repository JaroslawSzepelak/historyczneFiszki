import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import "bootstrap/dist/css/bootstrap.min.css"
import "font-awesome/css/font-awesome.min.css"

// Configure axios to send requests to backend
axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true

const app = createApp(App)
app.use(store).use(router)

// Check auth status before mounting the app so admin routes stay authenticated on refresh
store.dispatch('auth/checkAuth')
    .catch(() => {
        // Ignore error if not authenticated
    })
    .finally(() => {
        app.mount('#app')
    })