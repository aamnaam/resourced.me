const request = require('supertest');
const { app } = require('../../../app');
const dbHandler = require('../../dbHandler');
const fixtures = require('../../fixtures');

// supertest request agent
const agent = request.agent(app);

beforeAll(async () => await dbHandler.connect());
beforeEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.disconnect());

describe('POST /api/list/create', () => {
    // Commented out until we figure out how to mimick JSON web tokens
    
    // test('Stores a new resource list successfully', done => {
    //     agent
    //         .post('/api/list/create')
    //         .send(fixtures.validList)
    //         .expect(200)
    //         .then((res) => {
    //             expect(res.body._id).toBeTruthy();
    //             done();
    //         });
    // });

    test('Fails to create a resource list with missing JWT', done => {
        agent
            .post('/api/list/create')
            .send(fixtures.validList)
            .expect(401)
            .then((res) => {
                done();
            });
    });
    
});