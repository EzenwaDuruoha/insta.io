FROM node:12 as base

WORKDIR /app

COPY --from=common /raw /app/common

COPY ./package.json .

RUN npm install

COPY ./ /app

ENV NODE_ENV=production BABEL_ENV=production

RUN npm run build

RUN mkdir -p ./tmp

RUN npm prune --production

RUN mv package.json node_modules build server ./tmp


FROM node:12-alpine

ENV NODE_ENV=production

RUN mkdir /common

COPY --from=base /app/common /common

WORKDIR /app

COPY --from=base /app/tmp /app/

EXPOSE 80

CMD [ "npm", "start" ]
