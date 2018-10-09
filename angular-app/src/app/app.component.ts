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

import { Component } from '@angular/core';
import { ModelManagerService }     from './components/model-manager.service';
import { ModelManager, ModelClient } from '@adobe/cq-spa-page-model-manager';
import { Constants } from "@adobe/cq-angular-editable-components";
import { TransferState, makeStateKey }  from '@angular/platform-browser';
import { isPlatformBrowser, APP_BASE_HREF } from '@angular/common';
import { NgModule, PLATFORM_ID, APP_ID, Inject  } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  host: {
    'class': 'app'
  },
  template: `
    <router-outlet></router-outlet>
  `
})

export class AppComponent {
  items;
  itemsOrder;
  path;
  constructor(private modelManagerService: ModelManagerService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {

    const platform = isPlatformBrowser(platformId);
    const key = makeStateKey("_angular_initial_state");
    if (platform) {
      // We are on the browser
      // Let's check for the state
      const rootModel = this.state.get(key, (<any>null));

      let modelClient = new ModelClient(environment.API_HOST);

      ModelManager.initialize({ model: rootModel, modelClient: modelClient })
        .then(this.updateData.bind(this));
    } else {
      // We are on the server, and we know that we preloaded the ModelManager;
      // Let's store it
      ModelManager.getData(ModelManager.rootPath).then((model) => {
        this.state.set(key, (<any>model));
        this.updateData(model);
      });
    }
  }

  private updateData(model) {
    this.path = model[Constants.PATH_PROP];
    this.items = model[Constants.ITEMS_PROP];
    this.itemsOrder = model[Constants.ITEMS_ORDER_PROP];
  }

  /**
   * Returns a model path from the given URL
   * @param {string} url     - Path from which to extract a model path
   * @return {string|undefined}
   */
  private getModelPath(url) {
      if (!url) {
          return;
      }

      let dotIndex = url.indexOf(".");
      return url.substr(0, dotIndex > -1 ? dotIndex : url.length);
  }
}

