FROM node:12
# Create app directory
RUN mkdir /common

COPY --from=common /raw /common

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY ./ /app

EXPOSE 80

CMD [ "npm", "run", "dev" ]