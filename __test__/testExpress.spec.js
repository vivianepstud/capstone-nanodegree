const request = require("supertest");
const app = require("../src/server/app");


describe("Test the /getLocationInfo ", () => {
    test("It should response the POST method", async() => {
        const response = await request(app)
            .post("/getLocationInfo")
            .set('Content-Type', 'application/json');

        expect(response.statusCode).toBe(500);
        expect(response.body).toStrictEqual({ error: 'One of the fields are invalid' });
    });
    test("It should response the GET method", async() => {
        const response = await request(app)
            .post("/getLocationInfo")
            .set('Content-Type', 'application/json')
            .send({
                location: 'Dublin',
                startDate: '2021-08-21',
                endDate: '2021-08-30',
            })
        expect(response.statusCode).toBe(200);
    });
});