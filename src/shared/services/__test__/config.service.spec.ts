import { ConfigService } from '../config.service';
import { SnakeNamingStrategy } from '../../../snake-naming.strategy';
import * as path from 'path';

describe('ConfigService', () => {
    const configService = new ConfigService();

    beforeEach(() => {
        jest.resetModules();
    });

    it('isDevelopment', () => {
        if (configService.nodeEnv === 'development') {
            expect(configService.isDevelopment).toEqual(true);
        } else {
            expect(configService.isDevelopment).toEqual(false);
        }
    });

    it('isProduction', () => {
        if (configService.nodeEnv === 'production') {
            expect(configService.isProduction).toEqual(true);
        } else {
            expect(configService.isProduction).toEqual(false);
        }
    });

    it('sendGridConfig', () => {
        expect(configService.sendGridConfig).toEqual({
            sendGridApiKey: configService.get('SENDGRID_API_KEY'),
            emailFrom: configService.get('EMAIL_FROM'),
        });
    });

    it('typeOrmConfig', async () => {
        const migration = './../../migrations/migration.ts';
        const entity = './../../modules/user.entity.ts';

        jest.mock('../../shared.utils', () => ({
            isHotModule: jest.fn().mockReturnValue(true),
            requireContext: jest.fn((r, p) => {
                const file = p.endsWith('migrations') ? migration : entity;

                const context = () => ({ id: file });
                context.keys = jest.fn().mockReturnValue(['id']);

                return context;
            }),
        }));

        // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars,@typescript-eslint/tslint/config,no-shadow
        const { ConfigService } = await import('../config.service');

        // eslint-disable-next-line no-shadow
        const configService = new ConfigService();

        const entities = [entity];
        const migrations = [migration];
        expect(configService.typeOrmConfig).toEqual(
            expect.objectContaining({
                entities,
                migrations,
                keepConnectionAlive: true,
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.getNumber('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                migrationsRun: true,
                logging: configService.nodeEnv === 'development',
                namingStrategy: new SnakeNamingStrategy(),
            }),
        );

        expect(configService.typeOrmConfig).not.toBeUndefined();
    });

    it('typeOrmConfig not hot', async () => {
        const migrations = [
            path.join(__dirname, '..') + '/../../migrations/*{.ts,.js}',
        ];
        const entities = [
            path.join(__dirname, '..') + '/../../modules/**/*.entity{.ts,.js}',
        ];

        jest.mock('../../shared.utils', () => ({
            isHotModule: jest.fn().mockReturnValue(false),
        }));

        // eslint-disable-next-line @typescript-eslint/naming-convention,@typescript-eslint/no-unused-vars,@typescript-eslint/tslint/config,no-shadow
        const { ConfigService } = await import('../config.service');

        // eslint-disable-next-line no-shadow
        const configService = new ConfigService();

        expect(configService.typeOrmConfig).toEqual(
            expect.objectContaining({
                entities,
                migrations,
                keepConnectionAlive: true,
                type: 'mysql',
                host: configService.get('DB_HOST'),
                port: configService.getNumber('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_DATABASE'),
                migrationsRun: true,
                logging: configService.nodeEnv === 'development',
                namingStrategy: new SnakeNamingStrategy(),
            }),
        );

        expect(configService.typeOrmConfig).not.toBeUndefined();
    });

    it('get', () => {
        expect(configService.get('DB_HOST')).toEqual(process.env.DB_HOST);
    });

    it('getNumber', () => {
        expect(configService.getNumber('DB_PORT')).toEqual(
            Number(configService.get('DB_PORT')),
        );
    });

    it('nodeEnv', () => {
        expect(configService.nodeEnv).toBeTruthy();
    });

    it('nodeEnv default', () => {
        jest.spyOn(configService, 'get').mockReturnValueOnce(null);
        expect(configService.nodeEnv).toEqual('development');
    });

    it('baseLink', () => {
        expect(configService.baseLink).toEqual(process.env.S3_BASELINK);
    });

    it('awsS3Config', () => {
        expect(configService.awsS3Config).toEqual({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
            bucketName: process.env.S3_BUCKET_NAME,
        });
    });

    it('All environment variables should be present', () => {
        expect(configService.get('DB_PORT')).toBeTruthy();
        expect(configService.get('JWT_SECRET_KEY')).toBeTruthy();
        expect(configService.get('JWT_EXPIRATION_TIME')).toBeTruthy();

        expect(configService.get('DB_HOST')).toBeTruthy();
        expect(configService.get('DB_PORT')).toBeTruthy();
        expect(configService.get('DB_USERNAME')).toBeTruthy();
        expect(configService.get('DB_PASSWORD')).toBeTruthy();
        expect(configService.get('DB_DATABASE')).toBeTruthy();

        // expect(configService.get('SMTP_HOST')).toBeTruthy();
        // expect(configService.get('SMTP_PORT')).toBeTruthy();
        // expect(configService.get('SMTP_USER')).toBeTruthy();
        // expect(configService.get('SMTP_PASSWORD')).toBeTruthy();
        //   expect(configService.get('SMTP_DEFAULT_FROM')).toBeTruthy();

        expect(configService.get('GOOGLE_CLIENT_ID')).toBeTruthy();
        expect(configService.get('GOOGLE_SECRET')).toBeTruthy();
        expect(configService.get('CALL_BACK_URL')).toBeTruthy();

        expect(configService.get('CLIENT_URL')).toBeTruthy();
    });
});
