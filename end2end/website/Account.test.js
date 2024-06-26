import { clickButton, startBrowser } from "../helpers.js";

describe("Website's Account page", () => {
	it("should render page", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/account`);

		expect(await page.waitForSelector('[data-testid="account"]')).toBeTruthy();

		await browser.close();
	});

	it("should render header", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/account`);

		expect(await page.waitForSelector('[data-testid="header"]')).toBeTruthy();

		await browser.close();
	});

	describe("signup then signout and finally signin", () => {
		let browser;
		let page;
		const fields = {
			email: `email.${Math.random()}@example.com`,
			password: "AAAaaa111$$$",
			"confirm-password": "AAAaaa111$$$",
			"last-name": "Doe",
			"first-name": "John",
			"user-name": `john.doe.${Math.random()}`,
		};

		beforeAll(async () => {
			const obj = await startBrowser();
			browser = obj.browser;
			page = obj.page;
		});

		afterAll(async () => {
			await browser.close();
		});

		it("should signup", async () => {
			await page.goto(`http://localhost:4001/account`);

			expect(await page.waitForSelector('[data-testid="account"]')).toBeTruthy();

			expect(await page.waitForSelector('[data-testid="signup-form"]')).toBeTruthy();

			// Fill the signup form
			for (let field in fields) {
				expect(await page.waitForSelector(`[data-testid="signup-form-${field}-field"]`)).toBeTruthy();
				const input = await page.$(`[data-testid="signup-form-${field}-field"]`);
				await input.click({ clickCount: 3 }); // Erase previous value (if present)
				await input.type(fields[field]);
			}

			await clickButton(page, '[data-testid="signup-form-submit"]');

			expect(await page.waitForSelector('[data-testid="homepage"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="header-link-signout"]')).toBeTruthy();
		});

		it("should signout", async () => {
			expect(await page.waitForSelector('[data-testid="header-link-signout"]')).toBeTruthy();

			await clickButton(page, '[data-testid="header-link-signout"]');

			expect(await page.waitForSelector('[data-testid="header-link-signin"]')).toBeTruthy();
		});

		it("should signin", async () => {
			await page.click('[data-testid="header-link-signin"]');

			expect(await page.waitForSelector('[data-testid="account"]')).toBeTruthy();

			expect(await page.waitForSelector('[data-testid="signin-form"]')).toBeTruthy();

			// Fill the signin form

			expect(await page.waitForSelector('[data-testid="signin-form-email-field"]')).toBeTruthy();
			const emailInput = await page.$('[data-testid="signin-form-email-field"]');
			await emailInput.click({ clickCount: 3 }); // Erase previous value (if present)
			await emailInput.type(fields.email);

			expect(await page.waitForSelector('[data-testid="signin-form-password-field"]')).toBeTruthy();
			const passwordInput = await page.$('[data-testid="signin-form-password-field"]');
			await passwordInput.click({ clickCount: 3 }); // Erase previous value (if present)
			await passwordInput.type(fields.password);

			await clickButton(page, '[data-testid="signin-form-submit"]');

			expect(await page.waitForSelector('[data-testid="homepage"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="header-link-signout"]')).toBeTruthy();
		});
	});

	it("should render footer", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/account`);

		expect(await page.waitForSelector('[data-testid="footer"]')).toBeTruthy();

		await browser.close();
	});
});
