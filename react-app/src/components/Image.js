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
import React, {Component} from 'react';
import {extractModelId} from '../Utils';
import {MapTo} from '@adobe/cq-react-editable-components';

require('./Image.css');

/**
 * Default Edit configuration for the Image component that interact with the Core Image component and sub-types
 *
 * @type EditConfig
 */
const ImageEditConfig = {

    emptyLabel: 'Image',

    isEmpty: function(props) {
        return !props || !props.src || props.src.trim().length < 1;
    }
};

/**
 * Expected usage of the Image Component.
 *
 * <Image
 *      cqModel='the whole Object holding information for the image from the model.json response' />
 *
 * Please see the package.json for the proxy settings.
 */
class Image extends Component {

    hasLink() {
        return this.props && this.props.link;
    }

    get content() {
        return <img id={extractModelId(this.props.cqPath)} src={this.props.src} alt={this.props.alt}
            title={this.props.displayPopupTitle && this.props.title}/>
    }

    get linkedContent() {
        return <a href={this.props.link} data-title={this.props.title || this.props.alt} data-asset={this.props.fileReference}>
                {this.content}
            </a>
    }

    render() {
        let innerContent = this.hasLink() ? this.linkedContent : this.content;
        return (<div className="cmp-image">
                {innerContent}
            </div>);
    }
}

MapTo('we-retail-journal/components/image')(Image, ImageEditConfig);
