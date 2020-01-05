/* eslint-disable max-len */
/* eslint-env node */
const fs = require('fs')
const {
  CLUSTER_MODE,
  DATABASE_HOST = '127.0.0.1',
  DATABASE_PASSWORD = 'root',
  DATABASE_USER = 'root',
  DATABASE_NAME = 'admin',
  DATABASE_PORT = 27017,
  DATABASE_URL = false,
  ELASTIC_SEARCH_URL = 'http://localhost:9200',
  NODE_ENV = 'development',
  PORT = 8090,
  REDIS_ENDPOINT,
  RABBITMQ_HOST = '127.0.0.1',
  RABBITMQ_USER = 'root',
  RABBITMQ_PASSWORD = 'root',
  RABBITMQ_PROTOCOL = 'amqp',
  RABBITMQ_PORT = 5672,
  RABBITMQ_PREFETCH_COUNT,
  SECRET_KEY = 'hey',
  AWS_ACCESS_KEY = 'root',
  AWS_SECRET_KEY = 'root',
  AWS_REGION = 'eu-west-1',
  INSTA_AUTH_SERVICE = 'http://auth',
  INSTA_RELATION_SERVICE = 'http://auth',
  SECRETS_PATH
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
let db = 'mongodb://' + ((DATABASE_USER && DATABASE_PASSWORD) ? `${DATABASE_USER}:${DATABASE_PASSWORD}@` : '') + `${DATABASE_HOST}:${DATABASE_PORT}` + (DATABASE_NAME ? `/${DATABASE_NAME}` : '')

if (DATABASE_URL) {
  db = DATABASE_URL
}

const jwtCerts = {
  privateKey: '',
  publicKey: ''
}

if (SECRETS_PATH) {
  jwtCerts.privateKey = fs.readFileSync(`${SECRETS_PATH}/jwt/private.key`, 'utf8')
  jwtCerts.publicKey = fs.readFileSync(`${SECRETS_PATH}/jwt/public.key`, 'utf8')
}
module.exports = {
  db,
  env: NODE_ENV,
  isCli,
  isRedisCluster,
  network: {
    authService: INSTA_AUTH_SERVICE,
    relationService: INSTA_RELATION_SERVICE
  },
  isDev: () => NODE_ENV === 'development',
  isProd: () => NODE_ENV === 'production',
  elasticsearch : {
    node: ELASTIC_SEARCH_URL,
    maxRetries: 5,
    requestTimeout: 60000,
    // sniffOnStart: true
  },
  aws: {
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY
    }
  },
  jwt: {
    expiresIn: '9000000',
    algorithm: 'RS256',
    header: {typ: 'Bearer'},
    issuer: 'Insta.io'
  },
  jwtCerts,
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
    queueName: 'insta.io.media.notifications',
    exechangeName: 'insta.io.fanout',
    queueOptions:{
      durable: true
    }
  },
  secret: SECRET_KEY,
  postContentBucket: 'cdn.insta.clone',
  cdnHost: 'https://s3-eu-west-1.amazonaws.com'
}
