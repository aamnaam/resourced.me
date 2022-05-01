FROM node:16-slim

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install --only=prod

COPY . .

EXPOSE 5000

ENV NODE_ENV=prod

CMD [ "npm", "start" ]