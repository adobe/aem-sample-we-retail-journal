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

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('path');
const webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // frameworks to use
        frameworks: [ 'mocha', 'sinon-chai' ],

        // list of files to load in the browser
        files: [
            {
                pattern: 'tests/test-context.js',
                watched: true
            }
        ],

        // list of files to exclude
        exclude: [],

        // process es6 files
        preprocessors: {
            'tests/test-context.js': [ 'webpack', 'sourcemap' ]
        },

        coverageReporter: {
            dir: 'coverage',
            includeAllSources: true,
            reporters: [
                {type:'text'},
                {type: 'lcov'}
            ]
        },

        // webpack
        webpack: webpackConfig,

        webpackServer: {
            noInfo: true
        },

        // chai config
        client: {
            chai: {
                includeStack: true
            }
        },

        // test results reporter (options: 'dots', 'progress', 'junit', 'growl', 'coverage')
        reporters: [ 'progress', 'coverage' ],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging (options: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG)
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // browsers ('Chrome', 'ChromeCanary', 'Firefox', 'Opera', 'Safari', 'PhantomJS', 'IE')
        browsers: [ 'Chrome' ],

        customLaunchers: {
            Chrome_with_debugging: {
                base: 'Chrome',
                chromeDataDir: path.resolve(__dirname, '.chrome')
            },
            chrome_wd: {
                base: 'WebDriver',
                config: {
                    hostname: 'localhost',
                    port: 4444
                },
                browserName: 'chrome',
                name: 'Karma',
                pseudoActivityInterval: 30000
            },
            firefox_wd: {
                base: 'WebDriver',
                config: {
                    hostname: 'localhost',
                    port: 4444
                },
                browserName: 'firefox',
                name: 'Karma',
                pseudoActivityInterval: 30000
            }
        },

        // if browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,
        singleRun: true
    });
};