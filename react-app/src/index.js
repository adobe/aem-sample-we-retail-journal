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
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ModelManager, ModelClient, Constants } from "@adobe/cq-spa-page-model-manager";
import {BrowserRouter} from 'react-router-dom';
import "./ImportComponents";

function render(pageModel, useHydrate) {
    // Using HashRouter for now as it's easier to deal with hashes in the location + we are serving static content (while BrowserRouter is a better fit for serving dynamic content)
    ReactDOM[useHydrate ? 'hydrate' : 'render']((<BrowserRouter>
        <App cqChildren={pageModel[Constants.CHILDREN_PROP]} cqItems={pageModel[Constants.ITEMS_PROP]} cqItemsOrder={pageModel[Constants.ITEMS_ORDER_PROP]} cqPath={pageModel[Constants.PATH_PROP]} locationPathname={ window.location.pathname }/>
    </BrowserRouter>), document.getElementById('page'));
}

document.addEventListener('DOMContentLoaded', () => {
    let jsonScript = document.getElementById("__INITIAL_STATE__");
    let initialState = null;
    if (jsonScript) {
        initialState = JSON.parse(jsonScript.innerText);
        // Remove the script element from the DOM
        jsonScript.remove();
    }
    
    let apiHost = process.env.API_HOST;
    let initialModel = initialState ? initialState.rootModel : undefined;

    let modelClient = new ModelClient(apiHost);
    ModelManager.initialize({model: initialModel, modelClient: modelClient}).then((model) => {
        render(model, !!initialModel);
    });
});


