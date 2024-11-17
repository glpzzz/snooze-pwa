import {Configuration, SnoozeApiApi} from '@/generated/openapi-snooze'; // Adjust based on generated API structure

interface UseSnoozeApiClientResponse {
    apiClient: SnoozeApiApi;
}

export function useSnoozeApi(): UseSnoozeApiClientResponse {

    // Initialize API configuration and client instance
    const config = new Configuration({
        basePath: import.meta.env.VITE_BACKEND_BASE_URL,
        apiKey: import.meta.env.VITE_BACKEND_API_KEY,
    });

    const apiClient = new SnoozeApiApi(config);

    return {
        apiClient,
    };

}
