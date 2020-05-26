# Socialblade.com unofficial APIs
![Node.js CI](https://github.com/DavideViolante/socialblade-com-api/workflows/Node.js%20CI/badge.svg) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante)

### Install
`npm i socialblade-com-api`

### Example
```js
const { socialblade } = require('socialblade-com-api')

async function main () {
  const response = await socialblade('barackobama')
  /**
   * response = 
   * [
   *   {
   *     date: '2020/05/26',
   *     followersDelta: 5657,
   *     followers: 117937431,
   *     followingDelta: -7,
   *     following: 605960,
   *     postsDelta: 0,
   *     posts: 15811
   *   },
   *   ...
   * ]
   */
}
```

### Run tests
- `npm test`

### Run lint
- `npm run lint`

### Author
- [Davide Violante](https://github.com/DavideViolante/)
