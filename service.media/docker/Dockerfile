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
ARG env

RUN mkdir /common
COPY --from=build /tmp/common /common

WORKDIR /app/

ENV NODE_ENV=${env}
ENV PORT 80

COPY . /app/
COPY --from=build /tmp/build /app/

USER ${user}

EXPOSE 80

CMD ["npm", "start"]
