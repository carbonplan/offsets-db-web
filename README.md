<img
  src='https://carbonplan-assets.s3.amazonaws.com/monogram/dark-small.png'
  height='48'
/>

# carbonplan / offsets db web

**tool to explore data from voluntary and compliance offset programs**

[![GitHub][github-badge]][github]
[![Build Status]][actions]
![MIT License][]

[github]: https://github.com/carbonplan/offsets-db-web
[github-badge]: https://badgen.net/badge/-/github?icon=github&label
[build status]: https://github.com/carbonplan/offsets-db-web/actions/workflows/main.yml/badge.svg
[actions]: https://github.com/carbonplan/offsets-db-web/actions/workflows/main.yaml
[mit license]: https://badgen.net/badge/license/MIT/blue

## to build the site locally

Assuming you already have `Node.js` installed, you can install the build dependencies as:

```shell
npm install .
```

If you haven't already configured your target API URL and corresponding API key, you can configure via environment variables by first running

```shell
cp .env.test .env.local
```

and then editing values in your new `.env.local` file.

To start a development version of the site, simply run:

```shell
npm run dev
```

and then visit `http://localhost:5001` in your browser.

## license

All the code in this repository is [MIT](https://choosealicense.com/licenses/mit/) licensed, but we request that you please provide attribution if reusing any of our digital content (graphics, logo, articles, etc.).

> [!IMPORTANT]
> Data associated with this repository are subject to additional [terms of data access](https://github.com/carbonplan/offsets-db-data/blob/main/TERMS_OF_DATA_ACCESS).

## about us

CarbonPlan is a non-profit organization that uses data and science for climate action. We aim to improve the transparency and scientific integrity of climate solutions with open data and tools. Find out more at [carbonplan.org](https://carbonplan.org/) or get in touch by [opening an issue](https://github.com/carbonplan/offsets-db-web/issues/new) or [sending us an email](mailto:hello@carbonplan.org).
