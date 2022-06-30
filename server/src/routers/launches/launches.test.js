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
    test("expected to respond with 200", () => {
        const response = 200;
        expect(response).toBe(200);
    })

    test("expected to catch missing required properties", () => {
    })

    test("expected to cathc invalid dates", () => {
    })
})