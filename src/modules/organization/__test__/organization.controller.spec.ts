/* eslint-disable @typescript-eslint/no-unused-vars */

import {OrganizationEntity} from "../organization.entity";
import {OrganizationController} from "../organization.controller";
import {Test} from "@nestjs/testing";
import {OrganizationService} from "../organization.service";
import {userEntity} from "../../auth/__test__/auth.controller.spec";
import {CreateOrganizationDto} from "../dto/CreateOrganizationDto";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {UserToOrgDto} from "../../user-org/dto/user-orgDto";
import {UserToOrgEntity} from "../../user-org/user-org.entity";
import {mockOrganizationService} from "../../__test__/base.service.specs";

let mockOrganizationEntity: OrganizationEntity = new OrganizationEntity();



describe('OrganizationController', () => {

    let organizationController: OrganizationController;
    let organizationService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({


            providers: [
                OrganizationController,
                {provide: OrganizationService, useFactory: mockOrganizationService},
            ],
        }).compile();

        organizationService = module.get<OrganizationService>(OrganizationService);

        organizationController = module.get<OrganizationController>(OrganizationController);

    });
    describe('get list Organization ', () => {
        it('should return Organization entity list', async () => {
            organizationService.getOrganizationByUserId.mockResolvedValue([mockOrganizationEntity]);
            let result = await organizationController.getOrganizationByUserId(userEntity);
            expect(result).toHaveLength(1)
        });
    });

    describe('get  Organization ', () => {
        it('should return Organization entity ', async () => {
            organizationService.getOrganizationByUserAndOrgId.mockResolvedValue(mockOrganizationEntity);
            let result = await organizationController.getOrganizationByUserIdOrgId(userEntity,"");
            expect(result).toEqual(mockOrganizationEntity)
        });

        it('should throw not found exception if organization does not exist', async () => {
            organizationService.getOrganizationByUserAndOrgId.mockResolvedValue(
                null,
            );
            await expect(
                organizationController.getOrganizationByUserIdOrgId(
                    userEntity,
                    'orgId',
                ),
            ).rejects.toThrow(NotFoundException);
        });
    });


    describe('create Organization', () => {
        it('should throw confilit exception', async () => {
            let createOrganizationDto: CreateOrganizationDto = new CreateOrganizationDto();
            createOrganizationDto.name="test"
            let entity= new UserToOrgEntity()
            const organizationEntity = new OrganizationEntity();
            organizationEntity.fName="fname"
            organizationEntity.lName="lName"
            organizationEntity.boards=[]
            organizationEntity.invitationTypeLinks=[]
            organizationEntity.users=[]
            organizationEntity.name="test"
            entity.organization= organizationEntity;

            let orgToUserDto=new UserToOrgDto(entity);
            orgToUserDto.organizationName="test"


            organizationService.getOrganizationByUserId.mockResolvedValue([orgToUserDto]);
            organizationService.create.mockResolvedValue("",orgToUserDto);
            let result =  organizationController.create(userEntity,createOrganizationDto);

            let rejected = false
            try {
                const response = await result;

            } catch (e) {
                rejected = true;
                expect(e).toEqual(new ConflictException('Organization name already exist '))
            }
            expect(rejected).toBeTruthy();
        });

        it('should return createOrganizationDto', async () => {
            let createOrganizationDto: CreateOrganizationDto = new CreateOrganizationDto();
            createOrganizationDto.name="test"
            let entity= new UserToOrgEntity()
            entity.organization=new OrganizationEntity();
            entity.organization.name="test1"
            let orgToUserDto=new UserToOrgDto(entity);
            orgToUserDto.organizationName="test1"


            organizationService.getOrganizationByUserId.mockResolvedValue([orgToUserDto]);
            organizationService.create.mockResolvedValue(mockOrganizationEntity);
            let result =await  organizationController.create(userEntity,createOrganizationDto);
            expect(result).toEqual(mockOrganizationEntity.toDto())


        });
    });

});
