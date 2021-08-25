import { Module } from '@nestjs/common';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';

import { ConfigService } from '../../shared/services/config.service';
import { MailService } from './mail.service';

@Module({
    imports: [
        SendGridModule.forRootAsync({
            useFactory: (configService: ConfigService) => ({
                apiKey: configService.sendGridConfig.sendGridApiKey,
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    exports: [MailService],
    providers: [MailService],
})
export class MailModule {}
