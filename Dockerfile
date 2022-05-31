# Build layer
FROM node:lts-alpine AS build
RUN mkdir -p /usr/croc-src/
WORKDIR /usr/croc-src/
COPY package.json /usr/croc-src/
RUN npm install
COPY . /usr/croc-src/
RUN npm run build

# Image layer
FROM node:lts-alpine

LABEL name "king-croc"

ARG DISCORD_TOKEN
ARG GUILD_ID
ARG CLIENT_ID

ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV GUILD_ID=${GUILD_ID}
ENV CLIENT_ID=${CLIENT_ID}

ENV TOTAL_SHARDS=1
ENV TZ=Australia/Brisbane
ENV NODE_ENV=production

RUN mkdir -p /usr/kingcroc
WORKDIR /usr/kingcroc
COPY package.json /usr/kingcroc/
RUN npm install --production
COPY --from=build /usr/croc-src/dist /usr/kingcroc
RUN npm run deploy-commands

CMD ["node", "index.js"]
