export interface User {
    uid: string;
    username: string;
    role: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}
