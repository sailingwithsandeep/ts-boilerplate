module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['standard-with-typescript', 'plugin:prettier/recommended', 'plugin:import/errors', 'plugin:import/warnings', 'plugin:import/typescript'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier', 'import'],

    rules: {
        'prettier/prettier': 'error',
        'import/extensions': 'off',
        'import/no-unresolved': 'error',
        'no-console': 'off',
        'no-restricted-syntax': 'off',
        'no-param-reassign': 'off',
        'consistent-return': 'off',
        'no-underscore-dangle': ['error', { allow: ['_id'] }],
        'class-methods-use-this': 'off',
        radix: 'off',
        eqeqeq: 'off',
        'import/order': [
            'error',
            {
                'newlines-between': 'never',
                groups: [
                    ['builtin', 'external'],
                    ['internal', 'parent', 'sibling', 'index'],
                ],
            },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: './tsconfig.json',
            },
        },
    },
    globals: {
        _: 'readonly',
        log: 'readonly',
        emitter: 'readonly',
        messages: 'readonly',
        redis: 'readonly',
        app: 'readonly',
    },
};
