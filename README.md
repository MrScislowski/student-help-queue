backend (https://fullstackopen.com/en/part9/typing_an_express_app)
pnpm init
pnpm install typescript --save-dev
// add tsc to package.json
npm run tsc -- --init # generate tsconfig
npm install express
npm install --save-dev eslint @types/express @typescript-eslint/eslint-plugin @typescript-eslint/parser ts-node-dev

"scripts": {
"tsc": "tsc",
"dev": "ts-node-dev index.ts",
"lint": "eslint --ext .ts .",
"start": "node build/index.js"
...
}
