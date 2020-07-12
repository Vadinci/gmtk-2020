const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebPack = require('webpack');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
    mode: 'production',
    watch : false,

    entry: {
        'game': './src/js/index.js'
    },
    resolve: {
        modules: [
            './src/js',
            'node_modules'
        ],
        alias: {
            '@Marzipan': path.resolve(ROOT, './node_modules/MarzipanJS/src'),
            '@Tween': path.resolve(ROOT,  './node_modules/MZPTweenJS/src'),
        }
    },
    output: {
        filename: 'game.js',
        path: path.resolve(ROOT, './dist/build'),
    },
    plugins : [
        new CopyWebpackPlugin({
            patterns : [
                {from : './src/assets', to : 'assets' },
                {from : './src/assets.yaml', to : 'assets.yaml' },
                {from : './src/style.css', to : 'style.css' }
            ]
        }),
        new WebPack.DefinePlugin({
            IS_DEV : JSON.stringify(false)
        }),
        new HtmlWebpackPlugin({
            template : './src/index.html',
            minify : true
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};