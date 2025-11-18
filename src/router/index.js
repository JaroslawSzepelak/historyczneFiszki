import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorySelect from '@/views/CategorySelect.vue'
import LearningMainView from '@/views/learning/MainView.vue'
import TestingMainView from '@/views/testing/MainView.vue'
//import FlashCardsView from '@/views/testing/FlashCardsView.vue'
//import NotFoundView from '@/views/NotFoundView.vue'

const routes = [{
        path: '/',
        name: 'home',
        alias: '/home',
        component: HomeView
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
        component: TestingMainView
            /*
            children: [{
                path: 'flashcards',
                component: FlashCardsView
            }]
                */
    },
    /*
    {
        path: '/:pathMatch(.*)*',
        component: NotFoundView
    }
        */
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router