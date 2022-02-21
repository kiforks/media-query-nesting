const stylelint = require("stylelint");

const { report, validateOptions, ruleMessages } = stylelint.utils;
const ruleName = "kiforks/media-query-nesting";
const messages = ruleMessages(ruleName, {
	expected: 'Selector can\'t be nested within a media query (but media query should be nested within the selector).',
});

module.exports = stylelint.createPlugin(ruleName, (enabled) => {
	if (!enabled) {
		return;
	}
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				// No options for now...
			}
		);

		if (!validOptions) {
			return;
		}

		root.walkAtRules('include', atRule => {
			const nodes = JSON.stringify(atRule.nodes);

			const hasNesting = (nodes.includes('selector') && atRule.params.includes('media')) || (atRule.parent.type === "root");

			if (!hasNesting) {
				return;
			}

			report({
				result,
				ruleName,
				message: messages.expected,
				node: atRule,
				word: atRule.value
			});
		})
	}
});

module.exports.ruleName = ruleName;
module.exports.messages = messages;
