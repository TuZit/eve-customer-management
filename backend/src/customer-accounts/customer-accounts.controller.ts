import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type {
  CreateCustomerAccountRequest,
  CustomerAddressDto,
  CustomerContactDto,
  ListCustomerAccountsQuery,
  UpdateAccountStatusRequest,
  UpdateCustomerAccountRequest,
  UpsertCustomerAccountRequest,
} from './customer-account.models';
import { CustomerAccountsService } from './customer-accounts.service';

@Controller('customer-accounts')
export class CustomerAccountsController {
  constructor(
    private readonly customerAccountsService: CustomerAccountsService,
  ) {}

  @Post()
  create(@Body() body: CreateCustomerAccountRequest) {
    return this.customerAccountsService.create(body);
  }

  @Get()
  list(@Query() query: ListCustomerAccountsQuery) {
    return this.customerAccountsService.list(query);
  }

  @Post('upsert')
  upsert(@Body() body: UpsertCustomerAccountRequest) {
    return this.customerAccountsService.upsert(body);
  }

  @Patch('upsert/by-external-id/:sourceSystem/:externalId')
  upsertByExternalId(
    @Param('sourceSystem') sourceSystem: string,
    @Param('externalId') externalId: string,
    @Body() body: CreateCustomerAccountRequest | UpdateCustomerAccountRequest,
  ) {
    return this.customerAccountsService.upsertByExternalId(
      sourceSystem,
      externalId,
      body,
    );
  }

  @Get('by-code/:customerCode')
  findByCode(@Param('customerCode') customerCode: string) {
    return this.customerAccountsService.findByCode(customerCode);
  }

  @Get('by-account-number/:accountNumber')
  findByAccountNumber(@Param('accountNumber') accountNumber: string) {
    return this.customerAccountsService.findByAccountNumber(accountNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerAccountsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: UpdateCustomerAccountRequest) {
    return this.customerAccountsService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: UpdateAccountStatusRequest,
  ) {
    return this.customerAccountsService.updateStatus(id, body.status);
  }

  @Get(':id/contacts')
  listContacts(@Param('id') id: string) {
    return this.customerAccountsService.listContacts(id);
  }

  @Post(':id/contacts')
  addContact(@Param('id') id: string, @Body() body: CustomerContactDto) {
    return this.customerAccountsService.addContact(id, body);
  }

  @Get(':id/addresses')
  listAddresses(@Param('id') id: string) {
    return this.customerAccountsService.listAddresses(id);
  }

  @Post(':id/addresses')
  addAddress(@Param('id') id: string, @Body() body: CustomerAddressDto) {
    return this.customerAccountsService.addAddress(id, body);
  }

  @Get(':id/children')
  getChildren(@Param('id') id: string) {
    return this.customerAccountsService.getChildren(id);
  }

  @Get(':id/hierarchy')
  getHierarchy(@Param('id') id: string) {
    return this.customerAccountsService.getHierarchy(id);
  }
}
