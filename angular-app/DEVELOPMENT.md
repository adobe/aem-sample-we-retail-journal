## Running the development server

You need to set the API_HOST configuration in [src/environments/environment.ts](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/src/environments/environment.ts#L7) pointing to your AEM instance:

```API_HOST: "http://localhost:4502",```

Then:

```
npm run start
```
This will open the local dev server on port 4200. You can navigate then to http://localhost:4200/content/we-retail-journal/angular/en/home.html

### GOTCHA's - you should read this

#### Your requests to AEM are failing
Most probably this is due to CORS rejection, so you might want to either configure AEM to accept CORS or bypass it from the browser if you are doing local development.  
Also assure that your request to the AEM instance is authorized.

#### Authorize your requests
* Instantiate a CustomModelClient such as [CustomModelClient.js](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/CustomModelClient.js) 
when initializing the [ModelManager in src/app/app.component.ts](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/src/app/app.component.ts#L52)
* If necessary adapt the Authorization header in [CustomModelClient.js](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/CustomModelClient.js#L20) 

#### Update the CORS configuration of the AEM instance
1. Navigate to the Configuration Manager on the AEM instance at http://localhost:4502/system/console/configMgr
2. Look for the configuration: Adobe Granite Cross-Origin Resource Sharing Policy
3. Create a new configuration with the following additional values:
    * Allowed Origins: http://localhost:4200
    * Supported Headers: Authorization
    * Allowed Methods: OPTIONS
    
#### Your images don't show up
Most probably the images are having relative paths, and because we are not on AEM they won't exist on this server.
Quick fix would be to force the AEM absolute path on the images from the image component

## Running the local NODE.js Server Side Rendering.  
First, Set the API_HOST configuration in [src/environments/environment.ts](https://github.com/adobe/aem-sample-we-retail-journal/blob/master/angular-app/src/environments/environment.ts#L7) pointing to your AEM instance:

```API_HOST: "http://localhost:4502",```

Now, In order to get the server side rendering to work run the following commands
```
npm run build:ssr
```
then 
```
npm run serve:ssr
```

This will open a server on port 4200 so you can navigate to http://localhost:4200/content/we-retail-journal/angular/en/home.html to see the running example

### SSR Setup

0. Modify the page component HTL template [a,b]
1. Start the local NODE.js server [c]
2. Request the page from your browser
3. Using a web browser, navigate to one of the pages of the app

a. Location of the page component HTL body template
```
../content/jcr_root/apps/we-retail-journal/angular/components/structure/page/body.html
```

b. Expected content of the page component HTL body template
```
<sly data-sly-resource="${resource @ resourceType='cq/spa/ssr'}" />
```

c. Command to start the local node server
```
npm run serve:ssr
```

### GOTCHA's - you should read this

For now we need to overcome some technical difficulties in order to get the server actually working.

#### Your client side code routing is failing
Most probably this is due to CORS rejection, so you might want to either configure AEM to accept CORS or bypass it from the browser if you are doing local development.

See [Authorize your requests](####authorize-your-requests )
and [Update the CORS configuration of the AEM instance](####update-the-cors-configuration-of-the-AEM-instance)


#### Your images don't show up
Most probably the images are having relative paths, and because we are not on AEM they won't exist on this server.  
Quick fix would be to force the AEM absolute path on the images from the image component
