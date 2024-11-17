// src/stores/patientStore.js
import {defineStore} from 'pinia';
import {ref} from 'vue';
import {useSnoozeApi} from "@/composables/useSnoozeApi";
import {PatientDto, PatientListItemDto} from "@/generated/openapi-snooze";

const {apiClient} = useSnoozeApi();

export const usePatientStore = defineStore('patientStore', () => {
    const patients = ref<Array<PatientListItemDto>>([]);
    const loading = ref(false);

    const fetchPatients = async () => {
        loading.value = true;
        try {
            const response = await apiClient.patientsList();
            patients.value = response.data?.patients as Array<PatientListItemDto>;
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            loading.value = false;
        }
    };

    const fetchPatient = async (id: string) => {
        loading.value = true;
        try {
            const response = await apiClient.getPatient(id);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const createPatient = async (patient: PatientDto) => {
        loading.value = true;
        try {
            const response = await apiClient.addPatient(patient);
            return response.data;
        } catch (error) {
            console.error('Error creating patient:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    };

    const updatePatient = async (id: string, patient: PatientDto) => {
        loading.value = true;
        try {
            const response = await apiClient.updatePatient(id, patient);
            return response.data;
        } catch (error) {
            console.error('Error updating patient:', error);
            throw error;
        } finally {
            loading.value = false;
        }
    }

    const deletePatient = async (id: string) => {
        loading.value = true;
        try {
            await apiClient.deletePatient(id);
            patients.value = patients.value.filter(patient => patient.id !== id);
        } catch (error) {
            console.error('Error deleting patient:', error);
            throw error;
        } finally {
            loading.value = false;
        }
        return true;
    };

    return {patients, loading, fetchPatients, fetchPatient, createPatient, updatePatient, deletePatient};
});
