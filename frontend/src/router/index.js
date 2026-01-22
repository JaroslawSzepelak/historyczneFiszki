/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorySelect from '@/views/CategorySelect.vue'
import LearningMainView from '@/views/learning/MainView.vue'
import TestsMainView from '@/views/flashcards/MainView.vue'
import TestView from '@/views/learning/TestView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NoAccess from '@/views/NoAccess.vue'
import store from '@/store'

const routes = [{
        path: '/',
        name: 'home',
        alias: '/home',
        component: HomeView,
    },
    {
        path: '/:op(learning|flashcards)',
        name: 'category',
        component: CategorySelect
    },
    {
        path: '/learning/:area/:era',
        component: LearningMainView
    },
    {
        path: '/flashcards/:area/:era',
        component: TestsMainView,
    },
    {
        path: '/learning/:area/:era/tests',
        name: "Tests",
        component: TestView,
        beforeEnter: (to, from, next) => {
            if (store.state.flashcards.accessible) {
                next();
            } else {
                next('/no-access')
            }
        },
    },
    {
        path: '/flashcards/:area/:era/flashcard',
        name: "Flashcards",
        component: TestView,
        beforeEnter: (to, from, next) => {
            if (store.state.flashcards.accessible) {
                next();
            } else {
                next('/no-access')
            }
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: "NotFound",
        component: NotFoundView
    },
    {
        path: '/no-access',
        name: "NoAccess",
        component: NoAccess
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/testing/polska/prehistoria' || to.path == '/testing/polska/starozytnosc') next({ name: "NotFound" })
    else {
        next()
    }
})

export default router