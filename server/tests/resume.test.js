import request from "supertest";
import app from "../src/app.js";

describe("Resume flow", () => {
    test("should create a resume for an authenticated user", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Resume User",
                email: "resumeuser@example.com",
                password: "Password123!"
            });

        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: "resumeuser@example.com",
                password: "Password123!"
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .post("/api/resumes")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Frontend Resume",
                resumeText: "React JavaScript Node.js MongoDB"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.name).toBe("Frontend Resume");
        expect(response.body.data.user).toBeDefined();
    });
});

test("should not allow one user to access another user's resume", async () => {
    // User A
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "User A",
            email: "resumea@example.com",
            password: "Password123!"
        });

    const loginA = await request(app)
        .post("/api/auth/login")
        .send({
            email: "resumea@example.com",
            password: "Password123!"
        });

    const createResume = await request(app)
        .post("/api/resumes")
        .set("Authorization", `Bearer ${loginA.body.token}`)
        .send({
            name: "User A Resume",
            resumeText: "React JavaScript Node.js"
        });

    const resumeId = createResume.body.data._id;

    // User B
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "User B",
            email: "resumeb@example.com",
            password: "Password123!"
        });

    const loginB = await request(app)
        .post("/api/auth/login")
        .send({
            email: "resumeb@example.com",
            password: "Password123!"
        });

    // User B tries to access User A's resume
    const response = await request(app)
        .get(`/api/resumes/${resumeId}`)
        .set("Authorization", `Bearer ${loginB.body.token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Resume not found");
});


test("should return 400 for an invalid resume ID", async () => {
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Invalid ID User",
            email: "invalidid@example.com",
            password: "Password123!"
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: "invalidid@example.com",
            password: "Password123!"
        });

    const response = await request(app)
        .get("/api/resumes/not-a-valid-id")
        .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid resume ID");
});


test("should clear resume reference and analysis from jobs when resume is deleted", async () => {
    await request(app)
        .post("/api/auth/register")
        .send({
            name: "Cleanup User",
            email: "cleanup@example.com",
            password: "Password123!"
        });

    const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
            email: "cleanup@example.com",
            password: "Password123!"
        });

    const token = loginResponse.body.token;

    const resumeResponse = await request(app)
        .post("/api/resumes")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Cleanup Resume",
            resumeText: "React Node.js MongoDB"
        });

    const resumeId = resumeResponse.body.data._id;

    const jobResponse = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${token}`)
        .send({
            company: "Cleanup Company",
            role: "Software Engineer"
        });

    const jobId = jobResponse.body.data._id;

    await request(app)
        .put(`/api/jobs/${jobId}/resume`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            resumeId
        });

    const deleteResponse = await request(app)
        .delete(`/api/resumes/${resumeId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(deleteResponse.statusCode).toBe(200);

    const getJobResponse = await request(app)
        .get(`/api/jobs/${jobId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(getJobResponse.body.data.resumeUsed).toBeUndefined();
    expect(getJobResponse.body.data.analysis).toBeUndefined();
});