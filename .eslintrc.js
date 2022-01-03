const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    env: {
        node: true,
        commonjs: true,
    },
    extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:prettier/recommended'],
    rules: {
        'no-console': isProduction ? 'warn' : 'off',
        'no-debugger': isProduction ? 'warn' : 'off',
    },
}
