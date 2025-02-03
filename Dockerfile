FROM node:22-alpine AS front-build

WORKDIR /usr/src/app

COPY ./client/package*.json .

RUN npm ci

COPY ./client .

RUN npm run build


FROM node:22-alpine AS back-build

WORKDIR /usr/src/app

COPY ./server/package*.json .

RUN npm ci

COPY ./server .

RUN npm run build


FROM node:22-alpine AS full-build

WORKDIR /usr/src/app

COPY ./server/package*.json .

RUN npm ci --production

COPY --from=front-build /usr/src/app/dist ./dist

COPY --from=back-build /usr/src/app/build .

CMD ["node", "./src/index.js"]



