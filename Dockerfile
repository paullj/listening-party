# FROM node:lts-alpine
# RUN npm install -g pnpm
# WORKDIR /usr/app

# ARG PORT=8080
# COPY package.json ./
# COPY pnpm-lock.yaml ./
# COPY pnpm-workspace.yaml ./
# COPY . .
# RUN pnpm install

# RUN pnpm build --projects=@listening-party/server

# FROM node:lts-alpine

# EXPOSE $PORT
# ENV PORT=$PORT                                                                                                       
# CMD pnpm start

FROM node:lts-alpine AS base
RUN npm install -g pnpm
WORKDIR /usr/base
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY . .
RUN pnpm install

FROM base AS builder
WORKDIR /usr/builder
COPY --from=base /usr/base ./
RUN pnpm build --projects=@listening-party/server

FROM base
COPY --from=builder /usr/builder ./
ARG PORT=8080
EXPOSE $PORT
ENV PORT=$PORT       
RUN pnpm start