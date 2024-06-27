import puppeteer from "puppeteer";

/**
 * Start a browser
 *
 * @returns object Puppeteer's browser and page
 */
export const startBrowser = async () => {
	// Launch the browser and open a new blank page
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// Set screen size
	await page.setViewport({ width: 1080, height: 1024 });

	return { browser, page };
};

/**
 * This is a replacement for the `page.click()` of Puppeteer
 * Puppeteer's click is making a succession of events that are not always catched by the app
 * DOC: https://pptr.dev/api/puppeteer.page.click
 * Here ia a "raw" click on a selector
 */
export const clickButton = async (page, selector) => {
	expect(await page.waitForSelector(selector)).toBeTruthy();

	await page.evaluate(async (selector) => {
		await document.querySelector(selector).click();
	}, selector);
};

/**
 * Material UI's dropdowns are complex in term of testing
 * Here is an helper that just select the Nth value
 */
export const changeDropdownNthValue = async (page, selector, nthValue) => {
	expect(await page.waitForSelector(`${selector} [role="combobox"]`)).toBeTruthy();

	// Click on the dropdown
	await page.evaluate(async (selector) => {
		// SOURCE: https://stackoverflow.com/questions/60949856/e2e-testing-material-ui-select-with-puppeteer
		var clickEvent = document.createEvent("MouseEvents");
		clickEvent.initEvent("mousedown", true, true);
		var selectNode = document.querySelector(`${selector} [role="combobox"]`);
		selectNode.dispatchEvent(clickEvent);
	}, selector);

	// This is global on the page and contains all options of the current open dropdown
	expect(await page.waitForSelector('[role="option"]')).toBeTruthy();

	// Finally click on the new value
	await page.evaluate(async (nthValue) => {
		await document.querySelectorAll(`[role="option"]`)[nthValue - 1].click();
	}, nthValue);
};
