export interface LecturerDepartmentAffiliation {
    affiliation_id: string;
    lecturer_id: string;
    department_id: string;
    start_date: Date;
    end_date?: Date;
    is_primary: boolean;
    created_at?: Date;
}
