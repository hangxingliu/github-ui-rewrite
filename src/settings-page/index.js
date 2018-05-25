//@ts-check
import { getDefaultSettings, loadSettings, encodeSettings, settingsStorageKey } from "./settings";

window.addEventListener('load', main);
function main() {
	const defaultSettings = getDefaultSettings();
	let settings = {};

	$('#btnRefresh').addEventListener('click', refreshSettings.bind(this, {}));
	$('#btnReset').addEventListener('click', () => {
		chrome.storage.sync.clear(() => {
			refreshSettings({ showMessage: false });
			showStatus(`warning`, `settings be reset`);
		});
	});

	refreshSettings({ isInitialized: true });
	function refreshSettings({ isInitialized = false, showMessage = true }) {
		loadSettings(_settings => {
			settings = _settings;
			console.log('loaded settings:', settings);

			let loaded = 0;
			$$('.settings-checkbox').forEach(el => {
				const key = el.getAttribute('data-key');
				if (!(key in defaultSettings)) {
					el.setAttribute('disabled', 'disabled');
					return;
				}
				const value = settings[key];
				if (value)
					el.setAttribute('checked', 'checked');
				else
					el.removeAttribute('checked');

				if (isInitialized)
					el.addEventListener('change', saveSettings);
				loaded++;
			});
			if (showMessage)
				showStatus(`info`, `Loaded  ${loaded} settings from storage!`);
		});
	}

	/** @param {Event} event */
	function saveSettings(event) {
		/** @type {HTMLInputElement} */
		//@ts-ignore
		const el = event.target;
		const key = el.getAttribute('data-key');
		const value = el.checked;
		if (!(key in defaultSettings)) {
			showStatus(`danger`, `Unknown setting: ${key}`);
			return;
		}
		console.log(`settings: ${key} => ${value}`);
		settings[key] = value;
		console.log(settings)
		chrome.storage.sync.set({
			[settingsStorageKey]: encodeSettings(settings)
		}, () => {
			showStatus(`success`, `set ${key} to ${value}`);
			refreshSettings({ showMessage: false });
		});
	}


	/** @returns {HTMLElement} */
	function $(selector, parent = document) {
		return parent.querySelector(selector);
	}
	/** @returns {HTMLElement[]} */
	function $$(selector, parent = document) {
		return Array.prototype.slice.call(parent.querySelectorAll(selector));
	}

	/**
	 * @param {'primary'|'success'|'secondary'|'danger'|'warning'|'info'|'dark'} type
	 * @param {string} msg
	 */
	function showStatus(type = 'success', msg = '') {
		const bar = $('#statusBar');
		bar.className = bar.className.replace(/alert-\w+\s*/, '') + ` alert-${type}`;
		bar.innerText = msg;
		bar.style.display = 'block';
	}
}

