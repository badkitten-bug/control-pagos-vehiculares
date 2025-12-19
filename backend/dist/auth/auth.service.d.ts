import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export interface JwtPayload {
    sub: number;
    email: string;
    rol: string;
}
export interface AuthResponse {
    accessToken: string;
    user: {
        id: number;
        email: string;
        nombre: string;
        apellido: string | null;
        rol: string;
    };
}
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    validateUser(payload: JwtPayload): Promise<User | null>;
    private generateAuthResponse;
}
