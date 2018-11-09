
## Running the development server
```
API_HOST=http://localhost:4502 npm run start
```
This will open the local dev server on port 9000. You can navigate then to `http://localhost:9000/content/we-retail-journal/react/home.html`
where `API_HOST` points to your AEM instance.
### GOTCHA's - you should read this

#### Your requests to AEM are failing
Most probably this is due to CORS rejection, so you might want to either configure AEM to accept CORS or bypass it from the browser if you are doing local development. 
Also assure that your request to the AEM instance is authorized.

#### Authorize your requests
* Instantiate a CustomModelClient such as [src/server/CustomModelClient.js](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/react-app/src/server/CustomModelClient.js) 
when initializing the [ModelManager in src/index.js](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/react-app/src/index.js#L42)
* If necessary adapt the Authorization header in [src/server/CustomModelClient.js](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/react-app/src/server/CustomModelClient.js#L21) 

#### Update the CORS configuration of the AEM instance
1. Navigate to the Configuration Manager on the AEM instance at http://localhost:4502/system/console/configMgr
2. Look for the configuration: Adobe Granite Cross-Origin Resource Sharing Policy
3. Create a new configuration with the following additional values:
    * Allowed Origins: http://localhost:9000
    * Supported Headers: Authorization
    * Allowed Methods: OPTIONS

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

#### Your client side code routing is failing
Most probably this is due to CORS rejection, so you might want to either configure AEM to accept CORS or bypass it from the browser if you are doing local development.

See [Authorize your requests](####authorize-your-requests )
and [Update the CORS configuration of the AEM instance](####update-the-cors-configuration-of-the-AEM-instance)

#### Your images don't show up
Most probably the images are having relative paths, and because we are not on AEM they won't exist on this server.  
Quick fix would be to force the AEM absolute path on the images from the image component
