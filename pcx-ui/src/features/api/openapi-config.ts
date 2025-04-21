import type {ConfigFile} from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
    schemaFile: `http://localhost:3000/api/v3/api-docs`,
    apiFile: './emptyApi.ts',
    apiImport: 'emptySplitApi',
    outputFile: './pcxApi.ts',
    exportName: 'pcxApi',
    hooks: true,
    useEnumType: true,
    tag: true,
    endpointOverrides: [
        {
            pattern: 'getFilteredServices',
            type: 'query',
        },
    ],
}

export default config