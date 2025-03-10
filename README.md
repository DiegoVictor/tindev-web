# [Web] Tindev
[![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/tindev-web?style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/DiegoVictor/tindev-web?branch=main)
[![react](https://img.shields.io/badge/reactjs-16.14.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-4.4.1-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-5.16.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-24.7.1-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/tindev-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/tindev-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/tindev-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

This web version allows users to like or dislike another users and see your previous matches.. All the resources used by this application comes from its [`API`](https://github.com/DiegoVictor/tindev-api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
  * [localStorage](#localstorage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/tindev-web/main/screenshots/login.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/tindev-web/main/screenshots/dashboard.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/tindev-web/main/screenshots/match.png" width="49%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/tindev-web/main/screenshots/matches.png" width="49%"/>

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [API](https://github.com/DiegoVictor/tindev-api) before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url with version (v1)|`http://localhost:3333/v1`

### API
Start the [API](https://github.com/DiegoVictor/tindev-api) (see its README for more information). In case of any change in the API's `port` or `host` remember to update the [`.env`](#env) too.


# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

## localStorage
The project saves user's data into a [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) key: `tindev_user`. Before use this data you need parse the data to a JavaScript object with [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) function. Below you can see fictitious data:
```json
{
  "id": "5fcff2ed42922f8128ab42ce",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibWVzc2FnZSI6IkVhZSwgdHVkbyBibHo_IiwiaWF0IjoxNTE2MjM5MDIyfQ.MgLoxvRXoXeEHv36H4KuUQ3kfVl66uSOzJYll2IsZHE"
}
```

# Running the tests
[Jest](https://jestjs.io) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
