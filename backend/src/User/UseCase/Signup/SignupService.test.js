import { jest } from "@jest/globals";

import SignupService from "./SignupService.js";

describe("SignupService", () => {
	describe("execute()", () => {
		let transactionRepository;
		let signupRepository;
		let jwtRepository;
		let signupEmailRepository;
		let query;

		beforeEach(() => {
			query = {
				email: "john.doe@example.com",
				password: "AAAaaa123$$$",
				firstName: "John",
				lastName: "Doe",
				userName: "john.doe",
			};
			transactionRepository = {
				transaction: (unit) => unit(),
			};
			signupRepository = {
				exists: jest.fn(),
				create: jest.fn(),
			};
			jwtRepository = {
				create: jest.fn(),
			};
			signupEmailRepository = {
				create: jest.fn(),
			};
		});

		it("should return lot of user errors where query empty", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			const query = {};

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_EMAIL", "INVALID_PASSWORD", "INVALID_FIRST_NAME", "INVALID_LAST_NAME", "INVALID_USER_NAME"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where email is invalid", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			query.email = "Hello World";

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_EMAIL"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where password is invalid", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			query.password = "azerty";

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_PASSWORD"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where first name is invalid", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			query.firstName = "";

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_FIRST_NAME"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where last name is invalid", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			query.lastName = "";

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_LAST_NAME"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where user name is invalid", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			query.userName = "";

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["INVALID_USER_NAME"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where email already used", async () => {
			// Given
			signupRepository.exists = jest.fn(({ email }) => (email ? true : false));
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["EMAIL_ALREADY_USED"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should return user error where user name already used", async () => {
			// Given
			signupRepository.exists = jest.fn(({ userName }) => (userName ? true : false));
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);

			// When
			const response = await service.execute(query);

			// Then
			expect(response).toEqual({
				status: "USER_ERRORS",
				errors: ["USER_NAME_ALREADY_USED"],
			});
			expect(signupRepository.create.mock.calls).toHaveLength(0);
			expect(jwtRepository.create.mock.calls).toHaveLength(0);
		});

		it("should raise an error when signup failed", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			signupRepository.create = jest.fn().mockRejectedValue(new Error("Something wrong"));

			// When and then
			await expect(async () => {
				await service.execute(query);
			}).rejects.toThrow(Error);
		});

		it("should raise an error when signup email failed", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			signupEmailRepository.create = jest.fn().mockRejectedValue(new Error("Something wrong"));

			// When and then
			await expect(async () => {
				await service.execute(query);
			}).rejects.toThrow(Error);
		});

		it("should signup and return success", async () => {
			// Given
			const service = new SignupService(transactionRepository, signupRepository, jwtRepository, signupEmailRepository);
			const jwtToken = "my-user-jwt-token";
			jwtRepository.create = jest.fn(() => jwtToken);

			// When
			const response = await service.execute(query);

			// Then
			expect(signupRepository.create.mock.calls).toHaveLength(1);
			expect(signupRepository.create.mock.calls[0][0]).toEqual({
				userId: expect.any(String),
				email: query.email,
				password: expect.any(String),
				firstName: query.firstName,
				lastName: query.lastName,
				userName: query.userName,
				role: "user",
			});
			expect(jwtRepository.create.mock.calls).toHaveLength(1);
			expect(jwtRepository.create.mock.calls[0][0]).toEqual({
				payload: {
					userId: expect.any(String),
				},
				expireIn: expect.any(Number),
			});
			expect(signupEmailRepository.create.mock.calls).toHaveLength(1);
			expect(signupEmailRepository.create.mock.calls[0][0]).toEqual({
				email: query.email,
				userName: query.userName,
			});
			expect(response).toEqual({
				data: {
					tokenValue: jwtToken,
					tokenExpiration: expect.any(String),
				},
			});
		});
	});
});
