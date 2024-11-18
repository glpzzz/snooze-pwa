import {createRouter, createWebHistory} from '@ionic/vue-router';
import {RouteRecordRaw} from 'vue-router';
import ConsultationPage from '../views/ConsultationPage.vue'
import PatientIndexPage from "@/views/patient/PatientIndexPage.vue";
import PatientViewPage from "@/views/patient/PatientViewPage.vue";
import PatientCreatePage from "@/views/patient/PatientCreatePage.vue";
import PatientUpdatePage from "@/views/patient/PatientUpdatePage.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: '/patients'
    },
    {
        path: '/patients',
        name: 'Patients',
        component: PatientIndexPage
    },
    {
        path: '/patients/:id',
        name: 'PatientView',
        component: PatientViewPage
    },
    {
        path: '/patients/:id/update',
        name: 'PatientUpdate',
        component: PatientUpdatePage
    },
    {
        path: '/patients/create',
        name: 'PatientCreate',
        component: PatientCreatePage
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
