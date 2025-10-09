mix.options({
    autoprefixer: false,
    processCssUrls: false,

    postCss: [
        require('autoprefixer'),
        require('postcss-easy-import')(),
        require('tailwindcss'),
        require('postcss-nested')(),
        require('postcss-preset-env')(),
        require('postcss-css-variables')()
    ],
})