import { Repository } from 'typeorm';
import { Subcontract, SubcontractSchedule } from './subcontract.entity';
import { CreateSubcontractDto, SearchSubcontractsDto } from './dto/subcontract.dto';
import { ContractsService } from '../contracts/contracts.service';
import { PaymentSchedulesService } from '../payment-schedules/payment-schedules.service';
export declare class SubcontractsService {
    private subcontractRepository;
    private scheduleRepository;
    private contractsService;
    private paymentSchedulesService;
    constructor(subcontractRepository: Repository<Subcontract>, scheduleRepository: Repository<SubcontractSchedule>, contractsService: ContractsService, paymentSchedulesService: PaymentSchedulesService);
    create(dto: CreateSubcontractDto): Promise<Subcontract>;
    private generateIndependentSchedule;
    private calculateNextDate;
    private addToPendingSchedules;
    findById(id: number): Promise<Subcontract>;
    findByContract(contractId: number): Promise<Subcontract[]>;
    findAll(dto: SearchSubcontractsDto): Promise<{
        items: Subcontract[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    annul(id: number): Promise<Subcontract>;
    getScheduleById(scheduleId: number): Promise<SubcontractSchedule | null>;
    updateSchedulePayment(scheduleId: number, montoPagado: number): Promise<SubcontractSchedule>;
    getPendingBalance(subcontractId: number): Promise<number>;
}
