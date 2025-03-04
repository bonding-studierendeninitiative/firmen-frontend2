import { derived, type Readable } from 'svelte/store';
import dayjs from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {
	dictionary,
	locale as localeStore,
	_,
	date,
	time,
	number,
	register,
	init,
	isLoading
} from 'svelte-i18n';
import { allFakers, type Faker } from '@faker-js/faker';

const MESSAGE_FILE_URL_TEMPLATE = '/lang/{locale}.json';

let cachedLocale: string;

export const faker: Readable<Faker> = derived(
	localeStore,
	(value) => allFakers[value] || allFakers['en']
);

export const availableLocales = ['de', 'en'] as const;
export type AvailableLocales = (typeof availableLocales)[number];

function setupI18n() {
	dayjs.extend(relativeTime);
	dayjs.extend(localizedFormat);
	availableLocales.map((locale) => {
		const messagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', locale);
		register(locale, async () => {
			dayjs.locale(locale);
			const response = await fetch(messagesFileUrl);
			return await response.json();
		});
	});
	init({
		initialLocale: 'de',
		fallbackLocale: 'de'
	});
}

function formatDate(
	dateValue: string | number | Date,
	options: Intl.DateTimeFormatOptions
): string {
	return new Intl.DateTimeFormat(cachedLocale, options).format(new Date(dateValue));
}

const isLocaleLoaded = derived(localeStore, ($locale) => typeof $locale === 'string');
const isInitializing = derived(
	[isLocaleLoaded, isLoading],
	([loaded, loading]) => !loaded || loading
);

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
	init,
	isInitializing as isLocaleLoading,
	dayjs
};
