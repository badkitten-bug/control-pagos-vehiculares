import { ClientsService } from './clients.service';
import { CreateClientDto, UpdateClientDto, SearchClientDto } from './dto/client.dto';
export declare class ClientsController {
    private clientsService;
    constructor(clientsService: ClientsService);
    create(dto: CreateClientDto): Promise<import("./client.entity").Client>;
    findAll(dto: SearchClientDto): Promise<import("./client.entity").Client[]>;
    getActiveClients(): Promise<import("./client.entity").Client[]>;
    findByDni(dni: string): Promise<import("./client.entity").Client | null>;
    findById(id: number): Promise<import("./client.entity").Client>;
    update(id: number, dto: UpdateClientDto): Promise<import("./client.entity").Client>;
    delete(id: number): Promise<void>;
}
