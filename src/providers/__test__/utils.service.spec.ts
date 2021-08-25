import { UtilsService } from '../utils.service';
import {UserEntity} from "../../modules/user/user.entity";

describe('UtilsService', () => {
    it('generateHash', () => {
        expect(UtilsService.generateHash('123')).toBeTruthy();
    });

    it('generateRandomString', () => {
        expect(UtilsService.generateRandomString(123)).toBeTruthy();
    });

    it('validateHash', () => {
        expect(UtilsService.validateHash('123', '123hash')).toBeTruthy();
    });
    it('validateHash empty', () => {
        expect(UtilsService.validateHash('123', null)).toBeTruthy();
    });
    it('generateHash', () => {
        expect(UtilsService.generateHash('123')).toBeTruthy();
    });
    it('generateRandomString', () => {
        expect(UtilsService.generateRandomString(4)).toBeTruthy();
    });
    it('toDto return array', () => {
        expect(UtilsService.toDto(UserEntity,[new UserEntity()])).toBeTruthy();
    });

    it('toDto return entity', () => {
        expect(UtilsService.toDto(UserEntity,new UserEntity())).toBeTruthy();
    });
});
