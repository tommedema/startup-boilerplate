# Parcel

This implementation is using serverless-plugin-scripts to simply build with Parcel prior to any serverless packaging event. To minimize the lambda artifact even depended upon node_modules are included in the Parcel packaging process. This also ensures that you can depend on the latest aws-sdk (rather than an outdated version on the lambda runtime).

This process should be robust but if issues are experiened you may want to consider an alternative such as [serverless-plugin-parcel](https://github.com/threadheap/serverless-plugin-parcel).