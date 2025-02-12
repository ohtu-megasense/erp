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

FROM registry.access.redhat.com/ubi9/nodejs-22-minimal

WORKDIR /usr/src/app

USER root

# RUN chown -R appuser:appuser /usr/src/app && \
#     chmod -R 755 /usr/src/app && \
#     mkdir -p /home/appuser/.npm && \
#     chown -R appuser:appuser /home/appuser/.npm && \

#     chgrp -R 0 /usr/src/app && \
#     chmod -R g=u /usr/src/app

USER 1001

COPY ./server/package*.json .

RUN npm ci --production

COPY --from=front-build /usr/src/app/dist ./dist

COPY --from=back-build /usr/src/app/build .

RUN chmod 755

USER 1001

CMD ["node", "./src/index.js"]

