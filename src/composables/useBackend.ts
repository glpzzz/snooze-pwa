import axios from 'axios';

export const useBackend = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const transcribeAudioBase64 = async (consultationId: string, base64Audio: string, mimeType: string): Promise<string | null> => {
        const response = await axios.post(
            `${apiUrl}/consultation/speak`,
            {
                'consultationId': consultationId,
                'recording': base64Audio,
                'mimeType': mimeType,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract transcription text from response
        if (response.transcription) {
            return response.transcription;
        }

        return null;
    }

    return {
        transcribeAudioBase64
    }
}
