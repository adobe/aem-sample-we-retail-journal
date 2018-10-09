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
// Expose XMLHttpRequest globally so ModelManager can use it
global.fetch = require('node-fetch/lib/index');

import { CustomModelClient } from "./CustomModelClient";
import React from "react";
import ReactDOMServer from 'react-dom/server';
import express from "express";
import bodyParser from "body-parser";
import App from "../App";
import { StaticRouter } from "react-router-dom";
import { Constants, EditorContext } from '@adobe/cq-react-editable-components';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

import '../ImportComponents';

const exapp = express();
//Here we are configuring express to use body-parser as middle-ware.
exapp.use(bodyParser.urlencoded({ extended: false }));
exapp.use(bodyParser.json());
exapp.use(express.static("dist"));

const APP_ROOT_PATH = process.env.APP_ROOT_PATH;

/**
 * Renders a valid model to a html stringify
 *
 * @param   {Object} model - the model to render
 * @param   {[type]} pagePath - the pagePath of the current model
 * @param   {[type]} requestUrl - the request url
 * @param   {[type]} requestPath - the request path 
 * @param   {[type]} pageModelRootPath - Path to the app root
 * @param   {[type]} isInEditor - Is the app used in the context of the page editor
 * @returns {String} the string serialization of the html output + state
 */
function renderModelToHTMLString(model, pagePath, requestUrl, requestPath, pageModelRootPath, isInEditor) {
     const html = ReactDOMServer.renderToString(
        <StaticRouter location={ requestUrl } context={{}}>
            <EditorContext.Provider value={isInEditor}>
                <App cqChildren={model[Constants.CHILDREN_PROP]} cqItems={model[Constants.ITEMS_PROP]} cqItemsOrder={model[Constants.ITEMS_ORDER_PROP]} cqPath={pageModelRootPath} locationPathname={requestPath}/>
            </EditorContext.Provider>
        </StaticRouter>
    );

    // We are using ' for the string to we need to make sure we are encoding all other '
    let state = {
        rootModel : model,
        rootModelUrl: ModelManager.rootPath,
        pagePath
    };
    let stateStr = JSON.stringify(state);

    return `${html}
        <script type="application/json" id="__INITIAL_STATE__">
            ${stateStr}
        </script>`;
}

exapp.get('/content/we-retail-journal/react*.html', (req, res, next) => {
    if (!process.env.API_HOST) {
        console.error("You have not set any api host. Be sure you set the environment variable API_HOST before running the command");
        process.exit(1);
    }

    if (!APP_ROOT_PATH) {
        console.error("You have not set any root path for app. Be sure you set the environment variable APP_ROOT_PATH before running the command");
        process.exit(1);
    }

    let pagePath = req.path.replace('.html', '');
    let modelClient = new CustomModelClient(process.env.API_HOST);
    return ModelManager.initialize({path: APP_ROOT_PATH, modelClient: modelClient}).then(() => {
        return ModelManager.getData({ path: pagePath }).then((model) => {
            res.send(renderModelToHTMLString(model, pagePath, req.url, req.path));
        });
    }).catch((error) => {
        next(error);
    });
});
 
exapp.post("/content/we-retail-journal/react*.html", (req, res, next) => {
    const wcmMode = req.headers['wcm-mode'];
    const isInEditor = wcmMode && wcmMode === 'EDIT' || wcmMode === 'PREVIEW';
    const pageModelRootPath = req.headers['page-model-root-url'] || APP_ROOT_PATH;
    let model = req.body;
    let pagePath = req.path.replace('.html', '');
    let modelClient = new CustomModelClient();
    return ModelManager.initialize({path: pageModelRootPath, model: model, modelClient: modelClient}).then((model) => {
        res.send(renderModelToHTMLString(model, pagePath, req.url, req.path, pageModelRootPath, isInEditor));
    }).catch((error) => {
        next(error);
    });
});

exapp.listen(4200, () => console.log('Example exapp listening on port 4200!'));