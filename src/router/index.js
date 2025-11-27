/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorySelect from '@/views/CategorySelect.vue'
import LearningMainView from '@/views/learning/MainView.vue'
import TestingMainView from '@/views/testing/MainView.vue'
import FlashCardsView from '@/views/testing/FlashCardsView.vue'
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
        path: '/:op(learning|testing)',
        name: 'category',
        component: CategorySelect
    },
    {
        path: '/learning/:area/:era',
        component: LearningMainView
    },
    {
        path: '/testing/:area/:era',
        component: TestingMainView,
    },
    {
        path: '/testing/:area/:era/flashcards',
        name: "Flashcards",
        component: FlashCardsView,
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