import request from "supertest";
import app from "../src/app.js";

describe("Protected job flow", () => {
    test("should create a job for an authenticated user", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Job User",
                email: "jobuser@example.com",
                password: "Password123!"
            });

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "jobuser@example.com",
                password: "Password123!"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post("/api/jobs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                company: "Test Company",
                role: "Software Engineer"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.company).toBe("Test Company");
        expect(response.body.data.role).toBe("Software Engineer");
        expect(response.body.data.user).toBeDefined();
    });
});

describe("Job ownership", () => {
    test("should not allow one user to access another user's job", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "User A",
                email: "usera@example.com",
                password: "Password123!"
            });

        const loginA = await request(app)
            .post("/api/auth/login")
            .send({
                email: "usera@example.com",
                password: "Password123!"
            });

        const tokenA = loginA.body.token;

        const createJobResponse = await request(app)
            .post("/api/jobs")
            .set("Authorization", `Bearer ${tokenA}`)
            .send({
                company: "Private Company",
                role: "Frontend Engineer"
            });

        const jobId = createJobResponse.body.data._id;

        await request(app)
            .post("/api/auth/register")
            .send({
                name: "User B",
                email: "userb@example.com",
                password: "Password123!"
            });

        const loginB = await request(app)
            .post("/api/auth/login")
            .send({
                email: "userb@example.com",
                password: "Password123!"
            });

        const tokenB = loginB.body.token;

        const response = await request(app)
            .get(`/api/jobs/${jobId}`)
            .set("Authorization", `Bearer ${tokenB}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Job not found");
    });
});

