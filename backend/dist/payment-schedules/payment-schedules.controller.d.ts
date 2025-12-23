import { PaymentSchedulesService } from './payment-schedules.service';
export declare class PaymentSchedulesController {
    private schedulesService;
    constructor(schedulesService: PaymentSchedulesService);
    findByContract(contractId: number): Promise<import("./payment-schedule.entity").PaymentSchedule[]>;
    getOverdue(contractId: number): Promise<import("./payment-schedule.entity").PaymentSchedule[]>;
    getNextPending(contractId: number): Promise<import("./payment-schedule.entity").PaymentSchedule | null>;
    getTotalPendingBalance(contractId: number): Promise<{
        balance: number;
    }>;
    updateOverdueStatus(): Promise<void>;
}
