import { derived } from 'svelte/store';
import { dictionary, locale as localeStore, _, date, time, number } from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '/lang/{locale}.json';

let cachedLocale: string;

interface SetupI18nOptions {
	withLocale: string;
}

function setupI18n({ withLocale }: SetupI18nOptions = { withLocale: 'en' }): Promise<void> {
	const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', withLocale);
	console.log({ messagesFileUrl });
	return fetch(messagesFileUrl)
		.then((response) => response.json())
		.then((messages) => {
			dictionary.set({ [withLocale]: messages });

			cachedLocale = withLocale;

			localeStore.set(withLocale);
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
	dictionary
};
