/* eslint-disable max-len */
/* eslint-env node */

const {
  CLUSTER_MODE,
  DATABASE_HOST = '127.0.0.1',
  DATABASE_PASSWORD = 'root',
  DATABASE_USER = 'root',
  DATABASE_NAME = 'admin',
  DATABASE_PORT = 27017,
  ELASTIC_SEARCH_URL = 'http://localhost:9200',
  NODE_ENV = 'development',
  PORT = 80,
  REDIS_ENDPOINT,
  RABBITMQ_HOST = '127.0.0.1',
  RABBITMQ_USER = 'root',
  RABBITMQ_PASSWORD = 'root',
  RABBITMQ_PROTOCOL = 'amqp',
  RABBITMQ_PORT = 5672,
  RABBITMQ_PREFETCH_COUNT,
  SECRET_KEY = 'hey',
  AWS_ACCESS_KEY = 'AKIAI5IFO43UX2OMDTNQ',
  AWS_SECRET_KEY = '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',
  AWS_REGION = 'eu-west-1'
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
  // db: 'mongodb://' + ((DATABASE_USER && DATABASE_PASSWORD) ? `${DATABASE_USER}:${DATABASE_PASSWORD}@` : '') + `${DATABASE_HOST}:${DATABASE_PORT}` + (DATABASE_NAME ? `/${DATABASE_NAME}` : ''),
  db: 'mongodb+srv://insta:animator@voyager-db-3mxv5.mongodb.net/test?retryWrites=true&w=majority',
  env: NODE_ENV,
  isCli,
  isRedisCluster,
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
    queueName: 'agg.product.notifications',
    exechangeName: 'agg.fanout',
    queueOptions:{
      durable: true
    }
  },
  secret: SECRET_KEY,
  postContentBucket: 'cdn.insta.clone',
  cdnHost: 'https://s3-eu-west-1.amazonaws.com'
}
