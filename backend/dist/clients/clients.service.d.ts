import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto, SearchClientDto } from './dto/client.dto';
export declare class ClientsService {
    private clientRepository;
    constructor(clientRepository: Repository<Client>);
    create(dto: CreateClientDto): Promise<Client>;
    findAll(dto?: SearchClientDto): Promise<Client[]>;
    findById(id: number): Promise<Client>;
    findByDni(dni: string): Promise<Client | null>;
    update(id: number, dto: UpdateClientDto): Promise<Client>;
    delete(id: number): Promise<void>;
    getActiveClients(): Promise<Client[]>;
}
