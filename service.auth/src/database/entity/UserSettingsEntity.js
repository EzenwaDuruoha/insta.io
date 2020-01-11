const {EntitySchema} = require('typeorm')
const UserSettings = require('../models/core/UserSettings')
const schema = {
  tableName: 'user_settings',
  name: 'UserSettings',
  target: UserSettings,
  relations: {
    user: {
      target: 'User',
      type: 'one-to-one',
      inverseSide: 'profile',
      joinColumn: true,
      cascade: true,
      lazy: true,
      onDelete: 'CASCADE'
    }
  },
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      unique: true
    },
    offers: {
      type: 'bool',
      default: false
    },
    news: {
      type: 'bool',
      default: false
    },
    alerts: {
      type: 'bool',
      default: false
    },
    last_update: {
      type: 'timestamp',
      nullable: true,
      updateDate: true
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      nullable: true
    }
  }
}
module.exports = new EntitySchema(schema)
module.exports.__schema = schema
