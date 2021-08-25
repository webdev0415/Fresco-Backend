import {Injectable} from '@nestjs/common';

import {UserToOrgRepository} from './user-org.repository';

@Injectable()
export class UserToOrgService {
    constructor(public readonly userToOrgRepository: UserToOrgRepository) {}
}
