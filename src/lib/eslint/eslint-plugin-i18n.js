import noUntranslatedStrings from './rules/no-untranslated-strings';

const plugin = {
	meta: {
		name: '@i18n'
	},
	rules: { 'no-untranslated-strings': noUntranslatedStrings }
};
export default plugin;
