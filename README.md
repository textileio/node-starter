# Textile + Node Starter Project

This is a simple shell of a project using Node.js, Express, and Pug. It was originally based on the [TypeScript-Node-Starter project](https://github.com/microsoft/TypeScript-Node-Starter), then simplified, updated, and cleaned up a bit.

## Setup

### Install

```
npm install
```

### Configure

You need to get OAuth app credentials for [Twitter](https://developer.twitter.com/en/docs/accounts-and-users/subscribe-account-activity/guides/authenticating-users), [Google](https://developers.google.com/identity/protocols/oauth2), and [GitHub](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/).

Be sure when setting up each of these apps in the services that you set the correct callback url. For deveopment, those will be:

* Twitter -- `http://localhost:3000/auth/twitter/callback`
* GitHub -- `http://localhost:3000/auth/github/callback`
* Google -- `http://localhost:3000/auth/google/callback`

Copy the template `.env` file found in `.env.example` to `.env`. **NEVER SHARE OR PUBLISH THIS FILE**.

```bash
cp .env.example .env
```

Replace each of the credentials for Twitter, Google, and GitHub that you setup above. If you prefer to remove any of these methods, you can remove them from the login options in `views/partials/header.pug`.

## Build

```
npm run build
```

## Watch

```
npm run watch
```

## Start

```
npm run start
```

# License
Copyright (c) Textile. All rights reserved.
Licensed under the [MIT](LICENSE.txt) License.
