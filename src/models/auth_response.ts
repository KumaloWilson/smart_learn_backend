import { Admin } from "./admin";
import { Lecturer } from "./lecturer";
import { User } from "./user";
import {StudentAcademicProfile} from "./student_academic_profile";


export interface AuthResponse {
    user: Omit<User, 'password'>;
    role: string;
    profile: Admin | StudentAcademicProfile | Lecturer | null
    token: string
}

