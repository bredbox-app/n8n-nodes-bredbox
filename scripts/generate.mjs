#!/usr/bin/env node

/**
 * OpenAPI → n8n Community Node Generator
 *
 * Downloads the Bredbox OpenAPI spec and generates:
 *  - nodes/Bredbox/Bredbox.node.ts
 *  - nodes/Bredbox/Bredbox.node.json
 *  - credentials/BredboxApi.credentials.ts
 *  - nodes/Bredbox/resources/<resource>/index.ts   (per tag group)
 *  - nodes/Bredbox/resources/<resource>/<op>.ts    (per operation with body params)
 *
 * Usage:
 *   node scripts/generate.mjs                        # downloads live spec
 *   node scripts/generate.mjs --local openapi.json   # uses local file
 *   node scripts/generate.mjs --help
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { styleText } from 'node:util';

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const SPEC_URL = 'https://api.bredbox.app/v2/openapi.json';
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

/** Map OpenAPI tag (plural) → resource folder name / n8n resource value */
const TAG_TO_RESOURCE = {
  Saves:          'save',
  Highlights:     'highlight',
  Imports:        'import',
  Exports:        'export',
  Tags:           'tag',
  Collections:    'collection',
  Me:             'me',
  Tokens:         'token',
  Webhooks:       'webhook',
  Applications:   'authorization',
};

/** Singular variants that may appear inside operationId */
const TAG_SINGULAR = {
  Saves: 'Save',
  Highlights: 'Highlight',
  Imports: 'Import',
  Exports: 'Export',
  Tags: 'Tag',
  Collections: 'Collection',
  Me: 'Me',
  Tokens: 'Token',
  Webhooks: 'Webhook',
  Applications: 'Application',
};

/**
 * Map the "action suffix" extracted from an operationId to [value, displayName].
 * "value" is used as the n8n operation value (camelCase).
 * "displayName" is the human-readable label shown in the n8n dropdown.
 */
const ACTION_MAP = {
  List:               ['getAll',      'Get Many'],
  Create:             ['create',      'Create'],
  Search:             ['search',      'Search'],
  Get:                ['get',         'Get'],
  Update:             ['update',      'Update'],
  Delete:             ['delete',      'Delete'],
  Content:            ['getContent',  'Get Content'],
  TagsList:           ['getTags',     'Get Tags'],
  TagsSet:            ['setTags',     'Set Tags'],
  ItemsList:          ['getItems',    'Get Items'],
  Scopes:             ['getScopes',   'Get Scopes'],
  Regenerate:         ['regenerate',  'Regenerate'],
  Events:             ['getEvents',   'Get Events'],
  Download:           ['download',    'Download'],
  Saves:              ['getSaves',    'Get Saves'],
  DataDelete:         ['clearData',   'Clear Data'],
  PrivacyConfirm:     ['confirmPrivacy', 'Confirm Privacy Action'],
  JobStatus:          ['getJob',      'Get Job'],
};

/**
 * For actions that embed a "sub-resource" prefix before the tag
 * (e.g. post_AddCollectionItem → prefix=Add, tag=Collection, suffix=Item).
 */
const SUB_RESOURCE_PREFIX_MAP = {
  Add:    ['addItem',     'Add Item'],
  Get:    ['getItem',     'Get Item'],
  Update: ['updateItem',  'Update Item'],
  Delete: ['deleteItem',  'Delete Item'],
};

/**
 * Per-operation overrides.
 * Key: operationId
 * Value: [value, displayName]
 */
const OPERATION_OVERRIDES = {
  get_MeGet:               ['getProfile',    'Get Profile'],
  delete_MeDelete:         ['deleteAccount', 'Delete Account'],
};

/**
 * Resource display names shown in the Resource dropdown.
 */
const RESOURCE_DISPLAY_NAMES = {
  authorization:  'Authorization',
  collection:     'Collection',
  export:         'Export',
  highlight:      'Highlight',
  import:         'Import',
  me:             'Me',
  save:           'Save',
  tag:            'Tag',
  token:          'Token',
  webhook:        'Webhook',
};

/** Map resource name → filesystem directory name */
const RESOURCE_DIRS = {
  save:           'saves',
  highlight:      'highlights',
  import:         'imports',
  export:         'exports',
  tag:            'tags',
  collection:     'collections',
  me:             'me',
  token:          'tokens',
  webhook:        'webhooks',
  authorization:  'authorizations',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

/** Convert an OpenAPI schema type to an n8n property type string */
function schemaToN8nType(schema) {
  if (!schema) return 'string';
  if (schema.enum) return 'options';
  if (schema.type === 'boolean') return 'boolean';
  if (schema.type === 'number' || schema.type === 'integer') return 'number';
  if (schema.type === 'array') {
    // If items are strings, use string type with multipleValues
    if (schema.items?.type === 'string') return 'string';
    return 'json';
  }
  if (schema.type === 'object') return 'json';
  return 'string';
}

/** Convert a field name to a human-readable display name */
function humanize(name) {
  return name
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((w) => {
      if (w.toLowerCase() === 'id') return 'ID';
      if (w.toLowerCase() === 'url') return 'URL';
      if (w.toLowerCase() === 'html') return 'HTML';
      if (w.toLowerCase() === 'api') return 'API';
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Best-effort description from a schema or parameter */
function bestDescription(param) {
  return param.description || param.summary || '';
}

/** Escape a string for use inside a single-quoted JS/TS string literal */
function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Indent a block of text by `n` spaces */
function indent(text, n = 1) {
  const pad = '\t'.repeat(n);
  return text
    .split('\n')
    .map((l) => (l.trim() === '' ? '' : pad + l))
    .join('\n');
}

/** Make a valid TypeScript identifier (camelCase) from a string */
function camelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9_]/g, '_')
    .split(/[_\s]+/)
    .map((w, i) =>
      i === 0
        ? w.charAt(0).toLowerCase() + w.slice(1)
        : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join('');
}

/** Capitalize the first letter */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── OPERATION-ID PARSER ─────────────────────────────────────────────────────

/**
 * Parse an operationId like "get_SavesList" or "post_AddCollectionItem" into:
 *   { method, tag, resource, actionSuffix, prefix, value, displayName }
 */
function parseOperationId(operationId, method) {
  // Check overrides first
  if (OPERATION_OVERRIDES[operationId]) {
    const [value, displayName] = OPERATION_OVERRIDES[operationId];
    // Still need to find tag for resource grouping
    for (const [pluralTag, singularTag] of Object.entries(TAG_SINGULAR)) {
      if (operationId.includes(singularTag) || operationId.includes(pluralTag)) {
        return {
          method: method.toUpperCase(),
          tag: pluralTag,
          resource: TAG_TO_RESOURCE[pluralTag],
          actionSuffix: null,
          prefix: null,
          value,
          displayName,
        };
      }
    }
    return { method: method.toUpperCase(), tag: null, resource: null, actionSuffix: null, prefix: null, value, displayName };
  }

  // Try matching sub-resource pattern: {method}_{Prefix}{Tag}{Suffix}
  // e.g. post_AddCollectionItem → prefix=Add, tag=Collection, suffix=Item
  for (const [pluralTag, singularTag] of Object.entries(TAG_SINGULAR)) {
    for (const [prefix, [prefVal, prefName]] of Object.entries(SUB_RESOURCE_PREFIX_MAP)) {
      // Check if operationId contains prefix+singularTag
      const pattern = prefix + singularTag;
      if (operationId.includes(pattern)) {
        const idx = operationId.indexOf(pattern);
        const suffix = operationId.slice(idx + pattern.length); // remaining after "AddCollection"
        // Sub-resource operations: use the mapped value (e.g. Add → addItem)
        return {
          method: method.toUpperCase(),
          tag: pluralTag,
          resource: TAG_TO_RESOURCE[pluralTag],
          actionSuffix: suffix || null,
          prefix,
          value: prefVal,
          displayName: prefName,
        };
      }
    }
  }

  // Try matching regular pattern: {method}_{Tag}{ActionSuffix}
  for (const [pluralTag, singularTag] of Object.entries(TAG_SINGULAR)) {
    // Check plural first (e.g. "Saves"), then singular (e.g. "Save")
    for (const tagForm of [pluralTag, singularTag]) {
      const idx = operationId.indexOf(tagForm);
      if (idx >= 0) {
        const suffix = operationId.slice(idx + tagForm.length);
        if (suffix && ACTION_MAP[suffix]) {
          const [value, displayName] = ACTION_MAP[suffix];
          return {
            method: method.toUpperCase(),
            tag: pluralTag,
            resource: TAG_TO_RESOURCE[pluralTag],
            actionSuffix: suffix,
            prefix: null,
            value,
            displayName,
          };
        }
        if (suffix) {
          // Unknown suffix – create a reasonable name
          const val = camelCase(method.toLowerCase() + suffix);
          return {
            method: method.toUpperCase(),
            tag: pluralTag,
            resource: TAG_TO_RESOURCE[pluralTag],
            actionSuffix: suffix,
            prefix: null,
            value: val,
            displayName: suffix.replace(/([A-Z])/g, ' $1').trim(),
          };
        }
      }
    }
  }

  // Fallback: use the full operationId
  return {
    method: method.toUpperCase(),
    tag: null,
    resource: null,
    actionSuffix: null,
    prefix: null,
    value: camelCase(operationId),
    displayName: operationId,
  };
}

// ─── CODE GENERATORS ──────────────────────────────────────────────────────────

/**
 * Generate a single n8n property object (for a path param or query param).
 */
function generatePropertyField(param, propName, n8nType, required, showConditions, description, extra = {}) {
  const lines = [];
  lines.push('{');
  if (description) {
    lines.push(`\tdisplayName: '${esc(description)}',`);
  } else {
    lines.push(`\tdisplayName: '${esc(capitalize(propName.replace(/_/g, ' ')))}',`);
  }
  lines.push(`\tname: '${esc(propName)}',`);
  lines.push(`\ttype: '${n8nType}',`);
  if (required) {
    lines.push('\trequired: true,');
  }
  // default value
  if (n8nType === 'boolean') {
    lines.push('\tdefault: false,');
  } else if (n8nType === 'number') {
    lines.push(`\tdefault: ${param.schema?.default ?? 0},`);
  } else if (n8nType === 'options' && param.schema?.default) {
    lines.push(`\tdefault: '${esc(String(param.schema.default))}',`);
  } else if (n8nType === 'string' && param.schema?.default !== undefined) {
    lines.push(`\tdefault: '${esc(String(param.schema.default))}',`);
  } else if (n8nType === 'string') {
    lines.push("\tdefault: '',");
  } else if (n8nType === 'json') {
    lines.push('\tdefault: {},');
  }

  // displayOptions
  if (showConditions && showConditions.length > 0) {
    lines.push('\tdisplayOptions: {');
    lines.push('\t\tshow: {');
    for (const cond of showConditions) {
      lines.push(`\t\t\t${cond},`);
    }
    lines.push('\t\t},');
    lines.push('\t},');
  }

  // description for the field itself
  const fieldDesc = param.description || '';
  if (fieldDesc && fieldDesc !== description) {
    lines.push(`\tdescription: '${esc(fieldDesc)}',`);
  }

  // options
  if (n8nType === 'options' && param.schema?.enum) {
    lines.push('\toptions: [');
    for (const val of param.schema.enum) {
      lines.push(`\t\t{ name: '${esc(capitalize(String(val)))}', value: '${esc(String(val))}' },`);
    }
    lines.push('\t],');
  }

  // routing (for query params)
  if (extra.routing) {
    lines.push('\trouting: {');
    lines.push(`\t\tsend: { type: '${extra.routing}', property: '${esc(propName)}' },`);
    lines.push('\t},');
  }

  // typeOptions
  if (extra.typeOptions) {
    lines.push('\ttypeOptions: {');
    for (const [k, v] of Object.entries(extra.typeOptions)) {
      if (typeof v === 'boolean') {
        lines.push(`\t\t${k}: ${v},`);
      } else {
        lines.push(`\t\t${k}: '${esc(String(v))}',`);
      }
    }
    lines.push('\t},');
  }

  lines.push('},');
  return lines.join('\n');
}

/**
 * Check if a response schema has an `items` array property (for rootProperty postReceive).
 */
function responseHasItems(op) {
  try {
    const schema =
      op.responses?.['200']?.content?.['application/json']?.schema ||
      op.responses?.['201']?.content?.['application/json']?.schema;
    if (schema?.properties?.items?.type === 'array') return true;
  } catch {}
  return false;
}

/**
 * Generate the operation option object for the index.ts operation dropdown.
 */
function generateOperationOption(parsed, op, pathStr) {
  const { value, displayName, method } = parsed;
  const summary = op.summary || displayName;
  const description = op.description || summary;

  // Build the routing URL
  let urlPath = pathStr.replace(/\{([^}]+)\}/g, (_, name) => `{{$parameter.${name}}}`);
  // If the URL contains parameters, use expression mode
  const hasParams = /\{\{/.test(urlPath);
  const url = hasParams ? `=${urlPath}` : urlPath;

  const lines = [];
  lines.push('{');
  lines.push(`\tname: '${esc(displayName)}',`);
  lines.push(`\tvalue: '${esc(value)}',`);
  lines.push(`\taction: '${esc(summary)}',`);
  lines.push(`\tdescription: '${esc(description)}',`);
  lines.push('\trouting: {');
  lines.push('\t\trequest: {');
  lines.push(`\t\t\tmethod: '${method}',`);
  lines.push(`\t\t\turl: '${esc(url)}',`);

  // Special encoding for download endpoints
  if (value === 'download') {
    lines.push("\t\t\tencoding: 'arraybuffer',");
  }

  // Special Accept header for content endpoint
  if (value === 'getContent') {
    lines.push('\t\t\theaders: {');
    lines.push("\t\t\t\tAccept: 'text/plain',");
    lines.push('\t\t\t},');
  }

  lines.push('\t\t},');

  // If response has items, add postReceive for rootProperty
  if (responseHasItems(op)) {
    lines.push('\t\toutput: {');
    lines.push('\t\t\tpostReceive: [');
    lines.push('\t\t\t\t{');
    lines.push('\t\t\t\t\ttype: \'rootProperty\',');
    lines.push('\t\t\t\t\tproperties: {');
    lines.push("\t\t\t\t\t\tproperty: 'items',");
    lines.push('\t\t\t\t\t},');
    lines.push('\t\t\t\t},');
    lines.push('\t\t\t],');
    lines.push('\t\t},');
  }

  lines.push('\t},');
  lines.push('},');
  return lines.join('\n');
}

/**
 * Generate pagination fields (returnAll + Limit) for a list endpoint.
 */
function generatePaginationFields(resource, opValue, pageSize) {
  const show = (extra = '') => [
    `resource: ['${resource}']`,
    `operation: ['${opValue}']${extra}`,
  ];

  const fields = [];

  // returnAll
  fields.push(`{
\tdisplayName: 'Return All',
\tname: 'returnAll',
\ttype: 'boolean',
\tdefault: false,
\tdisplayOptions: {
\t\tshow: {
\t\t\tresource: ['${resource}'],
\t\t\toperation: ['${opValue}'],
\t\t},
\t},
\tdescription: 'Whether to return all results or only up to a given limit',
\trouting: {
\t\tsend: {
\t\t\tpaginate: '={{ $value }}',
\t\t},
\t\toperations: {
\t\t\tpagination: {
\t\t\t\ttype: 'offset',
\t\t\t\tproperties: {
\t\t\t\t\tlimitParameter: 'per_page',
\t\t\t\t\toffsetParameter: 'page',
\t\t\t\t\tpageSize: ${pageSize},
\t\t\t\t\ttype: 'query',
\t\t\t\t},
\t\t\t},
\t\t},
\t},
},`);

  // Limit
  fields.push(`{
\tdisplayName: 'Limit',
\tname: 'limit',
\ttype: 'number',
\tdefault: ${pageSize},
\tdisplayOptions: {
\t\tshow: {
\t\t\tresource: ['${resource}'],
\t\t\toperation: ['${opValue}'],
\t\t},
\t},
\tdescription: 'Max number of results to return',
\ttypeOptions: {
\t\tminValue: 1,
\t},
\trouting: {
\t\tsend: {
\t\t\ttype: 'query',
\t\t\tproperty: 'per_page',
\t\t},
\t},
},`);

  return fields.join('\n');
}

// ─── FILE WRITERS ─────────────────────────────────────────────────────────────

function writeIfChanged(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  let existing = '';
  try { existing = readFileSync(filePath, 'utf8'); } catch {}
  if (existing === content) {
    console.log(`  ${styleText('dim', 'unchanged')} ${relative(ROOT, filePath)}`);
    return;
  }
  writeFileSync(filePath, content, 'utf8');
  console.log(`  ${styleText('green', 'wrote')}   ${relative(ROOT, filePath)}`);
}

// ─── MAIN GENERATOR ───────────────────────────────────────────────────────────

function generate(spec) {
  // ── 1. Group endpoints by resource ──────────────────────────────────────

  const resourceGroups = {}; // { resource -> [ { path, method, op, parsed } ] }

  for (const [pathStr, methods] of Object.entries(spec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      const tags = op.tags || [];
      let resource = null;
      let tag = null;

      for (const t of tags) {
        if (TAG_TO_RESOURCE[t]) {
          resource = TAG_TO_RESOURCE[t];
          tag = t;
          break;
        }
      }

      if (!resource) continue;

      const parsed = parseOperationId(op.operationId, method);
      parsed.resource = parsed.resource || resource;
      parsed.tag = parsed.tag || tag;

      if (!resourceGroups[resource]) {
        resourceGroups[resource] = [];
      }
      resourceGroups[resource].push({ path: pathStr, method: method.toUpperCase(), op, parsed });
    }
  }

  // ── 2. Ensure deterministic ordering ────────────────────────────────────

  for (const [res, ops] of Object.entries(resourceGroups)) {
    // Sort: GET list first, then POST create, then GET single, then PATCH, then DELETE
    const order = { GET: 1, POST: 2, PATCH: 3, PUT: 4, DELETE: 5 };
    ops.sort((a, b) => {
      const oa = order[a.method] || 9;
      const ob = order[b.method] || 9;
      if (oa !== ob) return oa - ob;
      return a.path.localeCompare(b.path);
    });
  }

  // ── 3. Generate resource files ──────────────────────────────────────────

  for (const [resource, endpoints] of Object.entries(resourceGroups)) {
    const dirName = RESOURCE_DIRS[resource] || resource + 's';
    const resourceDir = join(ROOT, 'nodes', 'Bredbox', 'resources', dirName);
    mkdirSync(resourceDir, { recursive: true });

    // Collect all parameter fields and operation options
    const operationOptions = [];
    const sharedParamFields = [];   // path params like saveId
    const paginationFields = [];    // returnAll / limit for list endpoints
    const bodyOpFiles = [];         // [opValue, content] – operations that need separate files

    // Track which path params are used by which operations
    const pathParamOps = {}; // { paramName -> [opValues] }

    for (const { path: pathStr, method, op, parsed } of endpoints) {
      const opValue = parsed.value;

      // Generate operation option
      operationOptions.push(generateOperationOption(parsed, op, pathStr));

      // Path parameters
      const pathParams = (op.parameters || []).filter((p) => p.in === 'path');
      for (const pp of pathParams) {
        if (!pathParamOps[pp.name]) {
          pathParamOps[pp.name] = new Set();
        }
        pathParamOps[pp.name].add(opValue);
      }

      // Query parameters (excluding pagination params handled generically)
      const isListOp = opValue === 'getAll' || opValue === 'search' || opValue === 'getItems' ||
        opValue === 'getSaves' || opValue === 'getTags' || opValue === 'getEvents';

      // Add pagination for list endpoints
      if (isListOp) {
        const defaultPerPage = (op.parameters || []).find(p => p.name === 'per_page');
        const pageSize = defaultPerPage?.schema?.default ?? 30;
        paginationFields.push(generatePaginationFields(resource, opValue, pageSize));
      }

      // Body parameters
      const bodyParams = [];
      if (op.requestBody?.content?.['application/json']?.schema?.properties) {
        const schema = op.requestBody.content['application/json'].schema;
        const required = schema.required || [];
        for (const [name, propSchema] of Object.entries(schema.properties)) {
          bodyParams.push({ name, schema: propSchema, required: required.includes(name) });
        }
      }

      // Query parameters (excluding pagination: page, per_page)
      const queryParams = [];
      for (const qp of (op.parameters || []).filter(p => p.in === 'query' && p.name !== 'page' && p.name !== 'per_page')) {
        queryParams.push({ name: qp.name, schema: qp.schema || {}, required: qp.required || false, description: qp.description || '' });
      }

      // Generate a separate .ts file if there are body params or non-pagination query params
      if (bodyParams.length > 0 || queryParams.length > 0) {
        const fileContent = generateOpParamFile(resource, opValue, bodyParams, queryParams);
        bodyOpFiles.push([opValue, fileContent]);
      }
    }

    // Generate shared path-param fields
    for (const [paramName, opValuesSet] of Object.entries(pathParamOps)) {
      const opValues = [...opValuesSet];
      const field = generatePathParamField(resource, paramName, opValues);
      sharedParamFields.push(field);
    }

    // Generate the index.ts
    const indexContent = generateResourceIndex(
      resource,
      operationOptions,
      sharedParamFields,
      paginationFields,
      bodyOpFiles,
    );
    writeIfChanged(join(resourceDir, 'index.ts'), indexContent);

    // Write body parameter files
    for (const [opValue, content] of bodyOpFiles) {
      writeIfChanged(join(resourceDir, `${opValue}.ts`), content);
    }
  }

  // ── 4. Generate Bredbox.node.ts ─────────────────────────────────────────

  const nodeTsContent = generateNodeTs(Object.keys(resourceGroups));
  writeIfChanged(join(ROOT, 'nodes', 'Bredbox', 'Bredbox.node.ts'), nodeTsContent);

  // ── 5. Generate Bredbox.node.json ───────────────────────────────────────

  const nodeJsonContent = generateNodeJson();
  writeIfChanged(join(ROOT, 'nodes', 'Bredbox', 'Bredbox.node.json'), nodeJsonContent);

  // ── 6. Generate credentials ─────────────────────────────────────────────

  const credsContent = generateCredentials();
  writeIfChanged(join(ROOT, 'credentials', 'BredboxApi.credentials.ts'), credsContent);
}

// ─── TEMPLATE: Resource index.ts ──────────────────────────────────────────────

function generateResourceIndex(resource, operationOptions, sharedPathFields, paginationFields, bodyOpFiles) {
  const importNames = bodyOpFiles.map(([op]) => `${resource}${capitalize(op)}Description`);
  const importPaths = bodyOpFiles.map(([op]) => `./${op}`);

  const lines = [];
  lines.push("import type { INodeProperties } from 'n8n-workflow';");

  if (importNames.length > 0) {
    for (let i = 0; i < importNames.length; i++) {
      lines.push(`import { ${importNames[i]} } from '${importPaths[i]}';`);
    }
    lines.push('');
  }

  lines.push('');
  lines.push('const showOnlyFor = {');
  lines.push(`\tresource: ['${resource}'],`);
  lines.push('};');
  lines.push('');

  const exportName = `${resource}Description`;
  lines.push(`export const ${exportName}: INodeProperties[] = [`);

  // Operation dropdown
  lines.push('\t{');
  lines.push("\t\tdisplayName: 'Operation',");
  lines.push("\t\tname: 'operation',");
  lines.push("\t\ttype: 'options',");
  lines.push('\t\tnoDataExpression: true,');
  lines.push('\t\tdisplayOptions: {');
  lines.push('\t\t\tshow: showOnlyFor,');
  lines.push('\t\t},');
  lines.push('\t\toptions: [');
  for (const opt of operationOptions) {
    lines.push(indent(opt, 3));
  }
  lines.push('\t\t],');
  // Default to first operation or 'getAll'
  const defaultOp = operationOptions.length > 0
    ? extractOpValue(operationOptions[0])
    : 'getAll';
  lines.push(`\t\tdefault: '${defaultOp}',`);
  lines.push('\t},');

  // Shared path parameter fields
  for (const field of sharedPathFields) {
    lines.push(`\t${field}`);
  }

  // Pagination fields
  for (const field of paginationFields) {
    lines.push(`\t${field}`);
  }

  // Spread body operation descriptions
  for (const [op] of bodyOpFiles) {
    lines.push(`\t...${resource}${capitalize(op)}Description,`);
  }

  lines.push('];');
  lines.push('');

  return lines.join('\n');
}

// ─── TEMPLATE: Operation param file (e.g. saves/create.ts, saves/search.ts) ───

function generateOpParamFile(resource, opValue, bodyParams, queryParams) {
  const exportName = `${resource}${capitalize(opValue)}Description`;
  const lines = [];
  lines.push("import type { INodeProperties } from 'n8n-workflow';");
  lines.push('');
  lines.push('const showOnlyFor = {');
  lines.push(`\toperation: ['${opValue}'],`);
  lines.push(`\tresource: ['${resource}'],`);
  lines.push('};');
  lines.push('');
  lines.push(`export const ${exportName}: INodeProperties[] = [`);

  // Generate query param fields (with query routing)
  for (const { name, schema, required, description } of queryParams) {
    const n8nType = schemaToN8nType(schema);
    const displayName = description || humanize(name);
    const hasExplicitDefault = schema.default !== undefined;

    lines.push('\t{');
    lines.push(`\t\tdisplayName: '${esc(displayName)}',`);
    lines.push(`\t\tname: '${esc(name)}',`);
    lines.push(`\t\ttype: '${n8nType}',`);
    if (required) {
      lines.push('\t\trequired: true,');
    }
    // defaults — always emit (required by INodeProperties), but only
    // add the value expression when no explicit default in the spec.
    if (n8nType === 'boolean') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? schema.default : 'false'},`);
    } else if (n8nType === 'number') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? schema.default : 0},`);
    } else if (n8nType === 'string' && schema.type === 'array') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? JSON.stringify(schema.default) : '[]'},`);
    } else if (n8nType === 'string') {
      if (hasExplicitDefault) {
        lines.push(`\t\tdefault: '${esc(String(schema.default))}',`);
      } else {
        lines.push("\t\tdefault: '',");
      }
    } else if (n8nType === 'json') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? JSON.stringify(schema.default) : '{}'},`);
    } else if (n8nType === 'options') {
      const firstVal = schema.default ?? (schema.enum?.[0] ?? '');
      lines.push(`\t\tdefault: '${esc(String(firstVal))}',`);
    }
    // description
    if (description) {
      lines.push(`\t\tdescription: '${esc(description)}',`);
    }
    // options
    if (n8nType === 'options' && schema.enum) {
      lines.push('\t\toptions: [');
      for (const val of schema.enum) {
        lines.push(`\t\t\t{ name: '${esc(capitalize(String(val)))}', value: '${esc(String(val))}' },`);
      }
      lines.push('\t\t],');
    }
    // displayOptions
    lines.push('\t\tdisplayOptions: {');
    lines.push('\t\t\tshow: showOnlyFor,');
    lines.push('\t\t},');
    // routing (query params use 'query' send type)
    lines.push('\t\trouting: {');
    lines.push('\t\t\tsend: {');
    lines.push("\t\t\t\ttype: 'query',");
    lines.push(`\t\t\t\tproperty: '${esc(name)}',`);
    // If no explicit default, filter out empty values at runtime
    if (!hasExplicitDefault) {
      lines.push("\t\t\t\tvalue: '={{$value ? $value : undefined}}',");
    }
    lines.push('\t\t\t},');
    lines.push('\t\t},');
    lines.push('\t},');
  }

  // Generate body param fields
  for (const { name, schema, required } of bodyParams) {
    const n8nType = schemaToN8nType(schema);
    const desc = humanize(name);
    const hasExplicitDefault = schema.default !== undefined;

    lines.push('\t{');
    lines.push(`\t\tdisplayName: '${esc(desc)}',`);
    lines.push(`\t\tname: '${esc(name)}',`);
    lines.push(`\t\ttype: '${n8nType}',`);
    if (required) {
      lines.push('\t\trequired: true,');
    }
    // defaults — always emit (required by INodeProperties), but only
    // add the value expression when no explicit default in the spec.
    if (n8nType === 'boolean') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? schema.default : 'false'},`);
    } else if (n8nType === 'number') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? schema.default : 0},`);
    } else if (n8nType === 'string' && schema.type === 'array') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? JSON.stringify(schema.default) : '[]'},`);
    } else if (n8nType === 'string') {
      if (hasExplicitDefault) {
        lines.push(`\t\tdefault: '${esc(String(schema.default))}',`);
      } else {
        lines.push("\t\tdefault: '',");
      }
    } else if (n8nType === 'json') {
      lines.push(`\t\tdefault: ${hasExplicitDefault ? JSON.stringify(schema.default) : '{}'},`);
    } else if (n8nType === 'options') {
      const firstVal = schema.default ?? (schema.enum?.[0] ?? '');
      lines.push(`\t\tdefault: '${esc(String(firstVal))}',`);
    }
    // description
    if (schema.description) {
      lines.push(`\t\tdescription: '${esc(schema.description)}',`);
    }
    // options
    if (n8nType === 'options' && schema.enum) {
      lines.push('\t\toptions: [');
      for (const val of schema.enum) {
        lines.push(`\t\t\t{ name: '${esc(capitalize(String(val)))}', value: '${esc(String(val))}' },`);
      }
      lines.push('\t\t],');
    }
    // min/max for numbers
    if (n8nType === 'number' && schema.minimum !== undefined) {
      lines.push(`\t\ttypeOptions: { minValue: ${schema.minimum} },`);
    }
    // string arrays use multipleValues
    if (schema.type === 'array' && n8nType === 'string') {
      lines.push('\t\ttypeOptions: {');
      lines.push('\t\t\tmultipleValues: true,');
      lines.push('\t\t},');
    }
    // displayOptions
    lines.push('\t\tdisplayOptions: {');
    lines.push('\t\t\tshow: showOnlyFor,');
    lines.push('\t\t},');
    // routing
    lines.push('\t\trouting: {');
    lines.push('\t\t\tsend: {');
    lines.push("\t\t\t\ttype: 'body',");
    lines.push(`\t\t\t\tproperty: '${esc(name)}',`);
    // If no explicit default, filter out empty values at runtime
    if (!hasExplicitDefault) {
      lines.push("\t\t\t\tvalue: '={{$value ? $value : undefined}}',");
    }
    lines.push('\t\t\t},');
    lines.push('\t\t},');
    lines.push('\t},');
  }

  lines.push('];');
  lines.push('');

  return lines.join('\n');
}

// ─── TEMPLATE: Path parameter field ───────────────────────────────────────────

function generatePathParamField(resource, paramName, opValues) {
  const displayName = humanize(paramName);
  const lines = [];
  lines.push('{');
  lines.push(`\tdisplayName: '${esc(displayName)}',`);
  lines.push(`\tname: '${esc(paramName)}',`);
  lines.push("\ttype: 'string',");
  lines.push('\trequired: true,');
  lines.push("\tdefault: '',");
  lines.push('\tdisplayOptions: {');
  lines.push('\t\tshow: {');
  lines.push(`\t\t\tresource: ['${resource}'],`);
  lines.push(`\t\t\toperation: [${opValues.map(v => `'${v}'`).join(', ')}],`);
  lines.push('\t\t},');
  lines.push('\t},');
  lines.push(`\tdescription: '${esc(displayName)} of the ${resource}',`);
  lines.push('},');
  return lines.join('\n');
}

// ─── TEMPLATE: Bredbox.node.ts ────────────────────────────────────────────────

function generateNodeTs(resources) {
  const lines = [];
  lines.push("import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';");

  // Import each resource description
  for (const res of resources.sort()) {
    const dirName = RESOURCE_DIRS[res] || res + 's';
    lines.push(`import { ${res}Description } from './resources/${dirName}';`);
  }

  lines.push('');
  lines.push('export class Bredbox implements INodeType {');
  lines.push('\tdescription: INodeTypeDescription = {');
  lines.push("\t\tdisplayName: 'Bredbox',");
  lines.push("\t\tname: 'bredbox',");
  lines.push("\t\ticon: 'file:bredbox.svg',");
  lines.push("\t\tgroup: ['transform'],");
  lines.push('\t\tversion: 1,');
  lines.push("\t\tsubtitle: '={{$parameter[\"operation\"] + \": \" + $parameter[\"resource\"]}}',");
  lines.push("\t\tdescription: 'Interact with the Bredbox API',");
  lines.push('\t\tdefaults: {');
  lines.push("\t\t\tname: 'Bredbox',");
  lines.push('\t\t},');
  lines.push('\t\tusableAsTool: true,');
  lines.push('\t\tinputs: [NodeConnectionTypes.Main],');
  lines.push('\t\toutputs: [NodeConnectionTypes.Main],');
  lines.push("\t\tcredentials: [{ name: 'bredboxApi', required: true }],");
  lines.push('\t\trequestDefaults: {');
  lines.push("\t\t\tbaseURL: '={{$credentials.baseUrl}}',");
  lines.push('\t\t\theaders: {');
  lines.push("\t\t\t\tAccept: 'application/json',");
  lines.push("\t\t\t\t'Content-Type': 'application/json',");
  lines.push('\t\t\t},');
  lines.push('\t\t},');
  lines.push('\t\tproperties: [');
  lines.push('\t\t\t{');
  lines.push("\t\t\t\tdisplayName: 'Resource',");
  lines.push("\t\t\t\tname: 'resource',");
  lines.push("\t\t\t\ttype: 'options',");
  lines.push('\t\t\t\tnoDataExpression: true,');
  lines.push('\t\t\t\toptions: [');

  for (const res of resources.sort()) {
    const display = RESOURCE_DISPLAY_NAMES[res] || capitalize(res);
    lines.push('\t\t\t\t\t{');
    lines.push(`\t\t\t\t\t\tname: '${esc(display)}',`);
    lines.push(`\t\t\t\t\t\tvalue: '${esc(res)}',`);
    lines.push('\t\t\t\t\t},');
  }

  lines.push('\t\t\t\t],');
  lines.push(`\t\t\t\tdefault: '${resources.includes('save') ? 'save' : resources.sort()[0]}',`);
  lines.push('\t\t\t},');

  // Spread resource descriptions
  for (const res of resources.sort()) {
    lines.push(`\t\t\t...${res}Description,`);
  }

  lines.push('\t\t],');
  lines.push('\t};');
  lines.push('}');
  lines.push('');

  return lines.join('\n');
}

// ─── TEMPLATE: Bredbox.node.json ──────────────────────────────────────────────

function generateNodeJson() {
  return JSON.stringify(
    {
      node: 'n8n-nodes-bredbox',
      nodeVersion: '1.0',
      codexVersion: '1.0',
      categories: ['Development', 'Developer Tools'],
      resources: {
        credentialDocumentation: [
          {
            url: 'https://github.com/bredbox-app/n8n-nodes-bredbox?tab=readme-ov-file#credentials',
          },
        ],
        primaryDocumentation: [
          {
            url: 'https://github.com/bredbox-app/n8n-nodes-bredbox?tab=readme-ov-file',
          },
        ],
      },
    },
    null,
    '\t',
  ) + '\n';
}

// ─── TEMPLATE: Credentials ────────────────────────────────────────────────────

function generateCredentials() {
  return `import type {
\tIAuthenticateGeneric,
\tICredentialTestRequest,
\tICredentialType,
\tIcon,
\tINodeProperties,
} from 'n8n-workflow';

export class BredboxApi implements ICredentialType {
\tname = 'bredboxApi';

\tdisplayName = 'Bredbox API';

\ticon: Icon = 'file:../nodes/Bredbox/bredbox.svg';

\tdocumentationUrl =
\t\t'https://github.com/bredbox-app/n8n-nodes-bredbox?tab=readme-ov-file#credentials';

\tproperties: INodeProperties[] = [
\t\t{
\t\t\tdisplayName: 'API Base URL',
\t\t\tname: 'baseUrl',
\t\t\ttype: 'string',
\t\t\tdefault: 'https://api.bredbox.app/v2',
\t\t\tdescription: 'The base URL of the Bredbox API. Change this for local development.',
\t\t},
\t\t{
\t\t\tdisplayName: 'Access Token',
\t\t\tname: 'accessToken',
\t\t\ttype: 'string',
\t\t\ttypeOptions: { password: true },
\t\t\trequired: true,
\t\t\tdefault: '',
\t\t},
\t];

\tauthenticate: IAuthenticateGeneric = {
\t\ttype: 'generic',
\t\tproperties: {
\t\t\theaders: {
\t\t\t\tAuthorization: '=Bearer {{$credentials.accessToken}}',
\t\t\t},
\t\t},
\t};

\ttest: ICredentialTestRequest = {
\t\trequest: {
\t\t\tbaseURL: '={{$credentials.baseUrl}}',
\t\t\turl: '/me',
\t\t\tmethod: 'GET',
\t\t},
\t};
}
`;
}

// ─── HELPERS: Extract op value from generated code ────────────────────────────

function extractOpValue(optCode) {
  const m = optCode.match(/value:\s*'([^']+)'/);
  return m ? m[1] : 'getAll';
}

// ─── FETCH SPEC ───────────────────────────────────────────────────────────────

async function fetchSpec(url) {
  console.log(`Downloading spec from ${url} …`);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
  }
  return resp.json();
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${styleText('bold', 'Usage:')}
  node scripts/generate.mjs                        Download live spec & generate
  node scripts/generate.mjs --local <path>         Use local OpenAPI JSON file
  node scripts/generate.mjs --help                 Show this help

${styleText('bold', 'Output:')}
  nodes/Bredbox/Bredbox.node.ts
  nodes/Bredbox/Bredbox.node.json
  credentials/BredboxApi.credentials.ts
  nodes/Bredbox/resources/<resource>/index.ts
  nodes/Bredbox/resources/<resource>/<operation>.ts
`);
    return;
  }

  let spec;
  if (args.includes('--local')) {
    const idx = args.indexOf('--local');
    const filePath = resolve(ROOT, args[idx + 1] || 'openapi.json');
    console.log(`Reading spec from ${filePath} …`);
    spec = JSON.parse(readFileSync(filePath, 'utf8'));
  } else {
    spec = await fetchSpec(SPEC_URL);
  }

  console.log(`\n${styleText('bold', 'Generating n8n node from OpenAPI spec …')}\n`);
  generate(spec);
  console.log(`\n${styleText('green', 'Done!')} 🎉\n`);
}

main().catch((err) => {
  console.error(styleText('red', `Error: ${err.message}`));
  process.exit(1);
});
