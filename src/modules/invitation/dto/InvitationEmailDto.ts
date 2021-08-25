import { ApiProperty} from '@nestjs/swagger';
import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import { InvitationType } from '../../../common/constants/invitation-type';
import { PermissionEnum } from '../../../common/constants/permission';

export class InVitationEmailDto {
    @IsString()
    @IsNotEmpty({ message: 'orgId is required' })
    @ApiProperty()
    orgId: string;

    // @IsString()
    // @IsOptional({ message: 'toUserId is optional' })
    // @ApiProperty()
    // toUserId: string;

    @IsString()
    @IsNotEmpty({ message: 'toEmail is required' })
    @ApiProperty()
    toEmail: string;

    @IsString()
    @IsNotEmpty({ message: 'typeId is required' })
    @ApiProperty()
    typeId: string;

    @IsEnum(PermissionEnum)
    @IsNotEmpty({ message: 'permission is required' })
    @ApiProperty()
    permission: PermissionEnum;

    @IsEnum(InvitationType, { message: 'type is not valid' })
    @ApiProperty()
    @IsNotEmpty({ message: 'type is required' })
    type: InvitationType;
}
