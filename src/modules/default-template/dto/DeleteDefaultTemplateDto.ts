'use strict';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteDefaultTemplateDto {
    @ApiPropertyOptional()
    defaultTemplateId: string;
}
