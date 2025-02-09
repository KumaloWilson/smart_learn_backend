export interface LecturerQualification {
    lecturer_qualification_id: string;
    lecturer_id: string;
    qualification_id: string;
    institution_name: string;
    year_obtained: number;
    field_of_study: string;
    document_url?: string;
    created_at?: Date;
}
