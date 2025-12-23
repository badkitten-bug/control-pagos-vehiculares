import { SubcontractsService } from './subcontracts.service';
import { CreateSubcontractDto, SearchSubcontractsDto } from './dto/subcontract.dto';
export declare class SubcontractsController {
    private readonly subcontractsService;
    constructor(subcontractsService: SubcontractsService);
    create(dto: CreateSubcontractDto): Promise<import("./subcontract.entity").Subcontract>;
    findAll(dto: SearchSubcontractsDto): Promise<{
        items: import("./subcontract.entity").Subcontract[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByContract(contractId: number): Promise<import("./subcontract.entity").Subcontract[]>;
    findById(id: number): Promise<import("./subcontract.entity").Subcontract>;
    annul(id: number): Promise<import("./subcontract.entity").Subcontract>;
    getPendingBalance(id: number): Promise<number>;
}
