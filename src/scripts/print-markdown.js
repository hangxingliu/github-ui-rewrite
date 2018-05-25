//@ts-check
import { log, $mustExist, $ } from "./_utils";
import { loadSettings } from "../settings-page/settings";

document.addEventListener('DOMContentLoaded', () => {
	loadSettings(settings => {
		if (settings.addPdfPrintButton) {
			steupForPrintMarkdown();
		}
	});
});

const btnClass = 'btn-from-extension-for-print-pdf';

let inited = false;
function steupForPrintMarkdown() {
	if (inited) return;
	inited = true;
	log('steupForPrintMarkdown');

	setup();
	// document.addEventListener('pjax:end', function onPjaxEnd() {
	// 	log('on pjax:end');
	// 	setup();
	// });

	const $listen = $mustExist('#js-repo-pjax-container');
	if ($listen) {
		let lastUpdate = 0;
		const listener = new MutationObserver(list => {
			log(`#js-repo-pjax-container changed!`);

			const now = Date.now();
			if (now < lastUpdate + 500) return;
			lastUpdate = now;

			setup();
		});
		listener.observe($listen, { childList: true });
		log(`start listen #js-repo-pjax-container DOM change`);
	}

	function setup() {
		const $readme = $('#readme'); // markdown area
		if (!$readme) return;

		const $oldButton = $(`.${btnClass}`);
		if ($oldButton) return;

		const $bar = $('.file-actions');
		if ($bar) {
			const $before = $('a.btn-octicon', $bar);
			if (!$before) return;

			const $button = createButton(onClick.bind(this, {}));
			$bar.insertBefore($button, $before);
		} else {
			const $appendBar = $mustExist('h3', $readme);
			if (!$appendBar) return;

			const $button = createButton(onClick.bind(this, { repoReademe: true }));
			$button.setAttribute('style', 'position:absolute;top:5px;right:10px');
			$appendBar.appendChild($button);
		}
	}

	/**
	 * @param {{repoReademe: boolean}} options
	 * @param {Event} event
	 */
	function onClick(options, event) {
		event.preventDefault();

		const $markdownTitle = $('#readme h1');
		const printTitle = $markdownTitle ? $markdownTitle.innerText : document.title;

		const printDialog = window.open('', printTitle, 'height=794,width=1123');
		const printDocument = printDialog.document;
		printDocument.write(document.documentElement.innerHTML);
		printDocument.close();
		printDialog.addEventListener('DOMContentLoaded', prepareForPrint);
		printDialog.addEventListener('load', ok2print);
		printDialog.focus();

		function prepareForPrint() {
			log(`prepare for print (title: ${JSON.stringify(printTitle)})`);

			document.title = printTitle;
			const $body = $('body', printDocument);
			const $printReadme = $('#readme', printDocument);
			if (options.repoReademe) {
				const $h3 = $('#readme > h3', printDocument);
				if ($h3) $printReadme.removeChild($h3);
			}
			$body.setAttribute('style', 'min-width: inherit');
			$printReadme.setAttribute('style', 'background-color:white');
			$('#readme>article', printDocument).setAttribute('style', 'border: none');
			$body.innerHTML = $printReadme.outerHTML;
		}

		function ok2print() {
			log(`OK to print`);

			printDialog.print();
			printDialog.close();
		}
	}
}

function createButton(onClick) {
	const icon = `<svg class="octicon octicon-file-pdf" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true">
		<path fill-rule="evenodd" d="M8.5 1H1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V4.5L8.5 1zM1 2h4a.68.68 0 0 0-.31.2 1.08 1.08 0 0 0-.23.47 4.22 4.22 0 0 0-.09 1.47c.06.609.173 1.211.34 1.8A21.78 21.78 0 0 1 3.6 8.6c-.5 1-.8 1.66-.91 1.84a7.161 7.161 0 0 0-.69.3 4.19 4.19 0 0 0-1 .64V2zm4.42 4.8a5.65 5.65 0 0 0 1.17 2.09c.275.237.595.417.94.53-.64.09-1.23.2-1.81.33a12.22 12.22 0 0 0-1.81.59c-.587.243.22-.44.61-1.25.365-.74.67-1.51.91-2.3l-.01.01zM11 14H1.5a.743.743 0 0 1-.17 0 2.12 2.12 0 0 0 .73-.44 10.14 10.14 0 0 0 1.78-2.38c.31-.13.58-.23.81-.31l.42-.14c.45-.13.94-.23 1.44-.33s1-.16 1.48-.2c.447.216.912.394 1.39.53.403.11.814.188 1.23.23h.38V14H11zm0-4.86a3.74 3.74 0 0 0-.64-.28 4.22 4.22 0 0 0-.75-.11c-.411.003-.822.03-1.23.08a3 3 0 0 1-1-.64 6.07 6.07 0 0 1-1.29-2.33c.111-.662.178-1.33.2-2 .02-.25.02-.5 0-.75a1.05 1.05 0 0 0-.2-.88.82.82 0 0 0-.61-.23H8l3 3v4.14z">
		</path>
	</svg>`;

	const button = document.createElement('a');
	button.setAttribute('href', 'javascript:;');
	button.setAttribute(`class`, `btn-octicon tooltipped tooltipped-nw ${btnClass}`);
	button.setAttribute('style', 'margin-left:5px;margin-right:3px');
	button.setAttribute('aria-label', 'Print this file as PDF');
	button.innerHTML = icon;
	button.addEventListener('click', onClick)

	return button;
}
