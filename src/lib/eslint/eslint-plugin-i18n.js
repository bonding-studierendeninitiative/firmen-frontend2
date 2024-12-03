import noUntranslatedStrings from './rules/no-untranslated-strings.js';

const plugin = {
	meta: {
		name: '@i18n'
	},
	rules: { 'no-untranslated-strings': noUntranslatedStrings }
};
export default plugin;
