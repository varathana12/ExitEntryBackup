let mix = require('laravel-mix');
let webpack = require('webpack');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/assets/js/entry.js', 'public/js')
    .react('resources/assets/js/ForReset.js', 'public/js')
    .react('resources/assets/js/email.js', 'public/js')
    .react('resources/assets/js/login.js', 'public/js')

    .react('resources/assets/js/exit.js', 'public/js')
    .react('resources/assets/js/admin.js', 'public/js')
    .sass('resources/assets/sass/app.scss', 'public/css')
    // .extract(['react', 'axios', 'jquery', 'react-timeout', 'validate.js'])

mix.webpackConfig({
    plugins: [
        // https://webpack.js.org/plugins/commons-chunk-plugin/
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/vendor',
            minChunks: function (module) {
                // This prevents stylesheet resources with the .css or .scss extension
                // from being moved from their original chunk to the vendor chunk
                if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                    return false;
                }
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'js/manifest',
            minChunks: Infinity
        }),
    ]
});
