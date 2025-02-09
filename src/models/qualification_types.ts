export interface QualificationType {
    qualification_id: string;
    qualification_name: string;
    level: 'bachelor' | 'master' | 'doctorate' | 'professional';
    description?: string;
    created_at?: Date;
}
