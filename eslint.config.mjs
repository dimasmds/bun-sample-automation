import globals from 'globals';
import tseslint from 'typescript-eslint';
import daStyle from 'eslint-config-dicodingacademy';

export default [
  {languageOptions: { globals: globals.node }},
  ...tseslint.configs.recommended,
  daStyle,
];
