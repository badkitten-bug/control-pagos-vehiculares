import { SettingsService } from '../settings/settings.service';
import { Payment } from '../payments/payment.entity';
import { Contract } from '../contracts/contract.entity';
export declare class ReceiptsService {
    private settingsService;
    constructor(settingsService: SettingsService);
    generateReceipt(payment: Payment, contract: Contract): Promise<Buffer>;
}
