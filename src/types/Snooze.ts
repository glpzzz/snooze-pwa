export interface Patient {
    name: string;
    species: string;
}

export interface Clinician {
    name: string;
}

export type ConsultationStatus =
    "IsReviewAccepted"
    | "IsRecording"
    | "IsTranslating"
    | "IsPersisting"
    | "IsReviewing"
    | "IsCompleted";

export interface Consultation {
    id: string;
    patient: Patient;
    clinician: Clinician;
    state: ConsultationStatus;
    data: string;
    file: object;
}