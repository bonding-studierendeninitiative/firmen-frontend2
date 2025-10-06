'use strict';

import rule from './no-untranslated-strings.js';

import { RuleTester } from 'eslint';
import parser from 'svelte-eslint-parser';

const ruleTester = new RuleTester({
	files: ['**/*.svelte'],

	languageOptions: {
		parser: parser,
		ecmaVersion: 5,
		sourceType: 'script',

		parserOptions: {
			parser: '@typescript-eslint/parser'
		}
	}
});

ruleTester.run('no-untranslated-strings', rule, {
	valid: [
		{
			code: `
		<script>
      import { _ } from '@services';
    </script>

    <div>
      {$_('welcome')}
    </div>
`,
			options: [],
			filename: 'Valid.svelte'
		}
	],

	invalid: [
		{
			code: `
		<script>
      import { _ } from '@services';
    </script>

    <div>
      Hello World!
    </div>`,
			errors: [
				{
					message:
						"Untranslated string found: 'Hello World!'. Use svelte-i18n for internationalization."
				}
			],
			filename: 'InvalidSimpleText.svelte'
		}
	]
});
