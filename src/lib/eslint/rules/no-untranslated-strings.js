/**
 * @fileoverview ESLint rule to warn about untranslatable string literals in Svelte templates.
 */

'use strict';

/** @type {import('eslint').Rule.RuleModule} */
export default {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Warn about untranslatable string literals in Svelte templates. Ensure all strings are passed through svelte-i18n functions.',
			category: 'Internationalization',
			recommended: false
		},
		messages: {
			untranslatedString:
				"Untranslated string found: '{{ text }}'. Use svelte-i18n for internationalization."
		},
		schema: [] // no options
	},
	create(context) {
		return {
			SvelteElement(node) {
				// The node is a tag, e.g., <div>, <span>, etc.
				// We need to inspect its children.

				if (!node.children) return;

				node.children.forEach((child) => {
					if (child.type === 'SvelteText') {
						const text = child.value.trim();

						// Ignore empty strings or strings with only whitespace
						if (text.length === 0) return;

						// Check if the text is within a MustacheTag (i.e., dynamic)
						// If it's plain text, it's untranslatable
						// Alternatively, you might have more complex logic
						// Here we assume any plain text should be translated

						// To handle complex cases, you might need to parse child differently

						// Report the untranslatable string
						context.report({
							node: child,
							messageId: 'untranslatedString',
							data: {
								text
							}
						});
					} else if (child.type === 'SvelteMustacheTag') {
						const expression = child.expression;

						if (expression.type === 'Literal' && typeof expression.value === 'string') {
							// Static string inside MustacheTag, e.g., {'Hello'}
							context.report({
								node: child,
								messageId: 'untranslatedString',
								data: {
									text: expression.value
								}
							});
						} else if (expression.type === 'TemplateLiteral') {
							// Template literals like {`Hello ${name}`}
							// You might want to flag static parts
							expression.quasis.forEach((quasi) => {
								const text = quasi.value.cooked.trim();
								if (text.length > 0) {
									context.report({
										node: quasi,
										messageId: 'untranslatedString',
										data: {
											text
										}
									});
								}
							});
						} else if (expression.type === 'BinaryExpression') {
							// Concatenated strings like {"Hello " + name}
							// You might need to traverse the binary expression
							// For simplicity, report the entire expression
							context.report({
								node: child,
								messageId: 'untranslatedString',
								data: {
									text: 'String concatenation not wrapped in translation function.'
								}
							});
						}
						// Further expression types can be handled as needed
					}
				});
			}
		};
	}
};
