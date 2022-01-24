import createPdf from '@/pdf-gen';

import { program } from 'commander';
import { JSDOM } from 'jsdom';
import { fontStringify } from 'pdfmake/src/helpers';
var { window } = new JSDOM("");
import fs from 'fs';
import YAML from 'yaml';

function genPdf(spec, options) {
  options.localize = {
    index: 'INDEX',
    api: 'API',
    apiList: 'API List',
    apiReference: 'API Reference',
    apiVersion: 'API Version',
    contact: 'CONTACT',
    name: 'NAME',
    email: 'EMAIL',
    url: 'URL',
    termsOfService: 'Terms of service',
    securityAndAuthentication: 'Security and Authentication',
    securitySchemes: 'SECURITY SCHEMES',
    key: 'KEY',
    type: 'TYPE',
    example: 'EXAMPLE',
    description: 'DESCRIPTION',
    request: 'REQUEST',
    requestBody: 'REQUEST BODY',
    response: 'RESPONSE',
    responseModel: 'RESPONSE MODEL',
    statusCode: 'STATUS CODE',
    deprecated: 'DEPRECATED',
    allowed: 'ALLOWED',
    default: 'DEFAULT',
    readOnly: 'READ ONLY',
    writeOnly: 'WRITE ONLY',
    enumValues: 'ENUM',
    pattern: 'PATTERN',
    parameters: 'Parameters',
    noRequestParameters: 'No request parameters',
    method: 'METHOD',
  };

  options.pdfTagOrder = options.pdfTagOrder
    ? options.pdfTagOrder.split(',')
    : [];
  options.pdfTitle |= 'API Reference';
  options.pdfCoverText |= '';
  options.pdfSecurityText |= '';
  options.pdfApiText |= '';
  options.pdfSchemaStyle = options.pdfSchemaStyle === 'table' ? 'table' : 'object';
  options.pdfFooterText |= '';
  options.includeInfo = options.includeInfo !== 'false';
  options.includeToc = options.includeToc !== 'false';
  options.includeSecurity = options.includeSecurity !== 'false';
  options.includeApiDetails = options.includeApiDetails !== 'false';
  options.autoTagIndex = options.autoTagIndex ? parseInt(options.autoTagIndex, 10): 0;
  options.window = window;

  createPdf(spec, options);
}
const flags = {
  pdfTagOrder: 'string',
  pdfSortTags: 'boolean',
  pdfPrimaryColor: 'string',
  pdfAlternateColor: 'string',
  autoTagIndex: 'integer',
  pdfTitle: 'string',
  pdfCoverText: 'string',
  pdfSecurityText: 'string',
  pdfApiText: 'string',
  pdfSchemaStyle: 'string',
  pdfFooterText: 'string',
  includeInfo: 'boolean',
  includeToc: 'boolean',
  includeSecurity: 'boolean',
  includeExample: 'boolean',
  includeApiDetails: 'boolean',
  includeApiList: 'boolean',
};

let parser = program;
parser.requiredOption('-i, --input <url>', 'must provide input');
parser.requiredOption('-o, --output <path>', 'must provide output');
for (let key in flags) {
  parser = parser.option(`--${key} <${key}>`);
}
parser.parse();
const yml = fs.readFileSync(parser.opts().input, {encoding: 'utf8'});
const spec = YAML.parse(yml);
genPdf(spec, parser.opts());
