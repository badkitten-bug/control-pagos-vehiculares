import { PaymentsService } from './payments.service';
import { CreatePaymentDto, SearchPaymentsDto } from './dto/payment.dto';
import { User } from '../users/user.entity';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    create(dto: CreatePaymentDto, user: User): Promise<import("./payment.entity").Payment>;
    findAll(dto: SearchPaymentsDto): Promise<{
        items: import("./payment.entity").Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByContract(contractId: number): Promise<import("./payment.entity").Payment[]>;
    getTotalByContract(contractId: number): Promise<number>;
    getLastPayment(contractId: number): Promise<import("./payment.entity").Payment | null>;
}
