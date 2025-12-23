import { Repository } from 'typeorm';
import { PaymentSchedule } from './payment-schedule.entity';
import { Contract } from '../contracts/contract.entity';
export declare class PaymentSchedulesService {
    private scheduleRepository;
    constructor(scheduleRepository: Repository<PaymentSchedule>);
    generateSchedule(contract: Contract): Promise<PaymentSchedule[]>;
    private calculateNextDate;
    findByContract(contractId: number): Promise<PaymentSchedule[]>;
    findById(id: number): Promise<PaymentSchedule | null>;
    updateScheduleStatus(id: number, montoPagado: number): Promise<PaymentSchedule>;
    updateOverdueStatus(): Promise<void>;
    getOverdueByContract(contractId: number): Promise<PaymentSchedule[]>;
    getNextPending(contractId: number): Promise<PaymentSchedule | null>;
    applyCascadePayment(contractId: number, monto: number): Promise<PaymentSchedule[]>;
    getTotalPendingBalance(contractId: number): Promise<number>;
    saveSchedules(schedules: PaymentSchedule[]): Promise<PaymentSchedule[]>;
}
