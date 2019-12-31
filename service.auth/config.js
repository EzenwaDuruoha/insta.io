/* eslint-env node */

const {
  DATABASE_NAME = 'default',
  DATABASE_HOST = '127.0.0.1',
  DATABASE_PASSWORD = 'root',
  DATABASE_USER = 'root',
  CLUSTER_MODE,
  REDIS_ENDPOINT,
  RABBITMQ_HOST = '127.0.0.1',
  RABBITMQ_USER = 'root',
  RABBITMQ_PASSWORD = 'root',
  RABBITMQ_PROTOCOL = 'amqp',
  RABBITMQ_PORT = 5672,
  RABBITMQ_PREFETCH_COUNT,
  PORT = 80,
  NODE_ENV = 'development',
  SECRET_KEY = 'hey'
} = process.env

const isCli = process.argv.includes('from=cli')
let redisConf = {host: '127.0.0.1', port: 6379}
let isRedisCluster = false

if (CLUSTER_MODE === 'true' && REDIS_ENDPOINT) {
  isRedisCluster = true
  redisConf = REDIS_ENDPOINT.split(',').map((conf) => {
    const tmp = conf.trim().split(':')
    return {host: tmp[0], port:tmp[1]}
  })
} else if (CLUSTER_MODE === 'false' && REDIS_ENDPOINT) {
  const tmp = REDIS_ENDPOINT.trim().split(':')
  redisConf = {host: tmp[0], port:tmp[1]}
}

module.exports = {
  db: {
    host: DATABASE_HOST,
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
  env: NODE_ENV,
  isCli,
  isRedisCluster,
  isDev: () => NODE_ENV === 'development',
  isProd: () => NODE_ENV === 'production',
  jwt: {
    expiresIn: '9000000',
    algorithm: 'HS256',
    header: {typ: 'Bearer'},
    issuer: 'Insta.io'
  },
  port: PORT,
  redis: redisConf,
  rabbitmq: {
    options: {
      protocol: RABBITMQ_PROTOCOL,
      hostname: RABBITMQ_HOST,
      port: RABBITMQ_PORT,
      heartbeat: 60,
      username: RABBITMQ_USER,
      password: RABBITMQ_PASSWORD,
    },
    prefetchCount: parseInt(RABBITMQ_PREFETCH_COUNT) || 20,
    queueName: 'insta.io.auth.notifications',
    exechangeName: 'insta.io.fanout',
    queueOptions:{
      durable: true
    }
  },
  secret: SECRET_KEY
}
