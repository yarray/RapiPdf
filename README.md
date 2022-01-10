<img alt="MrinDoc logo" src="https://github.com/mrin9/RapiPdf/blob/master/logo.png" width="60px" />


<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square"/>
    <img src="https://img.shields.io/github/size/mrin9/rapipdf/dist/rapipdf-min.js.svg?colorB=blue&label=minified&style=flat-square">
    <img src="https://img.shields.io/github/size/mrin9/rapipdf/dist/rapipdf-min.js.gz.svg?colorB=blue&label=zip&style=flat-square">
</p>

# RapiPDF

Custom element for Open-API to PDF generation

This is a fork from https://mrin9.github.io/RapiPdf, replacing font with
SourceHanSans and SourceHanMono for Chinese, and add a cli to generate pdf for
better automation.

The repository is not marked as a fork in github since I migrate some
font-related files to lfs which rewrites the history.

## Features
- Supports Swagger 2.0 and OpenAPI 3.0
- Generate PDF using Web-Component
- Generate PDF with commandline
- Works with any framework or with no framework
- Plenty of customizing options, including selection of brand colors
- Supported on Chrome, FireFox and Safari. (Not yet tested on Edge)

## Documentation

### Web-based usage
[Check out the usage and examples](https://mrin9.github.io/RapiPdf/)

### Commandline usage
`node dist/rapipdf-cli.js -i ~/projects/higis/api-core/dist/hipo.yml -o ~/Downloads/hipo.pdf`

## Build Process
We recommend `yarn` over `npm` as we use yarn [resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) to keep the bundle size smaller. As of this writing this feature is not supported in npm natively
```bash
# Clone / Download the project then
yarn install

# build will generate rapipdf-min.js and rapipdf-cli.js 
# rapipdf-min.js: use it in the script tag of your html <script type="text/javascript" src="rapidoc-min.js"></script></body>
# rapipdf-cli.js: use it with commandline
# You may need to run `NODE_OPTIONS="--max-old-space-size=8192" yarn build` in case there's an insufficient-memory error
yarn build

# for developement use yarn serve (this will start an webserver at port 8080, then navigate to localhost:8080)
yarn serve

# alternative to yarn serve: (this will start an webserver at port 8080 listening to all adapters)
yarn serve-everyone
```