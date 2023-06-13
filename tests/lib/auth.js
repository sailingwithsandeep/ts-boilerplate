import request from 'supertest';
import { describe, it, before } from 'mocha';
import { expect } from 'chai';
import app from '../../dist/index.js';
import { randomUsers } from '../../dist/app/utils/index.js';
const store = {};
describe('Admin Authentication routes', () => {
    before(() => {
        store.token = undefined;
        store.email = `${randomUsers.getRandomUserName()}@test.com`;
        store.mobile = _.randomBetween(7, 9).toString() + Math.random().toFixed(9).replace('0.', '');
        store.username = randomUsers.getRandomUserName();
    });

    describe('/POST create user', () => {
        it('should not be create user because mobile number already exists', async () => {
            try {
                const data = {
                    sUsername: 't1est111',
                    sEmail: 'qa3111@gmail.com',
                    sPassword: 'Test@user1',
                    sMobile: '9192542121211',
                };
                const res = await request(app).post('/api/v1/admin/auth/create').send(data);

                expect(409).equals(messages.already_exists('mobile').code);
                expect(res.body.message).equals(messages.already_exists('mobile').message);
            } catch (error) {
                throw new Error(error);
            }
        });

        it('should not be create user because email already exists', async () => {
            try {
                const data = {
                    sUsername: 'test11111',
                    sEmail: 'qa3@gmail.com',
                    sPassword: 'Test@user1',
                    sMobile: '91258541521',
                };
                const res = await request(app).post('/api/v1/admin/auth/create').send(data);

                expect(409).equals(messages.already_exists('email').code);
                expect(res.body.message).equals(messages.already_exists('email').message);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should not be create user because username already exists', async () => {
            try {
                const data = {
                    sUsername: 'test',
                    sEmail: 'qa3111@gmail.com',
                    sPassword: 'Test@user1',
                    sMobile: '91258545511',
                };
                const res = await request(app).post('/api/v1/admin/auth/create').send(data);

                expect(409).equals(messages.already_exists('username').code);
                expect(res.body.message).equals(messages.already_exists('Username').message);
            } catch (err) {
                throw new Error(err);
            }
        });

        it.skip('should be create user', async () => {
            try {
                const data = {
                    sEmail: store.email,
                    sMobile: store.mobile,
                    sPassword: 'Test@12134',
                    sUsername: store.username,
                    eAdminType: 'SUPER',
                };
                const res = await request(app).post('/api/v1/admin/auth/create').send(data).expect(200);

                expect(res.body.message).equals(messages.success(`Admin Creation`).message);
            } catch (err) {
                throw new Error(err);
            }
        });
    });
});
