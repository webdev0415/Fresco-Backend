import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    boardId: string;

    @IsString()
    @ApiPropertyOptional()
    message: string;
}
