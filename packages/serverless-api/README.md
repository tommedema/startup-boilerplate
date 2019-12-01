# Manual testing

You can manually test endpoints with OAuth 2.0 authentication using [Postman](https://www.getpostman.com/). Follow the instructions at [Auth0](https://auth0.com/blog/manage-a-collection-of-secure-api-endpoints-with-postman/) to set it up with authorization. Note that instead of using the Authorization Code grant type, it is recommended to use the Implicit Grant type without a client secret, as this more closely mimicks the workings of an actual single page application such as a React.js app.

# Packaging

This implementation is using serverless-plugin-scripts to build a deployment artifact/package with Parcel prior to any serverless packaging event. To minimize the lambda artifact even depended upon node_modules are included in the Parcel packaging process. This also ensures that you can depend on the latest aws-sdk (rather than an outdated version on the lambda runtime).

This process should be robust but if issues are experiened you may want to consider an alternative such as [serverless-plugin-parcel](https://github.com/threadheap/serverless-plugin-parcel). You may experience issues with the current implementation if your node_modules are not understood by Parcel, e.g. because they depend on bundled binaries.