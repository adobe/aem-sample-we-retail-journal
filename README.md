[![CircleCI](https://circleci.com/gh/adobe/aem-sample-we-retail-journal/tree/master.svg?style=svg)](https://circleci.com/gh/adobe/aem-sample-we-retail-journal/tree/master)

# We.Retail Journal Single Page Applications

Contains We.Retail Journal SPAs for authoring on AEM.

## Branching model
The current repository follows the [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) branching model design.

Go to the [development](../../tree/development) branch to access the latest state of the project.

## Modules

This project contains:

* `content`: Content Structure including /apps components and client libraries as well the /content specific sites and pages. The client library will be generated while building the SPAs.
* `react-app`: We.Retail Journal React application.



## Usage of online fonts

The application is using online Fonts included via Typekit.

You would either need a network connection or have the fonts installed on your computer:
* Proxima Nova Regular
* Bagatela Light

## Build

The project has the following minimal requirements:
* Java SE Development Kit 8 or newer
* Apache Maven 3.3.1 or newer

## Build all modules

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

### Module build order

The `react-app` module builds and transpiles the es6 javascript source code into a browser friendly 2015 version. 
It then creates a client library and copy the built javascript files in the `content` module. 
Run your Maven command lines from the root of the project to respect the module build ordering and ensure the latest version of the `react-app` module is used.   

For ease of build and installation the following profiles are provided:

 * ``autoInstallPackage`` - installs the package/bundle to an existing AEM author instance
 * ``autoInstallPackagePublish`` - installs the package/bundle to an existing AEM publish instance
 * ``autoInstallSinglePackage`` - package all the dependencies into a single content package and install everything to an existing AEM author instance
 * ``autoInstallSinglePackagePublish`` - package all the dependencies into a single content package and install everything to an existing AEM publish instance
 
### UberJar
 
This project relies on the unobfuscated AEM 6.3 cq-quickstart. This is publicly available on https://repo.adobe.com
 
For more details about the UberJar please head over to the
[How to Build AEM Projects using Apache Maven](https://docs.adobe.com/docs/en/aem/6-2/develop/dev-tools/ht-projects-maven.html#What%20is%20the%20UberJar?)
documentation page.
 
### Install everything
 
You can install everything needed to use the components on your running AEM instance by issuing the following command in the top level folder of the project:
 
    mvn clean install -PautoInstallSinglePackage

You can also choose build environment by using setting `build.environment` property (format: colon + name):

    mvn clean install -PautoInstallSinglePackage -Dbuild.environment=":production"

Available environments:

* empty string (default): non-production / development
* `production`: production

### Install local version of NPM sub-modules

You can install local version of the NPM modules `@adobe/cq-spa-page-model-manager` and `@adobe/cq-spa-component-mapping` by changing a few lines in the `react-app` module's POM. By default, the released versions of those modules are transitively installed by `@adobe/cq-react-editable-components` but it is possible to override this and install local development versions instead.

First, build and link the local NPM modules you want to use by running (for instance, in your local checkout of `@adobe/cq-spa-page-model-manager`):
    
    npm run build && npm link
    
Then use the `npmLinkDeps` profile when installing the project's bundles and packages such as:

    mvn clean install -PautoInstallPackage,npmLinkDeps
 
### Individual packages/bundles
 
You can install individual packages/bundles by issuing the following command in the top level folder of the project:
 
    mvn clean install -PautoInstallPackage -pl <project_name(s)> -am
 
Please note that

 * ``-pl/-projects`` option specifies the list of projects that you want to install
 * ``-am/-also-make`` options specifies that dependencies should also be built

 ## Guidelines for SPA development in AEM

Developing single page applications on AEM assumes that the front-end developer observes standard best practices when creating an SPA. If as a front end developer you follow these general best practices as well as few AEM-specific principles, your SPA will be functional with AEM and its content-authoring capabilities.

* *Portability* - As with any components, the components should be built to be as portable as possible. The SPA should be built with portable and reusable components.
* *AEM Drives Site Structure* - The front end developer creates components and owns their internal structure, but relies on AEM to define the content structure of the site.
* *Dynamic Rendering* - All rendering should be dynamic.
* *Dynamic Routing* - The SPA is responsible for the routing and AEM listens to it and fetches based on it. Any routing should be dynamic as well.

If you keep these principles in mind as you develop your SPA, it will be as flexible and as future proof as possible while enabling all supported AEM authoring functionality. 

For further details about SPA development on AEM including guideliens, walkthroughs, best practices and examples, see the [AEM Developer Documentation](https://adobe.com/go/aem-dev-spa).
