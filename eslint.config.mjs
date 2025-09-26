import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'error',
		},
	},
	{
		files: ['next-env.d.ts'], // Target the next-env.d.ts file specifically
		rules: {
			'@typescript-eslint/triple-slash-reference': 'off', // Disable the rule for this file
		},
	},
	{
		ignores: [
			'node_modules/**',
			'.next/**',
			'out/**',
			'build/**',
			'next-env.d.ts',
			'src/components/ui/**',
			'src/generated/prisma/**',
		],
	},
];

export default eslintConfig;
