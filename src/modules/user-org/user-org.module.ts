import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UserToOrgRepository} from './user-org.repository';
import {UserToOrgService} from './user-org.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserToOrgRepository]),
    ],
    exports: [UserToOrgService],
    providers: [UserToOrgService],
})
export class UserToOrgModule {}
