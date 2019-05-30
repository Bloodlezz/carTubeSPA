const path = require('path');
const copyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
    mode: 'production',
    entry: './src/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './')
    },
    resolve: {
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },
    plugins: [
        new copyWebpackPlugin([
            {
                from: './src/views',
                to: 'views'
            },
            {
                from: './src/css',
                to: 'css'
            },
            {
                from: './src/lib',
                to: 'lib'
            },
            {
                from: './src/images',
                to: 'images'
            }
        ]),
        new Dotenv(),
    ]
};