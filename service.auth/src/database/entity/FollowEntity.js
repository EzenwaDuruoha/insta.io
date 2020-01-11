const {EntitySchema} = require('typeorm')
const {Follow} = require('../models/core')

const schema = {
  tableName: 'follows',
  name: 'Follow',
  target: Follow,
  uniques: ['follower', 'followed'],
  relations: {
    follower: {
      target: 'User',
      type: 'many-to-one',
      inverseSide: 'following',
      joinColumn: true,
      cascade: true,
      lazy: true,
      onDelete: 'CASCADE'
    },
    followed: {
      target: 'User',
      type: 'many-to-one',
      inverseSide: 'followers',
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
    unfollowed: {
      type: 'bool',
      default: false,
      nullable: false,
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
