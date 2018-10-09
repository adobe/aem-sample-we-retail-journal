
## Running the development server
```
npm run start
```
This will open the local dev server on port 9000. You can navigate then to http://localhost:9000/content/we-retail-journal/react/home.html

### GOTCHA's - you should read this

#### Your requests to AEM are failing
Most probably this is due to CORS rejection, so you might want to either config AEM to accept CORS or bypass it from the browser if you are doing local development.  
**Also** make sure you login in AEM instance in the same browser.

#### Your images don't show up
Most probably the images are having relative paths, and because we are not on AEM they won't exist on this server.
Quick fix would be to force the AEM absolute path on the images from the image component

## Running the local NODE.js Server Side Rendering
In order to get the server side rendering to work run the following commands
```
npm run build
```
then 
```
API_HOST=http://localhost:4502 npm run start:server
```
This will open a server on port 4200 so you can navigate to http://localhost:4200/content/we-retail-journal/react/home.html to see the running example

## Enabling the Server-Side Rendering using the AEM page component
In order to have a page component rendered Server-Side via AEM and the page component HTL template, 
navigate to the page component [0] and modify the template to request the _GetPreRenderedPageBody_ service to fetch the SPA HTML content from a remote node server. 
In the current sample project, the node server runs locally via the `npm run start:server` command line.

### SSR Setup

0. Modify the page component HTL template [a,b]
1. Start the local NODE.js server [c]
2. Request the page from your browser
3. Using a web browser, navigate to one of the pages of the app

a. Location of the page component HTL body template
```
../content/jcr_root/apps/we-retail-journal/react/components/structure/page/body.html
```

b. Expected content of the page component HTL body template
```
<div id="page">
    <sly data-sly-resource="${resource @ resourceType='cq/spa/ssr'}" />
</div>
```

c. Command to start the local node server
```
API_HOST=http://localhost:4502 npm run start:server
```

### Configuring the _GetPreRenderedPageBody_ service

1. Navigate to http://localhost:4502/system/console/configMgr
2. Search for the configuration called _Single Page Applications - Server Side Rendering Configuration_
3. Open the dialog and update the default values

### GOTCHA's - you should read this

For now we need to overcome some technical difficulties in order to get the server actually working.

#### Authorize your requests
If you see that your requests are failing most probably the requests are not authorized.  
You should modify the `PageModelManager#fetchModel` method to add the `Authorization` header:
[here](https://www.npmjs.com/package/@adobe/cq-spa-page-model-manager)
you should add the following header:
```
xhr.setRequestHeader('Authorization', 'Basic YWRtaW46YWRtaW4=');
```

#### Your client side code routing is failing
Most probably this is due to CORS rejection, so you might want to either config AEM to accept CORS or bypass it from the browser if you are doing local development.

#### Your images don't show up
Most probably the images are having relative paths, and because we are not on AEM they won't exist on this server.  
Quick fix would be to force the AEM absolute path on the images from the image component
