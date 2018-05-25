//@ts-check
import { log, $mustExist, $ } from "./_utils";
import { loadSettings } from "../settings-page/settings";

document.addEventListener('DOMContentLoaded', () => {
	loadSettings(settings => {
		if (settings.disableNewJumpSearch) {
			$('body').className += ' github-ui-rewrite-fix-search';
		}
	});
});
