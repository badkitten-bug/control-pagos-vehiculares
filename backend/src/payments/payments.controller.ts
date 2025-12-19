import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, SearchPaymentsDto } from './dto/payment.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: User) {
    return this.paymentsService.create(dto, user);
  }

  @Get()
  findAll(@Query() dto: SearchPaymentsDto) {
    return this.paymentsService.findAll(dto);
  }

  @Get('contract/:contractId')
  findByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.paymentsService.findByContract(contractId);
  }

  @Get('contract/:contractId/total')
  getTotalByContract(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.paymentsService.getTotalByContract(contractId);
  }

  @Get('contract/:contractId/last')
  getLastPayment(@Param('contractId', ParseIntPipe) contractId: number) {
    return this.paymentsService.getLastPayment(contractId);
  }
}
