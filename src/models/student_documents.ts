export interface StudentDocument {
    document_id: string;
    student_id: string;
    document_type: 'transcript' | 'certificate' | 'id_card' | 'medical_record' | 'other';
    document_number?: string;
    document_url: string;
    issue_date?: string;
    expiry_date?: string;
    status: 'active' | 'expired' | 'revoked';
    created_at?: string;
}
