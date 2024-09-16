FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY build ./

RUN npm install

EXPOSE 3000

USER node

CMD ["node","index.js"]