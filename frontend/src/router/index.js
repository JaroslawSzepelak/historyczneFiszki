/* eslint-disable no-unused-vars */
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorySelect from '@/views/CategorySelect.vue'
import LearningMainView from '@/views/learning/MainView.vue'
import TestsMainView from '@/views/flashcards/MainView.vue'
import TestView from '@/views/learning/TestView.vue'
import FlashcardView from '@/views/flashcards/FlashcardView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import NoAccess from '@/views/NoAccess.vue'
import LoginView from '@/views/LoginView.vue'
import AdminLoginView from '@/views/AdminLoginView.vue'
import AdminDashboardView from '@/views/admin/AdminDashboardView.vue'
import AdminWelcomeView from '@/views/admin/AdminWelcomeView.vue'
import AdminUsersView from '@/views/admin/AdminUsersView.vue'
import AdminFlashcardsView from '@/views/admin/AdminFlashcardsView.vue'
import UserEditView from '@/views/admin/UserEditView.vue'
import FlashcardEditView from '@/views/admin/FlashcardEditView.vue'
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
        component: TestView
    },
    {
        path: '/flashcards/:area/:era/flashcard',
        name: "Flashcards",
        component: FlashcardView,
        beforeEnter: (to, from, next) => {
            if (store.state.flashcards.accessible) {
                next();
            } else {
                next('/no-access')
            }
        },
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { isPublic: true }
    },
    {
        path: '/admin-login',
        name: 'admin-login',
        component: AdminLoginView,
        meta: { isPublic: true }
    },
    {
        path: '/admin',
        component: AdminDashboardView,
        meta: { requiresAdmin: true },
        children: [
            {
                path: '',
                name: 'admin-home',
                component: AdminWelcomeView
            },
            {
                path: 'users',
                name: 'admin-users',
                component: AdminUsersView
            },
            {
                path: 'users/create',
                name: 'admin-user-create',
                component: UserEditView,
                props: true
            },
            {
                path: 'users/:id/edit',
                name: 'admin-user-edit',
                component: UserEditView,
                props: true
            },
            {
                path: 'flashcards',
                name: 'admin-flashcards',
                component: AdminFlashcardsView
            },
            {
                path: 'flashcards/create',
                name: 'admin-flashcard-create',
                component: FlashcardEditView,
                props: true
            },
            {
                path: 'flashcards/:id/edit',
                name: 'admin-flashcard-edit',
                component: FlashcardEditView,
                props: true
            }
        ]
    },
    {
        path: '/no-access',
        name: "NoAccess",
        component: NoAccess
    },
    {
        path: '/:pathMatch(.*)*',
        name: "NotFound",
        component: NotFoundView
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated']
    const isAdmin = store.getters['auth/isAdmin']
    const requiresAdmin = to.matched.some(record => record.meta?.requiresAdmin)
    const isPublic = to.matched.some(record => record.meta?.isPublic)

    if (isPublic && isAuthenticated) {
        if (to.name === 'admin-login') {
            next(isAdmin ? '/admin' : '/')
            return
        }
        if (to.name === 'login') {
            next(isAdmin ? '/admin' : '/')
            return
        }
    }

    if (requiresAdmin && !isAuthenticated) {
        next('/admin-login')
        return
    }

    if (requiresAdmin && !isAdmin) {
        next('/no-access')
        return
    }

    // Keep existing test paths logic
    if (to.path == '/testing/polska/prehistoria' || to.path == '/testing/polska/starozytnosc') {
        next({ name: "NotFound" })
        return
    }

    next()
})

export default router