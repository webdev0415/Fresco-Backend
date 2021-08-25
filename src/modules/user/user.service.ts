import {Injectable, NotFoundException} from '@nestjs/common';
import {UserToOrgRepository} from '../../modules/user-org/user-org.repository';
import {Brackets, FindConditions} from 'typeorm';

import {CreateUserInvitationDto} from '../../modules/auth/dto/CreateUserInvitationDto';
import {UserLoginGoogleDto} from '../auth/dto/UserLoginGoogleDto';
import {UserRegisterDto} from '../auth/dto/UserRegisterDto';
import {UserDto} from './dto/UserDto';
import {UserEntity} from './user.entity';
import {UserRepository} from './user.repository';

@Injectable()
export class UserService {
    constructor(
        public readonly userRepository: UserRepository,
        public readonly userToOrgRepository: UserToOrgRepository,
    ) {}

    /**
     * Find single user
     */
    findOne(findData: FindConditions<UserEntity>): Promise<UserEntity> {
        return this.userRepository.findOne(findData);
    }
    async findByUsernameOrEmail(
        options: Partial<{ username: string; email: string }>,
    ): Promise<UserEntity | undefined> {
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        if (options.email) {
            queryBuilder.orWhere('user.email = :email', {
                email: options.email,
            });
        }

        return queryBuilder.getOne();
    }

    async createUser(
        userRegisterDto: UserRegisterDto | CreateUserInvitationDto,
    ): Promise<UserEntity> {
        const user = this.userRepository.create({ ...userRegisterDto });

        return this.userRepository.save(user);
    }

    public async checkIfExists(email: string): Promise<boolean> {
        return (
            (await this.userRepository
                .createQueryBuilder('user')
                .where('user.email= :email', { email })
                .getCount()) > 0
        );
    }

    async createUserForGoogle(
        userLoginGoogleDto: UserLoginGoogleDto,
    ): Promise<UserEntity> {
        const user = this.userRepository.create({ ...userLoginGoogleDto });
        return this.userRepository.save(user);
    }

    async update(userLoginGoogleDto: UserLoginGoogleDto): Promise<UserEntity> {
        const user = this.userRepository.create({ ...userLoginGoogleDto });
        return this.userRepository.save(user);
    }

    async updateUser(userId: string, data: any): Promise<UserDto> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, email, ...userData } = data;

        await this.userRepository.update({ id: userId }, userData);
        const user = await this.userRepository.findOne({ id: userId });

        return new UserDto(user);
    }

    async confirmEmail(userId: string): Promise<UserDto> {
        if (!userId) {
            throw new NotFoundException();
        }
        await this.userRepository.update({ id: userId }, { verified: true });
        const user = await this.userRepository.findOne({ id: userId });
        return new UserDto(user);
    }

    async suggestEmail(email: string, orgId: string): Promise<UserDto[]> {
        const userToOrgs = await this.userToOrgRepository.find({
            where: {
                orgId,
            },
        });

        const userIds = userToOrgs.map((item) => item.userId);
        const emails = this.userRepository
            .createQueryBuilder('user')
            .where('user.email like :email', { email: `%${email}%` })
            .andWhere('user.verified = 1');

        if (userToOrgs && userToOrgs.length > 0) {
            emails.andWhere('user.id NOT IN (:userIds)', { userIds: userIds });
        }

        const result = await emails.getMany();

        return result.map((item) => item.toDto());
    }

    async searchUserByKeyWord(keyword: string, userId: string): Promise<UserDto[]> {
        console.log()
        const users = this.userRepository
            .createQueryBuilder('user')
            .where(new Brackets(qb => {
                qb.where('user.email like :email OR user.name like :name ', { email: `%${keyword}%`, name: `%${keyword}%`})
            }))
            // .orWhere('user.name like :name', { name: `%${keyword}%` })
            .andWhere('user.id != :userId', { userId })
            .andWhere('user.verified = 1');
        const result = await users.getMany();
        return result.map((item) => item.toDto());
    }
}
