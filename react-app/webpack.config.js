/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2018 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// webpack.config.js
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

var isTestEnvironment = process.env.NODE_ENV == 'test';

module.exports = {
    // Tell webpack to start bundling our app at app/index.js
    entry: './src',
    mode: 'development',
    // Output our app to the dist/ directory
    output: {
        globalObject: `typeof self !== 'undefined' ? self : this`,
        filename: isTestEnvironment ? '[name].js' : 'app.js',
        path: path.resolve(__dirname + '/dist'),
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000,
        historyApiFallback: {
          disableDotRule: true
        }
    },
    // Emit source maps so we can debug our code in the browser
    devtool: 'source-map',

    // Tell webpack to run our source code through Babel
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                enforce: 'post'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }].concat(isTestEnvironment ? [{
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                },
                enforce: 'post'
            }] : [])
    },

    // Use the plugin to specify the resulting filename (and add needed behavior to the compiler)
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new webpack.EnvironmentPlugin({
            "API_HOST": process.env.API_HOST
        }),
        new CleanWebpackPlugin(['dist'])
    ]
};
