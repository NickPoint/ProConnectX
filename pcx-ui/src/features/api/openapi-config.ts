import type {ConfigFile} from '@rtk-query/codegen-openapi'

const config: ConfigFile = {
    schemaFile: `${import.meta.env.VITE_API_URL}/api/v3/api-docs`,
    apiFile: './emptyApi.ts',
    apiImport: 'emptySplitApi',
    outputFile: './pcxApi.ts',
    exportName: 'pcxApi',
    hooks: true,
    useEnumType: true,
}

export default config