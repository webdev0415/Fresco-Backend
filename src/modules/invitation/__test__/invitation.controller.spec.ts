/* eslint-disable @typescript-eslint/no-unused-vars */


import {InvitationController} from "../invitation.controller";
import {InvitationEntity} from "../invitation.entity";
import {InvitationService} from "../invitation.service";
import {CreateUserInvitationDto} from "../../auth/dto/CreateUserInvitationDto";
import {userEntity} from "../../auth/__test__/auth.controller.spec";
import {InvitationDto} from "../dto/InvitationDto";
import {SendInvitationDto} from "../dto/SendInvitationDto";
import {Test} from "@nestjs/testing";
import {VerifyTokenDto} from "../dto/VerifyTokenDto";
import {LoginPayloadDto} from "../../auth/dto/LoginPayloadDto";
import {mockInvitationService} from "../../__test__/base.service.specs";
import { UserEntity } from '../../user/user.entity';
import { InvitationType } from '../../../common/constants/invitation-type';
import { InVitationTypeEmailDto } from '../dto/InvitationTypeEmailDto';

let mockInvitationEntity: InvitationEntity = new InvitationEntity();


describe('InvitationController', () => {

    let invitationController: InvitationController;
    let invitationService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                InvitationController,
                {provide: InvitationService, useFactory: mockInvitationService},
            ],
        }).compile();

        invitationController = module.get<InvitationController>(InvitationController);
        invitationService = module.get<InvitationService>(InvitationService);

    });

    describe('create Invitation', () => {
        it('should return createInvitationDto', async () => {
            let createInvitationDto: SendInvitationDto = new SendInvitationDto();

            invitationService.create.mockResolvedValue(mockInvitationEntity);
            let result = await invitationController.create(userEntity,createInvitationDto);
            expect(result).toEqual(mockInvitationEntity.toDto())
        });
    });

    describe('update Invitation', () => {
        it('should return InvitationDto', async () => {
            let createInvitationDto: InvitationDto = new InvitationDto(mockInvitationEntity);

            invitationService.resendInvitation.mockResolvedValue(mockInvitationEntity);
            let result = await invitationController.resendInvitation("", createInvitationDto);
            expect(result).toEqual(mockInvitationEntity)
        });
    });

    describe('check token Invitation ', () => {
        it('should return Invitation dto', async () => {
            invitationService.checkValidToken.mockResolvedValue(mockInvitationEntity);
            let result = await invitationController.checkValidToken("");
            expect(result).toEqual(mockInvitationEntity.toDto())
        });
    });


    describe('verify token Invitation ', () => {
        it('should return Invitation dto', async () => {

            invitationService.verify.mockResolvedValue(mockInvitationEntity);
            let result = await invitationController.verifyToken(new VerifyTokenDto());
            expect(result).toEqual(mockInvitationEntity)
        });
    });

    describe('invitationEmail', () => {
        it('should return invitation type emails', async () => {
            const user = ({ id: 'userId' } as unknown) as UserEntity;
            const list = ([
                { toEmail: 'john@site.com', type: InvitationType.CANVAS },
            ] as unknown) as InVitationTypeEmailDto;

            await expect(
                invitationController.invitationEmail(user, list),
            ).resolves.toBeUndefined();

            expect(invitationService.invitationTypeEmails).toBeCalledWith(
                user,
                list,
            );
        });
    });
});
