import { changeDropdownNthValue, clickButton, startBrowser } from "../helpers.js";

describe("Web's HomePage", () => {
	it("should render page", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/`);

		expect(await page.waitForSelector('[data-testid="homepage"]')).toBeTruthy();

		await browser.close();
	});

	it("should render header", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/`);

		expect(await page.waitForSelector('[data-testid="header"]')).toBeTruthy();

		await browser.close();
	});

	it("should render home", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/`);

		expect(await page.waitForSelector('[data-testid="movie-list-card"]')).toBeTruthy();
		// At least one item
		expect(await page.waitForSelector('[data-testid="movie-list-card-item"]')).toBeTruthy();

		await browser.close();
	});

	it("should render footer", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/`);

		expect(await page.waitForSelector('[data-testid="footer"]')).toBeTruthy();

		await browser.close();
	});

	it("should render footer's current cinema", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/`);

		expect(await page.waitForSelector('[data-testid="country-list"]')).toBeTruthy();
		expect(await page.waitForSelector('[data-testid="cinema-list"]')).toBeTruthy();
	});

	describe("when changing current cinema", () => {
		let browser;
		let page;

		beforeEach(async () => {
			const obj = await startBrowser();
			browser = obj.browser;
			page = obj.page;

			await page.goto(`http://localhost:4001/`);

			expect(await page.waitForSelector('[data-testid="country-list"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="cinema-list"]')).toBeTruthy();
			if (await page.$('[data-testid="country-list-select-country"]')) {
				// No country selected from GeoIP (it's possible that we're running inside CI located outside FR and BE)
				// FRA
				await changeDropdownNthValue(page, '[data-testid="country-list-select-country"]', 2);
			}
		});

		it("should set current cinema", async () => {
			expect(await page.waitForSelector('[data-testid="country-list-selected-country"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="cinema-list-select-cinema"]')).toBeTruthy();

			await changeDropdownNthValue(page, '[data-testid="cinema-list-select-cinema"]', 1);
			expect(await page.waitForSelector('[data-testid="cinema-list-selected-cinema-details"]')).toBeTruthy();

			await browser.close();
		});

		it("should change current cinema", async () => {
			expect(await page.waitForSelector('[data-testid="country-list-selected-country"]')).toBeTruthy();

			await changeDropdownNthValue(page, '[data-testid="cinema-list-select-cinema"]', 1);
			expect(await page.waitForSelector('[data-testid="cinema-list-selected-cinema-details"]')).toBeTruthy();

			await clickButton(page, '[data-testid="cinema-list-change-cinema"]');

			await changeDropdownNthValue(page, '[data-testid="cinema-list-select-cinema"]', 1);
			expect(await page.waitForSelector('[data-testid="cinema-list-selected-cinema-details"]')).toBeTruthy();

			await browser.close();
		});

		it("should change current country", async () => {
			expect(await page.waitForSelector('[data-testid="country-list-selected-country"]')).toBeTruthy();

			await clickButton(page, '[data-testid="country-list-change-country"]');

			// BEL
			await changeDropdownNthValue(page, '[data-testid="country-list-select-country"]', 1);
			expect(await page.waitForSelector('[data-testid="cinema-list-select-cinema"]')).toBeTruthy();

			await browser.close();
		});
	});
});
