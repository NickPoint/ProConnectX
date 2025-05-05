Write-Host "Fetching OpenAPI spec..."
Invoke-WebRequest -Uri "http://localhost:8080/v3/api-docs.yaml" -OutFile "api-docs.yaml"

Write-Host "Generating RTK Query API..."
cd .\pcx-ui\src\features\api
npx @rtk-query/codegen-openapi .\openapi-config.ts
Write-Host "Done! Your RTK Query API is updated."