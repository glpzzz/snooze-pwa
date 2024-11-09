export interface Patient {
    name: string;
    species: string;
}

export interface Clinician {
    name: string;
}

export type ConsultationState =
    "Pending"
    | "Initial"
    | "IsRecording"
    | "IsTranslating"
    | "IsReviewing"
    | "IsReviewAccepted"
    | "IsPersisting"
    | "IsCompleted"
    | "Final";

export interface Consultation {
    id: string;
    patient: Patient;
    clinician: Clinician;
    state: ConsultationState;
    data: string;
    file: object;
}