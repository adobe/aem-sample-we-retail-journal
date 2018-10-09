This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Table of Contents

- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm run build](#npm-run-build)
  - [npm run install:link-deps](#npm-run-installlink-deps)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The AEM instance must allow the Cross-Origin Resource Sharing with your local server. See the following [documentation](https://helpx.adobe.com/experience-manager/kt/platform-repository/using/cors-security-article-understand.html) for more detail

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

**Note that this is not the preferred way of running the SPA project; for now, we recommend to install the [parent project](https://github.com/adobe/aem-sample-we-retail-journal#install-everything) directly on your AEM instance.**

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run install:link-deps`

Installs the application dependencies by using local versions of `@adobe/cq-spa-page-model-manager` and `@adobe/cq-spa-component-mapping`. 

This is useful during development time of the SPA Editor sub-modules. The workflow to adopt is then the following:
* Make changes in local page model manager module or in local component mapping module
* Build and link module to the global folder by running `npm run build && npm link` in the corresponding module's directory
* Install the local modules by running `npm run install:link-deps` (instead of `npm install`) in the SPA project's directory
