const request = require('supertest');
const { app } = require('../../../app');
const dbHandler = require('../../dbHandler');
const fixtures = require('../../fixtures');
const ResourceList = require('../../../models/listModel');

// supertest request agent
const agent = request.agent(app);

beforeAll(async () => await dbHandler.connect());
beforeEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.disconnect());

describe('GET /api/list/find/:id', () => {
    test('Successfully retrieves an existing resource list', done => {
        // Prepare resource list
        const testList = new ResourceList(fixtures.validList);
        testList.save()
            .then((resourceList) => {
                agent
                    .get('/api/list/find/' + resourceList._id)
                    .expect(200)
                    .then((res) => {
                        expect(res.body._id).toBeTruthy();
                        expect(res.body.module).toBe(testList.module);
                        expect(res.body.course).toBe(testList.course);
                        expect(res.body.university).toBe(testList.university);
                        expect(res.body.sections[1].title).toBe(testList.sections[1].title);
                        expect(res.body.sections[0].resources[1].url).toBe(testList.sections[0].resources[1].url);
                        done();
                    });
            });        
    });

    test('Fails to retrieve a non-existent resource list', done => {
        agent
            .get('/api/list/find/62201d5a610ef2f3c33b804c')
            .expect(400)
            .then((res) => {
                expect(res.body).toMatch(/Error:/);
                done();
            });
    });

});
