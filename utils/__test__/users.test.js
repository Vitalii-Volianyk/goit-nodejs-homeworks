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
});
