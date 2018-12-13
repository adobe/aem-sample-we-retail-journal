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

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular', 'sinon'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-junit-reporter'),
      require('karma-webdriver-launcher'),
      require('@angular-devkit/build-angular/plugins/karma'),
      require('karma-sinon')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, '../target/coverage/%browser%/'),
      reports: ['lcov'],
      fixWebpackSourcePaths: true,
      combineBrowserReports: false
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml', 'junit'],
    junitReporter: {
      useBrowserName: true,
      outputDir: '../target/surefire-reports'
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['chrome_wd', 'firefox_wd'],
    customLaunchers: {
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
    singleRun: true
  });
};
