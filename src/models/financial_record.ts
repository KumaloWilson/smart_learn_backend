export interface StudentFinancialRecord {
    finance_id: string;
    student_id: string;
    academic_year: string;
    semester: 'fall' | 'spring' | 'summer';
    fee_type: 'tuition' | 'accommodation' | 'library' | 'laboratory' | 'other';
    amount: number;
    due_date?: string;
    payment_status: 'pending' | 'partial' | 'paid' | 'overdue';
    payment_date?: string;
    payment_reference?: string;
    created_at?: string;
    updated_at?: string;
}
