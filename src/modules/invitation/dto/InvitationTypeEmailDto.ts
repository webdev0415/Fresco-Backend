import { ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { InVitationEmailDto } from './InvitationEmailDto';

export class InVitationTypeEmailDto {
    @IsNotEmpty({ message: 'invitationEmails is required' })
    @IsArray({ message: 'invitationEmails must be an array' })
    invitationEmails: InVitationEmailDto[];

    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional()
    notify: number;

    @IsString({ message: 'message must be string' })
    @IsOptional()
    @ApiPropertyOptional()
    message: string;
}
