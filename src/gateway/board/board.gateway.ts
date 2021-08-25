import { UseFilters, UseGuards } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { BoardEventEnum } from '../../common/constants/board-event';
import { WsExceptionFilter } from '../../common/filters/ws-exception.filter';
import { SocketGuard } from '../../guards/socket.guard';
import { UserService } from '../../modules/user/user.service';
import { ConfigService } from '../../shared/services/config.service';
import { BoardEventDto } from './dto/board-event.dto';

@UseGuards(SocketGuard)
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({ namespace: '/board', transports: ['websocket'] })
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly _configService: ConfigService,
        private readonly _userService: UserService,
    ) {}
    @WebSocketServer()
    server: Server;

    @SubscribeMessage(BoardEventEnum.CREATE)
    create(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.CREATE, data);
    }

    @SubscribeMessage(BoardEventEnum.JOIN_BOARD)
    joinBoard(
        @ConnectedSocket() client: Socket,
        @MessageBody() boardId: string,
    ): void {
        client.join(boardId);
        client.emit(BoardEventEnum.JOIN_BOARD, boardId);
    }

    @SubscribeMessage(BoardEventEnum.LEAVE_BOARD)
    leaveBoard(
        @ConnectedSocket() client: Socket,
        @MessageBody() boardId: string,
    ): void {
        client.leave(boardId);
        client.emit(BoardEventEnum.LEAVE_BOARD, boardId);
    }

    @SubscribeMessage(BoardEventEnum.UPDATE)
    update(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.UPDATE, data);
    }

    @SubscribeMessage(BoardEventEnum.MOVE)
    move(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): void {
        this.boardcastToBoardId(client, BoardEventEnum.MOVE, data);
    }

    @SubscribeMessage(BoardEventEnum.DELETE)
    delete(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.DELETE, data);
    }

    @SubscribeMessage(BoardEventEnum.UNLOCK)
    unlock(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.UNLOCK, data);
    }

    @SubscribeMessage(BoardEventEnum.LOCK)
    lock(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: BoardEventDto,
    ): any {
        this.boardcastToBoardId(client, BoardEventEnum.LOCK, data);
    }

    handleConnection() {
        console.log('connected');
    }

    handleDisconnect() {
        console.log('disconnect');
    }

    boardcastToBoardId(socket: Socket, eventName: string, data: BoardEventDto) {
        if (socket) {
            socket.broadcast.to(data.boardId).emit(eventName, data.data);
        } else {
            this.server.to(data.boardId).emit(eventName, data.data);
        }
    }
}
