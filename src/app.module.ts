// import './boilerplate.polyfill';

import {
    CacheInterceptor,
    CacheModule,
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BoardGatewayModule } from './gateway/board/board.gateway.module';
import { contextMiddleware } from './middlewares';
import { AuthModule } from './modules/auth/auth.module';
import { BoardModule } from './modules/board/board.module';
import { MessageModule } from './modules/message/message.module';
import { CanvasModule } from './modules/canvas/canvas.module';
import { CategoryModule } from './modules/category/category.module';
import { DefaultTemplateModule } from './modules/default-template/default-template.module';
import { InvitationTypeLinkModule } from './modules/invitation-type-link/invitation-type-link.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { MailModule } from './modules/mail/mail.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { UploadImageModule } from './modules/upload/upload-image.module';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './shared/services/config.service';
import { SharedModule } from './shared/shared.module';
import {BoardUserOrgModule} from "./modules/board-user-org/board-user-org.module";
@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: () => ({
                ttl: 3600, // seconds
                max: 100, // maximum number of items in cache
            }),
        }),
        AuthModule,
        UserModule,
        MailModule,
        DefaultTemplateModule,
        CanvasModule,
        UploadImageModule,
        InvitationModule,
        OrganizationModule,
        BoardGatewayModule,
        BoardModule,
        MessageModule,
        CategoryModule,
        InvitationTypeLinkModule,
        BoardUserOrgModule,
        MulterModule.register({
            dest: './upload',
        }),
        TypeOrmModule.forRootAsync({
            imports: [SharedModule],
            useFactory: (configService: ConfigService) =>
                configService.typeOrmConfig,
            inject: [ConfigService],
        }),
    ],
    // providers: [
    //     {
    //         provide: APP_INTERCEPTOR,
    //         useClass: CacheInterceptor,
    //     },
    // ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer.apply(contextMiddleware).forRoutes('*');
    }
}
