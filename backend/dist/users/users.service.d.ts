import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(email: string, password: string, nombre: string, apellido?: string): Promise<User>;
    validatePassword(user: User, password: string): Promise<boolean>;
    findAll(): Promise<User[]>;
}
