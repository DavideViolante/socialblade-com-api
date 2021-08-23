# Socialblade.com unofficial APIs
[![](https://github.com/davideviolante/socialblade-com-api/workflows/Node.js%20CI/badge.svg)](https://github.com/DavideViolante/socialblade-com-api/actions?query=workflow%3A"Node.js+CI") [![Maintainability](https://api.codeclimate.com/v1/badges/5cf562601140598e1f8a/maintainability)](https://codeclimate.com/github/DavideViolante/socialblade-com-api/maintainability) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante)

Unofficial APIs for Socialblade.com website. The `socialblade` function returns the last 30 days data of a username for a particular source. See example below.

## Note: since 08/2021 this repo is not working anymore. See [#41](https://github.com/DavideViolante/socialblade-com-api/issues/41).

### Install
`npm i socialblade-com-api`

### Params of `socialblade` function
1. `urlprefix`: Socialblade website is protected by Cloudflare, I use Scraperapi.com as prefix to bypass the blocks.
2. `source`: [one of the followings](https://github.com/DavideViolante/socialblade-com-api/blob/master/functions.js#L4).
3. `username`: username on the specified source.

### Example
```js
const { socialblade } = require('socialblade-com-api')

async function main () {
  try {
    const response = await socialblade('http://api.scraperapi.com?api_key=<YOUR_API_KEY>&url=', 'twitter', 'barackobama')
  } catch (err) {
    console.error(err)
  }
}
```

### Example response
```js
{
  table: [
    {
      date: '2020/05/26',
      followersDelta: 5657,
      followers: 117937431,
      followingDelta: -7,
      following: 605960,
      postsDelta: 0,
      posts: 15811
    },
    ...
  ],
  charts: [
    {
      id: 'weekly-followers-gained',
      title: 'Weekly Followers Gained for ...',
      data: [ { date: '2020/05/26', value: 123 }, ... ]
    }
  ]
}
```

### Run tests
- `npm test`

### Run lint
- `npm run lint`

### Bugs and feedbacks
Please open an issue.

### Author
- [Davide Violante](https://github.com/DavideViolante/)
