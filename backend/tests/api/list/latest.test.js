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

describe('GET /api/list/latest', () => {
    test('Successfully retrieves 10 latest resource lists', async () => {
        // Prepare resource lists
        for (let i = 0; i < 15; i++) {
            const list = fixtures.validList;
            list.module = "list" + i;
            const model = new ResourceList(list);
            await model.save();
            // console.log("Saved " + list.module);
        }

        await agent
            .get('/api/list/latest')
            .expect(200)
            .then((res) => {
                // console.log(res.body);
                expect(res.body).toHaveLength(10);
                for (let i = 0; i < 10; i++) {
                    expect(res.body[i].module).toBe("list" + (14 - i));
                }
            });
    });
});
