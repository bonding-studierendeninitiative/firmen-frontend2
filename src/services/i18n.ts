import { derived } from 'svelte/store';
import {
	dictionary,
	locale as localeStore,
	_,
	date,
	time,
	number,
	register,
	init
} from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '/lang/{locale}.json';

let cachedLocale: string;

interface SetupI18nOptions {
	withLocale: string;
}

function setupI18n({ withLocale }: SetupI18nOptions = { withLocale: 'en' }) {
	const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', withLocale);
	register(withLocale, async () => {
		const response = await fetch(messagesFileUrl);
		return await response.json();
	});
}

function formatDate(
	dateValue: string | number | Date,
	options: Intl.DateTimeFormatOptions
): string {
	return new Intl.DateTimeFormat(cachedLocale, options).format(new Date(dateValue));
}

const isLocaleLoaded = derived(localeStore, ($locale) => typeof $locale === 'string');

const dir = derived(localeStore, ($locale) => ($locale === 'ar' ? 'rtl' : 'ltr'));

export {
	_,
	localeStore as locale,
	dir,
	setupI18n,
	formatDate,
	isLocaleLoaded,
	date,
	time,
	number,
	dictionary,
	init
};
