import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { UserService } from '../modules/user/user.service';
import { ConfigService } from '../shared/services/config.service';

@Injectable()
export class SocketGuard implements CanActivate {
    constructor(
        private readonly _userService: UserService,
        private readonly _configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client = context.switchToWs().getClient<Socket>();
            const token: string = client.handshake?.query?.token;
            if (!token) {
                throw new WsException('Missing token');
            }
            const decoded = jwt.verify(
                token,
                this._configService.get('JWT_SECRET_KEY'),
            ) as any;
            const user = await this._userService.findOne(decoded.id);
            if (!user) {
                throw new WsException('Token not valid');
            }
            // client.join(house_${user?.house?.id});
            context.switchToHttp().getRequest().user = user;

            return Boolean(user);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
