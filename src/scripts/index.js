//@ts-check
window.addEventListener('load', setupForDashboard);

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


// =================================================
//                 _   _               _
//  _ __ ___   ___| |_| |__   ___   __| |___
// | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// | | | | | |  __/ |_| | | | (_) | (_| \__ \
// |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/

/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement}
 */
function $mustExist(selector, parent = document) {
	const $dom = $(selector, parent);
	if (!$dom)
		log(`${selector} is missing!`);
	return $dom;
}


/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement}
 */
function $(selector, parent = document) {
	return parent.querySelector(selector);
}

/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement[]}
 */
function $$(selector, parent = document) {
	return Array.prototype.slice.call(parent.querySelectorAll(selector));
}

function log(ctx) {
	console.log(`Github UI Rewrite: ${ctx}`);
}
