//@ts-check

/// <reference path="../types.d.ts" />
/** @returns {ExtensionSettings} */
export function getDefaultSettings() {
	return {
		betterRepositoriesCard: true,
		addPdfPrintButton: true,
		disableNewJumpSearch: false,
	};
}

export const settingsStorageKey = 'settings';

/**
 * @param {(settings: ExtensionSettings) => any} onLoad
 */
export function loadSettings(onLoad) {
	chrome.storage.sync.get([settingsStorageKey], storage => {
		const defaultSettings = getDefaultSettings();
		const settings = decodeSettings(storage[settingsStorageKey]);
		onLoad(Object.assign({}, defaultSettings, settings));
	});
}

export function encodeSettings(settings) {
	return JSON.stringify(settings);
}

/** @returns {ExtensionSettings} */
export function decodeSettings(json) {
	try {
		return JSON.parse(json);
	} catch (ex) {
		//@ts-ignore
		return {};
	}
}
