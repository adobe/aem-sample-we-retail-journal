import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { getVerifyObserver } from './Utils';
import { RouteListener, withRoute } from '../src/RouteHelper';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';


describe('RouterHelper ->', () => {

    const ROUTE_CONTENT_CLASS_NAME = "route-content";
    const ROOT_NODE_CLASS_NAME = "route-node";
    const PAGE_TITLE = 'Page Title';
    const CUSTOM_ROUTE_PATH = '/content/custom';
    const CUSTOM_ROUTE_PATH_2 = '/content/custom/2';
    const CUSTOM_ROUTE_PATH_ALIAS_2 = '/custom2';

    let observer;

    let observerConfig = { attributes: true, subtree: true, childList: true };

    let rootNode;

    class RouteContent extends Component {
        render() {
            return <div data-title={this.props.cqModel && this.props.cqModel.title} className={ROUTE_CONTENT_CLASS_NAME}/>;
        }
    }

    let sandbox = sinon.createSandbox();

    beforeEach(() => {
        sandbox.stub(ModelManager, 'getData')
            .withArgs({pagePath: CUSTOM_ROUTE_PATH}).resolves({})
            .withArgs({pagePath: CUSTOM_ROUTE_PATH_2}).resolves({})
            .withArgs({pagePath: CUSTOM_ROUTE_PATH_ALIAS_2}).resolves({});

        rootNode = document.createElement('div');
        rootNode.className = ROOT_NODE_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        window.location.hash = '';

        if (observer) {
            observer.disconnect();
        }

        if (rootNode) {
            document.body.removeChild(rootNode);
        }

        sandbox.restore();
    });

    describe('withRoute ->', () => {
        it('should pass the properties to the wrapped component', (done) => {
            // Expect the page title to be passed to the wrapped component
            observer = getVerifyObserver(function (mutation) {
                return mutation.type === 'childList' && mutation.addedNodes && mutation.addedNodes.length > 0 && mutation.addedNodes[0].dataset.title === PAGE_TITLE;
            }, done);

            observer.observe(rootNode, observerConfig);

            const cqModel = {
                path: '/content/page/path',
                title: PAGE_TITLE
            };

            let WrappedComponent = withRoute(RouteContent);
            ReactDOM.render(<BrowserRouter><WrappedComponent cqModel={cqModel}/></BrowserRouter>, rootNode);
        });
    });
});
