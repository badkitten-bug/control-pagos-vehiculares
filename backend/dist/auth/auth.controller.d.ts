import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { User } from '../users/user.entity';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").AuthResponse>;
    login(dto: LoginDto): Promise<import("./auth.service").AuthResponse>;
    getProfile(user: User): Promise<{
        id: number;
        email: string;
        nombre: string;
        apellido: string;
        rol: import("../users/user.entity").UserRole;
    }>;
}
