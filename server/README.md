### Migration steps:

npm run typeorm -- migration:generate -d secrets/ormConfig.ts deployment/migrations/{migrationName}

npm run typeorm -- migration:run -d secrets/ormConfig.ts