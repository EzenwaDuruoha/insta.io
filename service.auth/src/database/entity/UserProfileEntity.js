const {EntitySchema} = require('typeorm')
const UserProfile = require('../models/core/UserProfile')
const schema = {
  tableName: 'user_profiles',
  name: 'UserProfile',
  target: UserProfile,
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
    firstname: {
      type: 'varchar',
      default: ''
    },
    lastname: {
      type: 'varchar',
      default: ''
    },
    gender: {
      type: 'varchar',
      default: 'male'
    },
    mobile: {
      type: 'varchar',
      default: ''
    },
    street: {
      type: 'varchar',
      default: ''
    },
    city: {
      type: 'varchar',
      default: ''
    },
    state: {
      type: 'varchar',
      default: ''
    },
    postcode: {
      type: 'varchar',
      default: ''
    },
    country: {
      type: 'varchar',
      default: ''
    },
    timezone: {
      type: 'varchar',
      default: 'UTC/GMT'
    },
    profile_image: {
      type: 'varchar',
      default: ''
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
