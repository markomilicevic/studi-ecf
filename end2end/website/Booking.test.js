import { changeDropdownNthValue, startBrowser } from "../helpers.js";

describe("Website's Booking page", () => {
	it("should render page", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/booking`);

		expect(await page.waitForSelector('[data-testid="booking"]')).toBeTruthy();

		await browser.close();
	});

	it("should render header", async () => {
		const { browser, page } = await startBrowser();

		await page.goto(`http://localhost:4001/booking`);

		expect(await page.waitForSelector('[data-testid="header"]')).toBeTruthy();

		await browser.close();
	});

	describe("finalize a booking", () => {
		let browser;
		let page;

		beforeAll(async () => {
			const obj = await startBrowser();
			browser = obj.browser;
			page = obj.page;

			await page.goto(`http://localhost:4001/booking`);

			expect(await page.waitForSelector('[data-testid="country-list"]')).toBeTruthy();
			expect(await page.waitForSelector('[data-testid="cinema-list"]')).toBeTruthy();
			if (await page.$('[data-testid="country-list-select-country"]')) {
				// No country selected from GeoIP (it's possible that we're running inside CI located outside FR and BE)
				// FRA
				await changeDropdownNthValue(page, '[data-testid="country-list-select-country"]', 2);
			}

			// Select the Paris cinema
			await changeDropdownNthValue(page, '[data-testid="cinema-list-select-cinema"]', 4);
			expect(await page.waitForSelector('[data-testid="cinema-list-selected-cinema-details"]')).toBeTruthy();
		});

		afterAll(async () => {
			await browser.close();
		});

		it("should select the movie", async () => {
			expect(await page.waitForSelector('[data-testid="movie-list-dropdown-select-movie"]')).toBeTruthy();

			// Select the first movie
			await changeDropdownNthValue(page, '[data-testid="movie-list-dropdown-select-movie"]', 1);
		});

		it("should select the number of places", async () => {
			expect(await page.waitForSelector('[data-testid="places-number"]')).toBeTruthy();

			expect(await page.waitForSelector('[data-testid="places-number-total-number"]')).toBeTruthy();
			const totalNumberInput = await page.$('[data-testid="places-number-total-number"]');
			await totalNumberInput.click({ clickCount: 3 }); // Erase previous value
			await totalNumberInput.type("1");

			expect(await page.waitForSelector('[data-testid="places-number-disabled-number"]')).toBeTruthy();
			const disabledNumberInput = await page.$('[data-testid="places-number-disabled-number"]');
			await disabledNumberInput.click({ clickCount: 3 }); // Erase previous value
			await disabledNumberInput.type("1");

			expect(await page.waitForSelector('[data-testid="places-number-submit"]')).toBeTruthy();
			await page.click('[data-testid="places-number-submit"]');
		});

		it("should select the session", async () => {
			expect(await page.waitForSelector('[data-testid="weekly-session-list"]')).toBeTruthy();

			// At least one session
			expect(await page.waitForSelector('[data-testid="daily-session-list-select-session"]')).toBeTruthy();

			await page.click('[data-testid="daily-session-list-select-session"]:nth-child(1)');
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

		await page.goto(`http://localhost:4001/booking`);

		expect(await page.waitForSelector('[data-testid="footer"]')).toBeTruthy();

		await browser.close();
	});
});
