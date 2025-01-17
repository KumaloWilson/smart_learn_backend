import { Admin } from "./admin";
import { Lecturer } from "./lecturer";
import { Student } from "./student";
import { User } from "./user";


export interface AuthResponse {
    user: Omit<User, 'password'>;
    role: string;
    profile: Admin | Student | Lecturer | null
    token: string
}

