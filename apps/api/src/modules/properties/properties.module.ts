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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean, IsEnum } from 'class-validator';

import { PrismaService } from '../../common/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

// ============ DTOs ============
export class CreatePropertyDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() slug: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() cityId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() localityId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() addressLine?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() pincode?: string;
  @ApiProperty({ required: false, enum: ['pg', 'hostel', 'apartment', 'coliving'] })
  @IsOptional() @IsEnum(['pg', 'hostel', 'apartment', 'coliving'])
  propertyType?: any;
  @ApiProperty({ required: false, enum: ['male', 'female', 'unisex'] })
  @IsOptional() @IsEnum(['male', 'female', 'unisex'])
  genderType?: any;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() startingPrice?: number;
}

export class UpdatePropertyDto extends CreatePropertyDto {}

export class ListPropertiesDto {
  @IsOptional() @IsString() q?: string;
  @IsOptional() @IsNumber() cityId?: number;
  @IsOptional() @IsNumber() localityId?: number;
  @IsOptional() @IsBoolean() isVerified?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsNumber() page?: number = 1;
  @IsOptional() @IsNumber() limit?: number = 20;
}

// ============ Service ============
@Injectable()
class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(q: ListPropertiesDto) {
    const page = q.page || 1;
    const limit = Math.min(q.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = { status: 'active' };
    if (q.q) where.name = { contains: q.q };
    if (q.cityId) where.cityId = +q.cityId;
    if (q.localityId) where.localityId = +q.localityId;
    if (q.isVerified !== undefined) where.isVerified = q.isVerified;
    if (q.isFeatured !== undefined) where.isFeatured = q.isFeatured;

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        include: {
          city: true,
          locality: true,
          images: { orderBy: { sortOrder: 'asc' }, take: 5 },
          owner: { select: { id: true, name: true, phone: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(idOrSlug: string) {
    const where = isNaN(+idOrSlug) ? { slug: idOrSlug } : { id: +idOrSlug };
    const property = await this.prisma.property.findUnique({
      where,
      include: {
        city: true,
        locality: true,
        owner: { select: { id: true, name: true, phone: true, email: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        amenities: { include: { amenity: true } },
        rooms: { include: { beds: true } },
      },
    });
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async create(dto: CreatePropertyDto, ownerId: number) {
    return this.prisma.property.create({
      data: {
        ...dto,
        ownerId,
        startingPrice: dto.startingPrice || 0,
      },
    });
  }

  async update(id: number, dto: UpdatePropertyDto, user: any) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException();
    if (property.ownerId !== user.id && user.role !== 'admin') {
      throw new NotFoundException();
    }
    return this.prisma.property.update({ where: { id }, data: dto });
  }

  async remove(id: number, user: any) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException();
    if (property.ownerId !== user.id && user.role !== 'admin') {
      throw new NotFoundException();
    }
    await this.prisma.property.delete({ where: { id } });
    return { message: 'Deleted' };
  }
}

// ============ Controller ============
@ApiTags('Properties')
@Controller('properties')
class PropertiesController {
  constructor(private service: PropertiesService) {}

  // Public — anyone can browse
  @Get()
  list(@Query() query: ListPropertiesDto) {
    return this.service.findAll(query);
  }

  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.service.findOne(idOrSlug);
  }

  // Owner/Admin only
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  create(@Body() dto: CreatePropertyDto, @CurrentUser() user: any) {
    return this.service.create(dto, user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
    @CurrentUser() user: any,
  ) {
    return this.service.update(+id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner', 'admin')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.remove(+id, user);
  }
}

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService],
})
export class PropertiesModule {}
