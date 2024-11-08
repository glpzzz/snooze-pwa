// src/composables/useApiClient.ts
import {ref, onUnmounted} from 'vue';
import type {Ref} from 'vue';
import {Configuration, SnoozeApiApi} from '@/generated/openapi-snooze'; // Adjust based on generated API structure

// Initialize API configuration and client instance
const config = new Configuration({
    basePath: import.meta.env.VITE_BACKEND_BASE_URL,
    apiKey: import.meta.env.VITE_BACKEND_API_KEY,
});
const apiClient = new SnoozeApiApi(config);

interface UseSnoozeApiClientResponse<T> {
    data: Ref<T | null>;
    error: Ref<string | null>;
    loading: Ref<boolean>;
    fetchData: (apiCall: (params?: any) => Promise<T>, params?: any) => Promise<void>;
    reset: () => void;
}

export function useSnoozeApi<T>(): UseSnoozeApiClientResponse<T> {

    const data = ref<T | null>(null);
    const error = ref<string | null>(null);
    const loading = ref(false);

    const fetchData = async (apiCall: (params?: any) => Promise<T>, params?: any) => {

        console.log('fetchData', apiCall);

        loading.value = true;
        error.value = null;
        try {
            data.value = await apiCall(params);
        } catch (err: any) {
            error.value = err.message || 'An error occurred';
        } finally {
            loading.value = false;
        }
    };

    const reset = () => {
        data.value = null;
        error.value = null;
        loading.value = false;
    };

    onUnmounted(reset);

    return {
        data,
        error,
        loading,
        fetchData,
        reset,
    };

}
