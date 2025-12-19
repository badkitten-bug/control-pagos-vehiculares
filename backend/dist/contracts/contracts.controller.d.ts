import { ContractsService } from './contracts.service';
import { CreateContractDto, UpdateContractDto, SearchContractsDto } from './dto/contract.dto';
export declare class ContractsController {
    private contractsService;
    constructor(contractsService: ContractsService);
    create(dto: CreateContractDto): Promise<import("./contract.entity").Contract>;
    findAll(dto: SearchContractsDto): Promise<{
        items: import("./contract.entity").Contract[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<import("./contract.entity").Contract>;
    findByVehicle(vehicleId: number): Promise<import("./contract.entity").Contract[]>;
    update(id: number, dto: UpdateContractDto): Promise<import("./contract.entity").Contract>;
    activate(id: number): Promise<import("./contract.entity").Contract>;
    cancel(id: number): Promise<import("./contract.entity").Contract>;
    annul(id: number): Promise<import("./contract.entity").Contract>;
}
