//@ts-check
import { log, $mustExist, $$, $, warn, $atLeastOne } from "./_utils";
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

	const $sidebars = $$('.dashboard-sidebar');

	// resolve normal version and beta version (choose a container has children)
	const $sidebar = $sidebars.filter(it => it.children.length > 0)[0];
	if (!$sidebar) return warn("`.dashboard-sidebar` is missing!");

	let $currentUserName = $atLeastOne([
		'.account-switcher-truncate-override', // normal version
		'.select-menu-button-gravatar+span', // beta version
	],$sidebar);
	if (!$currentUserName) return;

	const $listen = $atLeastOne([
		'.js-repos-container .Box-body', // normal version
		'.js-repos-container[data-pjax-container]', //beta version
	], $sidebar);

	makeRepoNameShorter();

	let lastUpdate = 0;
	const listener = new MutationObserver(list => {
		log(`ChildList of sidebar repositories area has changed`);

		const now = Date.now();
		if (now < lastUpdate + 500) return;
		lastUpdate = now;

		makeRepoNameShorter();
	});
	if ($listen)
		listener.observe($listen, { childList: true, subtree: true });
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
		log($repos.length)
		for (const $repo of $repos) {
			const text = $repo.innerText.trim();
			if (text === userName) {
				const $sibling = $repo.nextSibling;
				update.push({
					$1: $repo,
					$2: $sibling,
					//@ts-ignore
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
