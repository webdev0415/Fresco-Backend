import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthUser } from '../../decorators/auth-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { UserToOrgDto } from '../../modules/user-org/dto/user-orgDto';
import { UserEntity } from '../../modules/user/user.entity';
import { CreateOrganizationDto } from './dto/CreateOrganizationDto';
import { OrganizationDto } from './dto/OrganizationDto';
import { OrganizationService } from './organization.service';

@Controller('organization')
@ApiTags('organization')
@UseGuards(AuthGuard)
@UseInterceptors(AuthUserInterceptor)
@ApiBearerAuth()
export class OrganizationController {
    constructor(public readonly organizationService: OrganizationService) {}

    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserToOrgDto,
        description: 'get organizations by userId',
        isArray: true,
    })
    async getOrganizationByUserId(
        @AuthUser() user: UserEntity,
    ): Promise<UserToOrgDto[]> {
        return this.organizationService.getOrganizationByUserId(user.id);
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: UserToOrgDto,
        description: 'get organizations by organization id',
    })
    async getOrganizationByUserIdOrgId(
        @AuthUser() user: UserEntity,
        @Param('id') orgId: string,
    ): Promise<UserToOrgDto> {
        const org = await this.organizationService.getOrganizationByUserAndOrgId(
            user.id,
            orgId,
        );
        if (!org) {
            throw new NotFoundException('Organization not found');
        }
        return org;
    }

    @Post('')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        type: CreateOrganizationDto,
        description: 'create organization',
    })
    async create(
        @AuthUser() user: UserEntity,
        @Body() createOrganizationDto: CreateOrganizationDto,
    ): Promise<OrganizationDto> {
        const organizations = await this.organizationService.getOrganizationByUserId(
            user.id,
        );

        if (
            organizations &&
            organizations.filter(
                (d) =>
                    d.organizationName.toLowerCase() ===
                    createOrganizationDto.name.toLowerCase(),
            ).length > 0
        ) {
            throw new ConflictException('Organization name already exist ');
        }

        const organization = await this.organizationService.create(
            user.id,
            createOrganizationDto,
        );
        return organization.toDto();
    }
}
