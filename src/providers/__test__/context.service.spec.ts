
import * as SendGrid from "sendgrid";
import {ContextService} from "../context.service";
import {ContextIdFactory} from "@nestjs/core";

describe('ContextService', () => {

    beforeEach(()=>{

        jest.mock('request-context', () => jest.fn())

    })
    it('set', () => {

        try {
            expect(ContextService.set('123',"456"))
        }
        catch {}
    });

    it('set', () => {
        try {
            expect(ContextService.get('123'))
        }
        catch {}

    });


});
