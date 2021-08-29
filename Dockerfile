FROM node:14.17.3-alpine3.14

COPY package.json /app/

WORKDIR /app 

RUN npm install

COPY . /app/

EXPOSE 3000