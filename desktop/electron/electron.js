import { app, BrowserWindow } from "electron";

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	const startURL = !app.isPackaged ? "http://localhost:4003/desktop/" : "https://studi-ecf.markomilicevic.fr/desktop/";

	mainWindow.loadURL(startURL);

	mainWindow.on("closed", () => (mainWindow = null));
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});
