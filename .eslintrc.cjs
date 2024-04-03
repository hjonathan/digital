module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ['plugin:vue/vue3-essential', 'standard', 'plugin:cypress/recommended'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules:{
        indent: ["error", 4],
        "comma-dangle": ["error", {
            "arrays": "always-multiline",
            "objects": "never",
        }],
        semi: ["error", "never"]
    },
    ignorePatterns: [
        '.vscode/**/*.*',
        'node_modules/**/*.*',
        '.eslintignore',
        '.eslintrc.cjs',
        '.gitignore',
        '.prettierrc.json',
        '.lerna.json',
        'package.json',
        'package-lock.json',
        'README.md',
        'apps/**/*.json',
        'apps/**/*.css',
        'apps/**/*.html',
        'apps/**/*.md',
        'apps/**/*.gitignore',
        'apps/**/package.json',
        'apps/**/vite.config.js',
    ],
}
