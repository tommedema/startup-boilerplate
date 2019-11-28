# Design choices

## 1. Monorepo design
To achieve modularity and the ability to encapsulate technical debt without the unnecessary overhead of administering hundreds of separate repositories.

- Lerna
- Yarn Workspaces
- Typescript Composite Project References

## 2. Type safety
To catch errors before they happen in runtime, largely avoid a need for manual technical documentation, and to allow for rapid refactoring.

- Typescript

## 3. 100% Serverless
To save headspace and manpower on sysops, allow for horizontal scaling, and to encourage a modular and event driven technical landscape.

- Serverless Framework
- AWS Lambda
- Cloudformation
- DynamoDB
- Netlify
- Auth0

## 4. Adopt community favorites
To improve the developer experience and go with smart but proven technologies.

- React: view layer
- Redux: application state management
- Parcel: low-config package bundler

## 5. Buy > build
To focus on the core product and ship faster.

- Netlify: instant edge network and content delivery, continuous deployment, SSL
- Auth0: identity resolution and management, login/logout frontends, SSO, and a simpler path towards 2FA
- CircleCI: continuous integration and deployment without the hassle of setting up a Jenkins server

## 6. Standardized code styling and automated linting
To avoid fruitless discussions re formatting and save time during code reviews.

- Prettier
- Husky
- Lint-staged