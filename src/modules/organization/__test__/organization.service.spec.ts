import {Test} from '@nestjs/testing';
import {UserToOrgRepository} from "../../user-org/user-org.repository";
import {mockOrganizationRepository, mockUserToOrgRepository} from "../../__test__/base.repository.spec";

import {UserToOrgEntity} from "../../user-org/user-org.entity";
import {PermissionEnum} from "../../../common/constants/permission";

import {OrganizationService} from "../organization.service";
import {OrganizationRepository} from "../organization.repository";
import {CreateOrganizationDto} from "../dto/CreateOrganizationDto";
import {OrganizationEntity} from "../organization.entity";


describe('Organization Service', () => {

    let userToOrgRepository;
    let organizationRepository;
    let organizationService: OrganizationService
    beforeEach(async () => {

        const module = await Test.createTestingModule({
            providers: [
                {provide: UserToOrgRepository, useFactory: mockUserToOrgRepository},
                {provide: OrganizationRepository, useFactory: mockOrganizationRepository},
                OrganizationService
            ],
        }).compile();
        organizationService = module.get<OrganizationService>(OrganizationService);
        userToOrgRepository = module.get<UserToOrgRepository>(UserToOrgRepository);
        organizationRepository = module.get<OrganizationRepository>(OrganizationRepository);
    });


    describe('create', () => {

        it(' success ', async () => {
            let userToOrgEntity = new UserToOrgEntity();
            userToOrgEntity.permission = PermissionEnum.ADMIN

            organizationRepository.create.mockImplementation(async (value) => value);

            organizationRepository.save.mockImplementation(async (value) => value);
            userToOrgRepository.save.mockImplementation(async (value) => value);


            const createOrganizationDto = new CreateOrganizationDto();
            const result = await organizationService.create("id", createOrganizationDto)

            expect(result).not.toBeUndefined();

            expect(result).toEqual(createOrganizationDto)

        });


    });


    describe('checkValidToken', () => {

        it(' Exist ,Valid ', async () => {


            organizationRepository.count = jest.fn(async () => 1)
                .mockImplementationOnce(async () => 0);


            let result = await organizationService.isOrganizationNameExist("id")

            expect(result).toBeFalsy()

            result = await organizationService.isOrganizationNameExist("id")

            expect(result).toBeTruthy()

        });


    });


    describe('verify', () => {

        it('verify valid Token ', async () => {


            const organizationEntity = new OrganizationEntity();
            userToOrgRepository.find.mockReturnValue([organizationEntity]);


            let result = await organizationService.getOrganizationByUserId("id")

            expect(result).toHaveLength(1)
            expect(result).toEqual([organizationEntity].map((item) => item.toDto()))

        });

    });

    describe('getOrganizationByUserAndOrgId', () => {

        it('if exist ', async () => {


            const organizationEntity = new OrganizationEntity();
            userToOrgRepository.findOne.mockReturnValue(organizationEntity);


            let result = await organizationService.getOrganizationByUserAndOrgId("id", "orgid")

            expect(result).toEqual(organizationEntity.toDto())

        });

        it('if not exist ', async () => {


            userToOrgRepository.findOne.mockReturnValue(undefined);


            let result = await organizationService.getOrganizationByUserAndOrgId("id", "orgid")

            expect(result).toBeUndefined()

        });

    });


});
