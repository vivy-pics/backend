module.exports = {
	root: true,
	plugins: ["@typescript-eslint", "eslint-comments", "promise", "unicorn"],
	extends: [
		"airbnb-base",
		"airbnb-typescript/base",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:eslint-comments/recommended",
		"plugin:promise/recommended",
		"plugin:unicorn/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.eslint.json",
	},
	rules: {
		"no-prototype-builtins": "off",
		"no-restricted-syntax": "off",
		"no-void": ["warn", { allowAsStatement: true }],
		"import/prefer-default-export": "off",
		"import/order": [
			"error",
			{
				"newlines-between": "always",
			},
		],
		"import/extensions": "off",
		"promise/always-return": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/no-use-before-define": [
			"error",
			{
				functions: false,
				classes: true,
				variables: true,
				typedefs: true,
			},
		],
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/require-await": "off",
	},
};
