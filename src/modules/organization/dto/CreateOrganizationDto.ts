import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    name: string;

    @IsString()
    @ApiPropertyOptional()
    fName: string;

    @IsString()
    @ApiPropertyOptional()
    lName: string;

    @IsString()
    @IsNotEmpty()
    @ApiPropertyOptional()
    slug: string;

}
