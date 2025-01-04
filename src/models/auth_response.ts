import { Admin } from "./admin";
import { Lecturer } from "./lecturer";
import { Student } from "./student";
import { User } from "./user";

export interface AuthResponse {
    user: User;
    role: 'admin' | 'student' | 'lecturer';
    profile: Admin | Student | Lecturer | null
}