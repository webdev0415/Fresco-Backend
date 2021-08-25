
import {Test} from "@nestjs/testing";
import {mockConfigService, mockGeneratorService} from "../../__test__/base.service.specs";
import mock = jest.mock;
import {UserSubscriber} from "../user-subscriber";
import {UserEntity} from "../../../modules/user/user.entity";

describe('UserSubscriber', () => {

    let userSubscriber:UserSubscriber;
    beforeEach(async () => {
        userSubscriber=new UserSubscriber()
    });

    describe('listenTo', () => {

        it('called', async () => {

            expect(userSubscriber.listenTo()).toEqual(UserEntity)
        });
    });

    describe('beforeInsert', () => {

        it('should change password ', async () => {

            expect(userSubscriber.beforeInsert({entity:<any>{password:"test"}}as any) as any).toBeUndefined()
        });

        it("should do nothing if there's no password ", async () => {
            expect(userSubscriber.beforeInsert({entity:<any>{}}as any) as any).toBeUndefined()
        });
    });

});
