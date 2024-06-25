import { changeDropdownNthValue, startBrowser } from "../helpers.js";

describe("Web's Movies page", () => {
	it("should render page", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/movies`);

		expect(await page.waitForSelector('[data-testid="movies"]')).toBeTruthy();

		await browser.close();
	});

	it("should render header", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/movies`);

		expect(await page.waitForSelector('[data-testid="header"]')).toBeTruthy();

		await browser.close();
	});

	it("should render movies", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/movies`);

		expect(await page.waitForSelector('[data-testid="movie-list-card"]')).toBeTruthy();
		// At least one item
		expect(await page.waitForSelector('[data-testid="movie-list-card-item"]')).toBeTruthy();

		await browser.close();
	});

	describe("start booking", () => {
		let browser;
		let page;

		beforeAll(async () => {
			const obj = await startBrowser();
			browser = obj.browser;
			page = obj.page;

			await page.goto(`http://localhost:4001/movies`);

			expect(await page.waitForSelector('[data-testid="country-list"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="cinema-list"]')).toBeTruthy();
			if (await page.$('[data-testid="country-list-select-country"]')) {
				// No country selected from GeoIP (it's possible that we're running inside CI located outside FR and BE)
				// FRA
				await changeDropdownNthValue(page, '[data-testid="country-list-select-country"]', 2);
			}
			expect(await page.waitForSelector('[data-testid="country-list-selected-country"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="cinema-list-select-cinema"]')).toBeTruthy();
		});

		afterAll(async () => {
			await browser.close();
		});

		it("should select the movie", async () => {
			// Click on the first movie
			expect(await page.waitForSelector('[data-testid="movie-list-card"]')).toBeTruthy();
			await page.click('[data-testid="movie-list-card"]:nth-child(1) a');

			expect(await page.waitForSelector('[data-testid="movie-modal"]')).toBeTruthy();
		});

		it("should select the session", async () => {
			expect(await page.waitForSelector('[data-testid="weekly-session-list"]')).toBeTruthy();

			// Click on the first session
			expect(await page.waitForSelector('[data-testid="daily-session-list-select-session"]')).toBeTruthy();
			await page.click('[data-testid="daily-session-list-select-session"]:nth-child(1)');

			expect(await page.waitForSelector('[data-testid="booking"]')).toBeTruthy();
		});

		it("should select the placement", async () => {
			expect(await page.waitForSelector('[data-testid="placements"]')).toBeTruthy();

			// At least one placement
			expect(await page.waitForSelector('[data-testid="placement-select-placement"]')).toBeTruthy();
			await page.click('[data-testid="placement-select-placement"]:nth-child(1)');
		});

		it("should render finalize", async () => {
			expect(await page.waitForSelector('[data-testid="booking-finalize"]')).toBeTruthy();
		});
	});

	it("should render footer", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/account`);

		expect(await page.waitForSelector('[data-testid="footer"]')).toBeTruthy();

		await browser.close();
	});
});
