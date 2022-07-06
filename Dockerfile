FROM node:lts-alpine

WORKDIR /app

COPY package.json /app/

COPY client/package.json /app/client/
RUN npm run install-client --only=production

COPY server/package.json /app/server/
RUN npm run install-server --only=production

COPY client/ /app/client/
RUN npm run build --prefix client

COPY server/ /app/server/

USER node

CMD ["npm", "start", "--prefix", "server"]