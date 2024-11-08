import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import ConsultationListPage from '../views/ConsultationListPage.vue'
import ConsultationPage from '../views/ConsultationPage.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/consultations'
    },
    {
        path: '/consultations',
        name: 'Consultations',
        component: ConsultationListPage
    },
    {
        path: '/consultations/:id',
        name: 'Consultation Details',
        component: ConsultationPage
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router
