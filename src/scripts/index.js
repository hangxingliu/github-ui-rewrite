//@ts-check
import { log, $mustExist, $$, $, warn } from "./_utils";
import { loadSettings } from "../settings-page/settings";

document.addEventListener('DOMContentLoaded', () => {
	loadSettings(settings => {
		if (settings.betterRepositoriesCard) {
			setupForDashboard();
		}
	});
});

let inited = false;
function setupForDashboard() {
	if (inited) return;
	inited = true;
	log('setupForDashboard');

	$('body').className += ' github-ui-better-repositories-card';

	const $sidebar = $mustExist('.dashboard-sidebar');
	if (!$sidebar) return;

	const $currentUserName = $mustExist('.account-switcher-truncate-override', $sidebar);
	if (!$currentUserName) return;

	const $listen = $mustExist('.js-repos-container .Box-body', $sidebar);
	if (!$listen) warn(`.js-repos-container .Box-body is missing!`);

	makeRepoNameShorter();

	let lastUpdate = 0;
	const listener = new MutationObserver(list => {
		log(`ChildList of sidebar repositories area has changed`);

		const now = Date.now();
		if (now < lastUpdate + 500) return;
		lastUpdate = now;

		makeRepoNameShorter();
	});
	listener.observe($listen, { childList: true });
	// listener.disconnect();

	function makeRepoNameShorter() {
		const userName = $currentUserName.innerText;
		// const startsWith = `${userName}/`;

		/** @type {{ $parent: HTMLElement; $1: HTMLElement; $2: Node; $3: HTMLElement; }[]} */
		const update = [];
		const selectors = [
			// elements under: <a class="d-flex flex-items-baseline ...
			//      div span "/" span
			'li.source .text-bold a span:nth-child(2)',
			'li.fork   .text-bold a span:nth-child(2)',
		].join(', ');
		const $repos = $$(selectors, $sidebar);
		for (const $repo of $repos) {
			const text = $repo.innerText.trim();
			if (text === userName) {
				const $sibling = $repo.nextSibling;
				//@ts-ignore
				update.push({
					$1: $repo,
					$2: $sibling,
					$3: $sibling.nextSibling,
					$parent: $repo.parentElement
				});
			}
		}

		for (const { $1, $2, $3, $parent } of update) {
			$3.style.maxWidth = 'none';
			$parent.removeChild($2);
			$parent.removeChild($1);
		}

	}
}
