import {ArgumentsHost, Catch, Optional} from '@nestjs/common';
import {BaseWsExceptionFilter} from '@nestjs/websockets';
import {Socket} from 'socket.io';

@Catch()
export class WsExceptionFilter extends BaseWsExceptionFilter {
    constructor(@Optional() private readonly event = 'exception') {
        super();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    catch(exception: any, host: ArgumentsHost) {
        const client: Socket = host.switchToWs().getClient();
        client.emit(this.event, exception);

        this.disconnect(client);
    }

    private disconnect(client: Socket) {
        return client.disconnect();
    }
}
