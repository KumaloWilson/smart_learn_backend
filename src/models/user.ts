export interface User {
    uid: string;
    username: string;
    role: 'admin' | 'student' | 'lecturer';
    password: string;
    lastLogin?: Date;
    passwordChangedAt?: Date;
    active: boolean;
    loginAttempts: number;
    lockUntil?: Date;
}