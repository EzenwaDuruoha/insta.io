ARG env=development

FROM node:12 as build

ARG env
# Create app directory
WORKDIR /tmp

RUN mkdir /common

RUN mkdir /build

COPY --from=common /raw /tmp/common

RUN ls -ls /tmp/common

COPY ./package*.json /tmp/build/

WORKDIR /tmp/build/

RUN if [ "$env" = "production" ] ; then npm install --only=production ; else npm install ; fi

# Bundle app source
FROM node:12-alpine

ARG user=root
ARG app_path=/app
ARG env

RUN mkdir /common
RUN mkdir /secrets
COPY --from=build /tmp/common /common

ENV NODE_ENV=${env}
ENV SECRETS_PATH=/secrets
ENV COMMONS_PATH=/common
ENV APP_PATH=${app_path}
ENV PORT 80

WORKDIR ${APP_PATH}

COPY . ${APP_PATH}
COPY --from=build /tmp/build ${APP_PATH}

USER ${user}

EXPOSE 80 9229

CMD ["npm", "start"]
