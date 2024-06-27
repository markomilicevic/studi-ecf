import { jest } from "@jest/globals";

import InviteController from "./InviteController.js";

describe("InviteController", () => {
	describe("handle()", () => {
		let service;
		let request;

		beforeEach(() => {
			request = {
				role: "employee",
			};
			service = {
				execute: jest.fn(),
			};
		});

		it("should raise an error when role is missing", async () => {
			// Given
			const controller = new InviteController(null, service);
			request.role = null;

			// When and them
			await expect(async () => {
				await controller.handle(request);
			}).rejects.toThrow(Error);
			expect(service.execute.mock.calls).toHaveLength(0);
		});

		it("should raise an error when role is not an employee", async () => {
			// Given
			const controller = new InviteController(null, service);
			request.role = "admin";

			// When and them
			await expect(async () => {
				await controller.handle(request);
			}).rejects.toThrow(Error);
			expect(service.execute.mock.calls).toHaveLength(0);
		});

		it("should execute service", async () => {
			// Given
			const controller = new InviteController(null, service);

			// When
			await controller.handle(request);

			// Then
			expect(service.execute.mock.calls).toHaveLength(1);
			expect(service.execute.mock.calls[0][0]).toEqual({
				role: request.role,
			});
		});
	});
});
