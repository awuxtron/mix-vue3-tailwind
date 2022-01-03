const fs = require('fs')
const path = require('path')
const mix = require('laravel-mix')
const ESLintPlugin = require('eslint-webpack-plugin')

mix.setPublicPath('dist')
    .postCss('src/assets/css/app.pcss', 'dist', [
        require('postcss-import'),
        require('tailwindcss/nesting'),
        require('tailwindcss'),
    ])
    .js('src/app.js', 'dist')
    .vue({ version: 3, extractStyles: true })
    .extract()
    .sourceMaps(false, 'inline-source-map')
    .version()
    .copy('public', 'dist')
    .alias({
        '@': path.join(__dirname, 'src'),
    })
    .before(() => {
        fs.rmSync(path.join(__dirname, 'dist'), { recursive: true, force: true })
    })
    .after(() => {
        const styles = []
        const scripts = []
        const files = require(path.join(__dirname, 'dist/mix-manifest.json'))
        let html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8')

        Object.keys(files).forEach((k) => {
            if (k.endsWith('.js')) {
                scripts.push(`<script src="${files[k]}"></script>`)
            }

            if (k.endsWith('.css')) {
                styles.push(`<link rel="stylesheet" href="${files[k]}" />`)
            }
        })

        html = html.replace('<!--%Styles%-->', styles.join(''))
        html = html.replace('<!--%Scripts%-->', scripts.join(''))

        fs.writeFileSync(path.join(__dirname, 'dist/index.html'), html)
    })
    .options({
        legacyNodePolyfills: true,
        terser: {
            extractComments: false,
            terserOptions: {
                format: {
                    comments: false,
                },
            },
        },
    })
    .webpackConfig({
        plugins: [new ESLintPlugin()],
    })
