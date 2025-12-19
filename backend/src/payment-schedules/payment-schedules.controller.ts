import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PaymentSchedulesService } from './payment-schedules.service';

@Controller('payment-schedules')
export class PaymentSchedulesController {
  constructor(private schedulesService: PaymentSchedulesService) {}

  @Get('contract/:contractId')
  findByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.schedulesService.findByContract(contractId);
  }

  @Get('contract/:contractId/overdue')
  getOverdue(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.schedulesService.getOverdueByContract(contractId);
  }

  @Get('contract/:contractId/next')
  getNextPending(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.schedulesService.getNextPending(contractId);
  }

  @Post('update-overdue')
  updateOverdueStatus() {
    return this.schedulesService.updateOverdueStatus();
  }
}
