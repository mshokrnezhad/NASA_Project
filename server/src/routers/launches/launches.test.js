const request = require("supertest");
const app = require("../../app");

describe("testing GET /Launches", () => {
    test("expected to respond with 200", async () => {
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);
    })
})

describe("Testing POST /launches", () => {
    const sample = {
        "mission": "MadMas001",
        "rocket": "MadMas Experimental IS1",
        "launchDate": "January 17, 2030",
        "destination": "Kepler-186 f"
    }

    test("expected to respond with 201", async () => {
        const response = await request(app)
            .post("/launches")
            .send(sample)
            .expect("Content-Type", /json/)
            .expect(201);

        sample.launchDate = new Date(sample.launchDate).valueOf();
        const parsedResponse = response.body;
        parsedResponse.launchDate = new Date(parsedResponse.launchDate).valueOf();
        expect(parsedResponse).toMatchObject(sample); 
    })

    const partialSample = {
        "mission": "MadMas001",
        "rocket": "MadMas Experimental IS1",
        "destination": "Kepler-186 f"
    }

    test("expected to catch missing required properties", async () => {
        const response = await request(app)
            .post("/launches")
            .send(partialSample)
            .expect("Content-Type", /json/)
            .expect(400);
        
        expect(response.body).toStrictEqual({
            error: "Missing required launch property!"
        })
    })

    const invalidSample = {
        "mission": "MadMas001",
        "rocket": "MadMas Experimental IS1",
        "launchDate": "xxxxxxx",
        "destination": "Kepler-186 f"
    }


    test("expected to cathc invalid dates", async () => {
        const response = await request(app)
            .post("/launches")
            .send(invalidSample)
            .expect("Content-Type", /json/)
            .expect(400);
        
        expect(response.body).toStrictEqual({
            error: "Invalid launch date!"
        })
    })
})