import axios from 'axios';
import FormData from 'form-data';

export const useOpenAi = () => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/audio/transcriptions';

    // Method to convert base64 to Blob
    const base64ToFile = (base64: string, mimeType = '', filename): File => {
        const byteString = atob(base64);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        mimeType = mimeType.split(';')[0];

        const blob = new Blob([uint8Array], {type: mimeType});
        return new File([blob], filename, {type: mimeType});
    }

    // Method to send audio data (Blob) to OpenAI for transcription
    const transcribeAudioBase64 = async (id: string, base64Audio: string, fileType: string): Promise<string | null> => {
        try {
            const audio = base64ToFile(base64Audio, fileType, id); // Convert base64 to Blob
            console.log('blob', audio);

            const formData = new FormData();
            formData.append('file', audio, `${id}.webm`);
            formData.append('model', 'whisper-1');
            formData.append('temperature', 0.2);
            formData.append('language', 'es');

            const response = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            // Extract transcription text from response
            if (response.data && response.data.text) {
                return response.data.text;
            }

            return null;
        } catch (error) {
            console.error('Error during transcription:', error);
            return null;
        }
    }

    return {
        transcribeAudioBase64
    }
}
