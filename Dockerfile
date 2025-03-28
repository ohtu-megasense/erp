FROM node:22-alpine AS front-build

WORKDIR /usr/src/app

COPY ./client/package*.json .

RUN npm ci

COPY ./client .
COPY ./shared ../shared

RUN npm run build

FROM node:22-alpine AS back-build

WORKDIR /usr/src/app

COPY ./server/package*.json .

RUN npm ci

COPY ./server .
COPY ./shared ../shared

RUN npm run build

FROM registry.access.redhat.com/ubi9/nodejs-22-minimal

WORKDIR /usr/src/app

USER root

COPY ./server/package*.json .

RUN npm ci --production

COPY --from=front-build /usr/src/app/dist ./app/dist

COPY --from=back-build /usr/src/app/build .

RUN chmod 755 .

USER 1001

ENV PORT=3000
ENV NODE_ENV=production
ENV CA_PATH=/etc/certs/ca.pem

EXPOSE 3000

CMD ["node", "./src/index.js"]
