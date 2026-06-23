import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Module,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsEmail } from 'class-validator';

import { PrismaService } from '../../common/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

export class CreateTenantDto {
  @ApiProperty() @IsNumber() propertyId: number;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() phone: string;
  @ApiProperty({ required: false }) @IsOptional() @IsEmail() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() occupation?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() roomNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bedNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() monthlyRent?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() securityDeposit?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() moveInDate?: string;
}

@Injectable()
class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(user: any, query: any) {
    const where: any = {};
    if (user.role === 'owner') where.ownerId = user.id;
    if (query.status) where.status = query.status;
    if (query.kyc) where.kycStatus = query.kyc;
    if (query.q) {
      where.OR = [
        { name: { contains: query.q } },
        { phone: { contains: query.q } },
      ];
    }

    const page = +query.page || 1;
    const limit = Math.min(+query.limit || 20, 100);

    const [items, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          property: true,
          owner: { select: { id: true, name: true } },
          documents: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number, user: any) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        property: true,
        owner: { select: { id: true, name: true } },
        documents: true,
        bills: { take: 10, orderBy: { createdAt: 'desc' } },
        complaints: { take: 10, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!tenant) throw new NotFoundException();
    if (user.role === 'owner' && tenant.ownerId !== user.id) {
      throw new ForbiddenException();
    }
    return tenant;
  }

  async create(dto: CreateTenantDto, user: any) {
    return this.prisma.tenant.create({
      data: {
        ...dto,
        ownerId: user.id,
        moveInDate: dto.moveInDate ? new Date(dto.moveInDate) : null,
        monthlyRent: dto.monthlyRent || 0,
        securityDeposit: dto.securityDeposit || 0,
      },
    });
  }

  async update(id: number, dto: any, user: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException();
    if (user.role === 'owner' && tenant.ownerId !== user.id) {
      throw new ForbiddenException();
    }
    if (dto.moveInDate) dto.moveInDate = new Date(dto.moveInDate);
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  async approveKyc(id: number) {
    return this.prisma.tenant.update({
      where: { id },
      data: { kycStatus: 'approved' },
    });
  }

  async rejectKyc(id: number, remarks: string) {
    return this.prisma.tenant.update({
      where: { id },
      data: { kycStatus: 'rejected', kycRemarks: remarks },
    });
  }

  async remove(id: number, user: any) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException();
    if (user.role === 'owner' && tenant.ownerId !== user.id) {
      throw new ForbiddenException();
    }
    await this.prisma.tenant.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}

@ApiTags('Tenants')
@Controller('tenants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
class TenantsController {
  constructor(private service: TenantsService) {}

  @Get()
  @Roles('owner', 'admin')
  list(@CurrentUser() user: any, @Query() query: any) {
    return this.service.findAll(user, query);
  }

  @Get(':id')
  @Roles('owner', 'admin')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.findOne(+id, user);
  }

  @Post()
  @Roles('owner', 'admin')
  create(@Body() dto: CreateTenantDto, @CurrentUser() user: any) {
    return this.service.create(dto, user);
  }

  @Patch(':id')
  @Roles('owner', 'admin')
  update(
    @Param('id') id: string,
    @Body() dto: any,
    @CurrentUser() user: any,
  ) {
    return this.service.update(+id, dto, user);
  }

  @Patch(':id/kyc/approve')
  @Roles('owner', 'admin')
  approveKyc(@Param('id') id: string) {
    return this.service.approveKyc(+id);
  }

  @Patch(':id/kyc/reject')
  @Roles('owner', 'admin')
  rejectKyc(@Param('id') id: string, @Body('remarks') remarks: string) {
    return this.service.rejectKyc(+id, remarks);
  }

  @Delete(':id')
  @Roles('owner', 'admin')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(+id, user);
  }
}

@Module({
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
