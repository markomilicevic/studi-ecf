import { clickButton, startBrowser } from "../helpers.js";

describe("Website's Contact page", () => {
	it("should render page", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/contact`);

		expect(await page.waitForSelector('[data-testid="contact"]')).toBeTruthy();

		await browser.close();
	});

	it("should render header", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/contact`);

		expect(await page.waitForSelector('[data-testid="header"]')).toBeTruthy();

		await browser.close();
	});

	it("should send message", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/contact`);

		expect(await page.waitForSelector('[data-testid="contact-form"]')).toBeTruthy();

		const subject = await page.$(`[data-testid="contact-form-subject-field"]`);
		await subject.click({ clickCount: 3 }); // Erase previous value (if present)
		await subject.type("[Testing] Subject");

		const body = await page.$(`[data-testid="contact-form-body-field"]`);
		await body.click({ clickCount: 3 }); // Erase previous value (if present)
		await body.type("[Testing] Body");

		await clickButton(page, '[data-testid="contact-form-submit"]');

		expect(await page.waitForSelector('[data-testid="contact"]')).toBeTruthy();
		expect(await page.waitForSelector('[data-testid="contact-message-sent"]')).toBeTruthy();

		await browser.close();
	});

	it("should render footer", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/contact`);

		expect(await page.waitForSelector('[data-testid="footer"]')).toBeTruthy();

		await browser.close();
	});
});
