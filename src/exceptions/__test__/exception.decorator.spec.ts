import {FileNotImageException} from "../file-not-image.exception";
import {UserNotFoundException} from "../user-not-found.exception";


describe('FileNotImageException', () => {
    it('Create ', () => {
        expect(new FileNotImageException("data")).toBeTruthy()
        expect(new FileNotImageException()).toBeTruthy()
    });
});

describe('UserNotImageException', () => {
    it('Create ', () => {
        expect(new UserNotFoundException("data")).toBeTruthy()
        expect(new UserNotFoundException()).toBeTruthy()
    });
});
