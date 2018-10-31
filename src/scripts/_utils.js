//@ts-check

// =================================================
//                 _   _               _
//  _ __ ___   ___| |_| |__   ___   __| |___
// | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// | | | | | |  __/ |_| | | | (_) | (_| \__ \
// |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/

export const LOG_PREFIX = 'Github UI Rewrite:';

/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement}
 */
export function $mustExist(selector, parent = document) {
	const $dom = $(selector, parent);
	if (!$dom)
		warn(`\`${selector}\` is missing!`);
	return $dom;
}


/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement}
 */
export function $(selector, parent = document) {
	return parent.querySelector(selector);
}

/**
 * @param {string[]} selectors
 * @param {any} parent
 * @returns {HTMLElement}
 */
export function $atLeastOne(selectors, parent = document) {
	const $elements = selectors
		.map(selector => $(selector, parent))
		.filter(it => it);
	if ($elements.length === 0)
		warn(`${selectors.map(it => `\`${it}\``)} are missing!`);
	return $elements[0];
}

/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement[]}
 */
export function $$(selector, parent = document) {
	return Array.prototype.slice.call(parent.querySelectorAll(selector));
}

export function log(ctx) {
	console.log(`${LOG_PREFIX} ${ctx}`);
}

export function warn(ctx) {
	console.warn(`${LOG_PREFIX} ${ctx}`);
}
