const {EntitySchema} = require('typeorm')
const User = require('../models/core/User')

const schema = {
  tableName: 'users',
  name: 'User',
  target: User,
  relations: {
    profile: {
      target: 'UserProfile',
      type: 'one-to-one',
      inverseSide: 'user'
    },
    settings: {
      target: 'UserSettings',
      type: 'one-to-one',
      inverseSide: 'user'
    }
  },
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      unique: true
    },
    username: {
      type: 'varchar',
      unique: true
    },
    email: {
      type: 'varchar',
      nullable: false,
      unique: true
    },
    password: {
      type: 'varchar',
      length: 255
    },
    confirmed: {
      type: 'bool',
      default: false
    },
    confirmed_on: {
      type: 'timestamp',
      nullable: true
    },
    last_access : {
      type: 'timestamp',
      nullable: true,
      default: 'now'
    },
    deleted: {
      type: 'bool',
      default: false
    },
    last_update: {
      type: 'timestamp',
      nullable: true,
      updateDate: true
    },
    created_at : {
      type: 'timestamp',
      createDate: true,
      nullable: true
    }
  }
}

module.exports = new EntitySchema(schema)
module.exports.__schema = schema
