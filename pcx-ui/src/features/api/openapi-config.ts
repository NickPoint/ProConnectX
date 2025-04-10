import type {ConfigFile} from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
    schemaFile: 'http://192.168.178.107:3000/api/v3/api-docs',
    apiFile: './emptyApi.ts',
    apiImport: 'emptySplitApi',
    outputFile: './pcxApi.ts',
    exportName: 'pcxApi',
    hooks: true,
    useEnumType: true,
}

export default config