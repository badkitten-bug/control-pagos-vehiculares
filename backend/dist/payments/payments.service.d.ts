import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto, SearchPaymentsDto } from './dto/payment.dto';
import { ContractsService } from '../contracts/contracts.service';
import { PaymentSchedulesService } from '../payment-schedules/payment-schedules.service';
import { User } from '../users/user.entity';
export declare class PaymentsService {
    private paymentRepository;
    private contractsService;
    private schedulesService;
    constructor(paymentRepository: Repository<Payment>, contractsService: ContractsService, schedulesService: PaymentSchedulesService);
    create(dto: CreatePaymentDto, user: User): Promise<Payment>;
    findAll(dto: SearchPaymentsDto): Promise<{
        items: Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByContract(contractId: number): Promise<Payment[]>;
    getTotalByContract(contractId: number): Promise<number>;
    getLastPayment(contractId: number): Promise<Payment | null>;
    findById(id: number): Promise<Payment | null>;
}
