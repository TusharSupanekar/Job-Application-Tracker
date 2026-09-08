import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Authentication middleware", () => {
    test("should reject protected job route without token", async () => {
        const response = await request(app)
            .get("/api/jobs");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });
});

describe("Login validation", () => {
    test("should reject login when email and password are missing", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Email and password are required");
    });
});

describe("Registration validation", () => {
    test("should reject registration when required fields are missing", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Please provide name, email and password"
        );
    });
});

describe("Invalid token", () => {
    test("should reject protected route with invalid token", async () => {
        const response = await request(app)
            .get("/api/jobs")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Not Authorized, token failed"
        );
    });
});

describe("Registration database flow", () => {
    test("should register a new user and store it in the database", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "testuser@example.com",
                password: "Password123!"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

        const user = await User.findOne({
            email: "testuser@example.com"
        });

        expect(user).not.toBeNull();
        expect(user.name).toBe("Test User");
    });
});

describe("Login database flow", () => {
    test("should login a registered user and return a JWT", async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                name: "Login User",
                email: "loginuser@example.com",
                password: "Password123!"
            });

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "loginuser@example.com",
                password: "Password123!"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.token).toBeDefined();
    });
});

