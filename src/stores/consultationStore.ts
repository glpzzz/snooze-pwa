// src/stores/patientStore.js
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useSnoozeApi} from "@/composables/useSnoozeApi";
import {ConsultationDetailDto} from "@/generated/openapi-snooze";

const {apiClient} = useSnoozeApi();

export const useConsultationStore = defineStore('consultationStore', () => {
    const consultations = ref<Array<ConsultationDetailDto>>([]);
    const loading = ref(false);

    const getConsultations = async () => {
        loading.value = true;
        try {
            const response = await apiClient.consultationsList();
            consultations.value = response.data as Array<ConsultationDetailDto>;
        } catch (error) {
            console.error('Error fetching consultations:', error);
        } finally {
            loading.value = false;
        }
    };

    const getConsultationsForClient = async (patientId: string) => {
        loading.value = true;
        try {
            const response = await apiClient.getPatientConsultations(patientId);
            consultations.value = response.data as Array<ConsultationDetailDto>;
        } catch (error) {
            console.error('Error fetching consultations:', error);
        } finally {
            loading.value = false;
        }
    };

    const getConsultation = async (id: string) => {
        loading.value = true;
        try {
            const response = await apiClient.consultationDetails(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching consultation:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const createConsultation = async (patientId: string, clinicClinicianId: string) => {
        loading.value = true;
        try {
            const response = await apiClient.createConsultation({
                patientId: patientId,
                clinicClinicianId: clinicClinicianId
            });
            return response.data;
        } catch (error) {
            console.error('Error creating consultation:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    return {consultations, loading, getConsultations, getConsultationsForClient, getConsultation, createConsultation};
});
