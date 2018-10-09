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

import { TextComponent } from "./text/text.component";
import { ImageComponent } from "./image/image.component";
import { WeatherComponent } from "./weather/weather.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { MapTo, AEMContainerComponent, AEMResponsiveGridComponent } from "@adobe/cq-angular-editable-components";

/**
 * Default Edit configuration for the Image component that interact with the Core Image component and sub-types
 *
 * @type EditConfig
 */
const ImageEditConfig = {

    emptyLabel: 'Image',

    isEmpty: function(cqModel) {
        return !cqModel || !cqModel.src || cqModel.src.trim().length < 1;
    }
};

/**
 * Default Edit configuration for the Text component that interact with the Core Text component and sub-types
 *
 * @type EditConfig
 */
const TextEditConfig = {

    emptyLabel: 'Text',

    isEmpty: function(cqModel) {
        return !cqModel || !cqModel.text || cqModel.text.trim().length < 1;
    }
};
MapTo('we-retail-journal/components/text')(TextComponent, TextEditConfig);
MapTo('we-retail-journal/components/image')(ImageComponent, ImageEditConfig);
MapTo('wcm/foundation/components/responsivegrid')(AEMResponsiveGridComponent);
MapTo('we-retail-journal/components/weather')(WeatherComponent);
MapTo('we-retail-journal/components/navigation')(NavigationComponent);
MapTo('we-retail-journal/angular/components/structure/app')(AEMContainerComponent);

