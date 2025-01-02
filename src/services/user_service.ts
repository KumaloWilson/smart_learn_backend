import { UserModel } from '../models/user';
import { AdminModel } from '../models/admin';
import { StudentModel } from '../models/student';
import { LecturerModel } from '../models/lecturer';

export class UserService {
    private userModel = new UserModel();
    private adminModel = new AdminModel();
    private studentModel = new StudentModel();
    private lecturerModel = new LecturerModel();

    async login(username: string, password: string): Promise<any> {
        const user = await this.userModel.login(username, password);
        if (!user) throw new Error('Invalid username or password.');

        const { role, uid } = user;
        let profile;

        switch (role) {
            case 'admin':
                profile = await this.adminModel.getProfile(uid);
                break;
            case 'student':
                profile = await this.studentModel.getProfile(uid);
                break;
            case 'lecturer':
                profile = await this.lecturerModel.getProfile(uid);
                break;
            default:
                throw new Error('Invalid role.');
        }

        return { role, profile };
    }

    async registerUser(uid: string, username: string, role: string, password: string): Promise<any> {
        const user = await this.userModel.register(uid, username, role, password);
        return user;
    }

    async findUserByUsername(username: string): Promise<any> {
        const userAccount = await this.userModel.findUserByUsername(username);
        return userAccount;
    }
}
