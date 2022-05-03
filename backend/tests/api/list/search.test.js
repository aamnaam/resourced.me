const request = require('supertest');
const { app } = require('../../../app');
const dbHandler = require('../../dbHandler');
const fixtures = require('../../fixtures');
const ResourceList = require('../../../models/listModel');
const mongoose = require("mongoose");
// supertest request agent
const agent = request.agent(app);

beforeAll(async () => await dbHandler.connect());
beforeEach(async () => await dbHandler.clear());
afterAll(async () => await dbHandler.disconnect());

describe('GET /api/list/search', () => {
    test('retrieves module, university, course, description and NO sections of all matching lists', async () => {
        // Prepare resource lists

        for (let i = 0; i < 5; i++) {
            const list = fixtures.validList;
            list.author = new mongoose.Types.ObjectId();
            list.university = "Test University"; // What we're matching by
            list.module = "Test Module";
            list.course = "Test Course";
            list.description = "list" + i;
            const model = new ResourceList(list);
            await model.save();
            // console.log("Saved " + list.module);
        }

        // We make a list with each type of field non-matching
        for (let i = 0; i < 3; i++) {
            const list = fixtures.validList;
            list.university = "Test University"; // What we're matching by
            list.module = "Test Module";
            list.course = "Test Course";
            switch (i) {
                case 0:
                    list.university = "Unmatch";
                    break;
                case 1:
                    list.module = "Unmatch";
                    break;
                case 2:
                    list.course = "Unmatch";
                    break;
            }
            const model = new ResourceList(list);
            await model.save();
            // console.log("Saved " + list.module);
        }

        await agent
            .get('/api/list/search')
            .query({module: "Test Module", course: "Test Course", university: "Test University"})
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(5);
                let descriptions = [];
                for (let i = 0; i < 5; i++) {
                    expect(res.body[i].university).toBe("Test University");
                    expect(res.body[i].module).toBe("Test Module");
                    expect(res.body[i].course).toBe("Test Course");
                    expect(res.body[i]).not.toHaveProperty('sections');
                    descriptions[i] = res.body[i].description;
                }
                for (let i = 0; i < 5; i++) {
                    expect(descriptions).toContain("list" + i);
                }
            });
    });

    test('responds with code 200 and empty list if no results are found', done => {
        agent
            .get('/api/list/search')
            .query({module: "foo", course: "foo", university: "foo"})
            .expect(200)
            .then((res) => {
                expect(res.body).toHaveLength(0);
                // console.log(res.body);
                done();
            });
    });
});
