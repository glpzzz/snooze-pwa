import axios from 'axios';

export const useBackend = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;

    const getPatients = async () => {
        const response = await axios.get(`${apiUrl}/patients`);
        if (response.patients) {
            return response.patients;
        }
        return null;
    }

    const getConsultations = async () => {
        const response = await axios.get(`${apiUrl}/consultations`);
        if (response.data) {
            return response.data;
        }
        return null;
    }

    const getConsultation = async (consultationId: string) => {
        const response = await axios.get(`${apiUrl}/consultation/${consultationId}`);
        if (response.data) {
            return response.data;
        }
        return null;
    }

    const getConsultationStatus = async (consultationId: string) => {
        const response = await axios.get(`${apiUrl}/consultation/status/${consultationId}`);
        if (response.data) {
            return response.data;
        }
        return null;
    }

    const createConsultation = async (patientId: string, clinicClinicianId: string) => {

        const response = await axios.post(
            `${apiUrl}/consultation`,
            {
                'patientId': patientId,
                'clinicClinicianId': clinicClinicianId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (response.data) {
            return response.data;
        }

        return null;
    }

    const transcribeAudioBase64 = async (consultationId: string, base64Audio: string, mimeType: string): Promise<string | null> => {
        const response = await axios.put(
            `${apiUrl}/consultation/speak`,
            {
                'consultationId': consultationId,
                'recording': base64Audio,
                // 'mimeType': mimeType,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Extract transcription text from response
        if (response.data && response.data.transcription) {
            return response.data.transcription;
        }

        return null;
    }

    const completeConsultation = async (consultationId: string) => {
        const response = await axios.put(
            `${apiUrl}/consultation/complete`,
            {
                'consultationId': consultationId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data) {
            return response.data;
        }

        return null;
    }

    return {
        getConsultations,
        getConsultation,
        getConsultationStatus,
        createConsultation,
        transcribeAudioBase64,
        completeConsultation,
    }
}
