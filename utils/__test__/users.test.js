const request = require("supertest");

describe("POST /api/users/login", () => {
	test("should return 200 status for valid credentials", async () => {
		const res = await request("http://127.0.0.1:3000")
			.post("/api/users/login")
			.send({
				email: "tes@test.com",
				password: "f@tfhhfg4fhg8hfg",
			});
		expect(res.status).toBe(200);
	});
	test("should return token to be String", async () => {
		const res = await request("http://127.0.0.1:3000")
			.post("/api/users/login")
			.send({
				email: "tes@test.com",
				password: "f@tfhhfg4fhg8hfg",
			});
		expect(res.body.token).toMatch(
			/^[a-zA-Z0-9-_=]+\.[a-zA-Z0-9-_=]+\.?[a-zA-Z0-9-_.+/=]*$/
		);
	});
	test("should return user with subscription and email", async () => {
		const res = await request("http://127.0.0.1:3000")
			.post("/api/users/login")
			.send({
				email: "tes@test.com",
				password: "f@tfhhfg4fhg8hfg",
			});
		expect(res.body.user).toMatchObject({
			subscription: expect.any(String),
			email: expect.any(String),
		});
	});
});
