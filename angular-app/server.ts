(<any>global).fetch = require('node-fetch/lib/index');
const bodyParser = require('body-parser');
// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
// import bodyParser from "body-parser";
import { join } from 'path';
import { CustomModelClient } from './CustomModelClient';
import { ModelManager, ModelClient } from '@adobe/cq-spa-page-model-manager';
import { environment } from './src/environments/environment';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4200;
const DIST_FOLDER = join(process.cwd(), 'dist');
const APP_ROOT_PATH = environment.APP_ROOT_PATH;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get([`${APP_ROOT_PATH}*.html`, '/conf/we-retail-journal/angular/settings/wcm/templates*.html'], (req, res, next) => {
  if (!environment.APP_ROOT_PATH) {
    console.error("You have not set any root path for app. Be sure you set the environment variable APP_ROOT_PATH before running the command");
    process.exit(1);
  }

  if (!environment.API_HOST) {
    console.error("You have not set any api host. Be sure you set the environment variable API_HOST before running the command");
    process.exit(1);
  }

  let pagePath = req.path.replace(/\.html$/, '');

  let modelClient = new CustomModelClient(environment.API_HOST);
  ModelManager.destroy();
  ModelManager.initialize({ path: APP_ROOT_PATH, modelClient }).then((model) => {
    return ModelManager.getData({ path: pagePath }).then(() => {
      res.render('index', { req, document: '<app-root></app-root>' });
    });
  }).catch((error) => {
    next(error);
  });
});

app.post([`${APP_ROOT_PATH}*.html`, '/conf/we-retail-journal/angular/settings/wcm/templates*.html'], (req, res, next) => {
  const pageModelRootPath = req.headers['page-model-root-url'] || APP_ROOT_PATH;
  let model = req.body;
  ModelManager.destroy();
  ModelManager.initialize({ path: pageModelRootPath, model: model }).then(() => {
    res.render('index', { req } );
  }).catch((error) => {
    next(error);
  });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
