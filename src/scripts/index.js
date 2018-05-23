//@ts-check
import { log, $mustExist, $$ } from "./_utils";

document.addEventListener('DOMContentLoaded', setupForDashboard);

let inited = false;
function setupForDashboard() {
	if (inited) return;
	inited = true;
	log('setupForDashboard');

	const $sidebar = $mustExist('.dashboard-sidebar');
	if (!$sidebar) return;

	const $currentUserName = $mustExist('.account-switcher-truncate-override', $sidebar);
	if (!$currentUserName) return;

	const $listen = $mustExist('.js-repos-container .Box-body', $sidebar);
	if (!$listen) log(`.js-repos-container .Box-body is missing!`);

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
		const startsWith = `${userName}/`;

		/** @type {{e: HTMLElement, text: string}[]} */
		const update = [];
		const $repos = $$('li.source .text-bold, li.fork .text-bold', $sidebar);
		for (const $repo of $repos) {
			const text = $repo.innerText;
			if (text.startsWith(startsWith))
				update.push({ e: $repo, text: text.replace(startsWith, '') });
		}

		for (const { e, text } of update)
			e.innerText = text;
	}
}
