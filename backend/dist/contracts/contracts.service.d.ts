import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { CreateContractDto, UpdateContractDto, SearchContractsDto } from './dto/contract.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
import { PaymentSchedulesService } from '../payment-schedules/payment-schedules.service';
export declare class ContractsService {
    private contractRepository;
    private vehiclesService;
    private schedulesService;
    constructor(contractRepository: Repository<Contract>, vehiclesService: VehiclesService, schedulesService: PaymentSchedulesService);
    create(dto: CreateContractDto): Promise<Contract>;
    findAll(dto: SearchContractsDto): Promise<{
        items: Contract[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: number): Promise<Contract>;
    findByVehicle(vehicleId: number): Promise<Contract[]>;
    update(id: number, dto: UpdateContractDto): Promise<Contract>;
    activate(id: number): Promise<Contract>;
    cancel(id: number): Promise<Contract>;
    annul(id: number): Promise<Contract>;
    markInitialPaymentRegistered(id: number): Promise<Contract>;
}
