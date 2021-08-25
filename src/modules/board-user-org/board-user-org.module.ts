import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BoardUserOrgRepository} from "./board-user-org.repository";
import {BoardUserOrgService} from "./board-user-org.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            BoardUserOrgRepository,

        ]),
    ],
    controllers: [],
    providers: [BoardUserOrgService],
    exports: [BoardUserOrgService],
})
export class BoardUserOrgModule {
}
