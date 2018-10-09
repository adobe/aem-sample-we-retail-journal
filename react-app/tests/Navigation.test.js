import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../src/components/Navigation';
import { ModelManager } from '@adobe/cq-spa-page-model-manager';

describe('Navigation ->', () => {

    const ROOT_NODE_CLASS_NAME = "route-node";
    const PRODUCTS_NAME = 'Products';
    const PRODUCT_NAME_1 = 'Product 1';
    const PRODUCT_NAME_2 = 'Product 2';
    const HOME_PATH = '/content/home';
    const HOME_URL = HOME_PATH + '.html';
    const ABOUT_PATH = '/content/about';
    const ABOUT_URL = ABOUT_PATH + '.html';
    const PRODUCTS_PATH = '/content/products';
    const PRODUCTS_URL = PRODUCTS_PATH + '.html';
    const PRODUCT_1_PATH = '/content/products/product_1';
    const PRODUCT_1_URL = PRODUCT_1_PATH + '.html';
    const PRODUCT_2_PATH = '/content/products/product_2';
    const PRODUCT_2_URL = PRODUCT_2_PATH + '.html';

    const NAVIGATION_ITEMS_MODEL = {
        ":type": "we-retail-journal/components/navigation",
        items: [
            {
                path: HOME_PATH,
                url: HOME_URL,
                title: 'Home',
                children: []
            },
            {
                path: ABOUT_PATH,
                url: ABOUT_URL,
                title: 'About Us',
                children: []
            },
            {
                path: PRODUCTS_PATH,
                url: PRODUCTS_URL,
                title: PRODUCTS_NAME,
                children: [
                    {
                        path: PRODUCT_1_PATH,
                        url: PRODUCT_1_URL,
                        title: PRODUCT_NAME_1
                    },
                    {
                        path: PRODUCT_2_PATH,
                        url: PRODUCT_2_URL,
                        title: PRODUCT_NAME_2
                    }
                ]
            }
        ]
    };

    let rootNode;

    beforeEach(() => {
        rootNode = document.createElement('div');
        rootNode.className = ROOT_NODE_CLASS_NAME;
        document.body.appendChild(rootNode);
    });

    afterEach(() => {
        if (rootNode) {
            document.body.removeChild(rootNode);
            rootNode = undefined;
        }
    });

    describe('instantiation ->', () => {
        it('should generate the expected DOM', () => {

            ReactDOM.render(<BrowserRouter><Navigation items={NAVIGATION_ITEMS_MODEL.items}/></BrowserRouter>, rootNode);

            let navigationElement = rootNode.querySelector('.nav-container');

            expect(navigationElement).to.exist;
            expect(navigationElement.querySelector('.nav-item[href="' + HOME_URL + '"]')).to.exist;
            expect(navigationElement.querySelector('.nav-item[href="' + ABOUT_URL + '"]')).to.exist;
            expect(navigationElement.querySelector('.nav-item[href="' + PRODUCTS_URL + '"]')).to.exist;
            expect(navigationElement.querySelector('.nav-item[href="' + PRODUCT_1_URL + '"]')).to.exist;
            expect(navigationElement.querySelector('.nav-item[href="' + PRODUCT_2_URL + '"]')).to.exist;
        });
    });
});
