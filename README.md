# Socialblade.com unofficial APIs
[![](https://github.com/davideviolante/socialblade-com-api/workflows/Node.js%20CI/badge.svg)](https://github.com/DavideViolante/socialblade-com-api/actions?query=workflow%3A"Node.js+CI") [![Maintainability](https://api.codeclimate.com/v1/badges/5cf562601140598e1f8a/maintainability)](https://codeclimate.com/github/DavideViolante/socialblade-com-api/maintainability) [![Donate](https://img.shields.io/badge/paypal-donate-179BD7.svg)](https://www.paypal.me/dviolante)

Unofficial APIs for Socialblade.com website. The `socialblade` function returns the last 30 days data of a username for a particular source. See example below.

### Install
`npm i socialblade-com-api`

### Params of `socialblade` function
1. `source`: [one of the followings](https://github.com/DavideViolante/socialblade-com-api/blob/master/functions.js#L4).
2. `username`: account username on the specified source.
3. `cookie`: required param if `source` is `instagram`. You need to sign up for a free account to socialblade.com, then get the value of `PHPSESSXX` Cookie from Chrome console (F12) > Application > Cookies.

### Example
```js
const { socialblade } = require('socialblade-com-api')

async function main () {
  try {
    const response1 = await socialblade('twitter', 'barackobama')
    const response2 = await socialblade('instagram', 'barackobama', '<your_socialblade_phpsessxx_cookie>')
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
