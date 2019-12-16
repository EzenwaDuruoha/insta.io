const {db, isCli} = require('../../config')

const config = {
  ...db,
  type: 'postgres',
  entities: [
      `${__dirname}/entity/*.js`
  ],
  synchronize: false,
  cli: {
    migrationsDir: 'src/database/migration',
  }
}

if (isCli) {
  config.migrations = [
    `${__dirname}/migration/*{.ts,.js}`
  ]
}

module.exports = config
