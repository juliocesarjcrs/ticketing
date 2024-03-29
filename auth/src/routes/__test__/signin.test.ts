import request from "supertest";
import { app } from "../../app";

it("fails when a email that does not exists is supplied", async () => {
    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(400);
});

it("fails when an incorrec password is supplied", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);

    return request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "passwordincorrect",
        })
        .expect(400);
});

it("sets a cookie after sucessful signup", async () => {
    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);
    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(200);
    expect(response.get("Set-Cookie")).toBeDefined();
});
