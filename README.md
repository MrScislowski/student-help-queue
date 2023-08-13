# backend

https://fullstackopen.com/en/part9/typing_an_express_app

```
pnpm init
pnpm install typescript --save-dev
# add tsc to package.json
npm run tsc -- --init # generate tsconfig
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser ts-node-dev
```

package.json

```
"scripts": {
"tsc": "tsc",
"dev": "ts-node-dev index.ts",
"lint": "eslint --ext .ts .",
"start": "node build/index.js"
...
}
```

.eslintrc

```
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  "plugins": ["@typescript-eslint"],
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "no-case-declarations": "off"
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": "./tsconfig.json"
  }
}
```

DB schema:

```
CURRENT REQUEST:
{
  id,
  requestorId,
  requestorDisplayName,
  requestTimestamp
}

RESOLVED REQUEST:
{
  id,
  requestorId,
  requestorDisplayName,
  requestTimestamp,
  resolverId,
  resolverDisplayName,
  resolveTimestamp,
  resolutionStatus (cancel | resolve),

}
```

Endpoints:
Create

POST /api/queue

Read

GET /api/queue

Update/Delete

POST /api/queue/:id
