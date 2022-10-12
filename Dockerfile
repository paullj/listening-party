FROM node:lts-alpine
ARG PNPM_VERSION=7.11.0
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /usr/app

ARG PORT=8080
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
RUN pnpm install
COPY . .
EXPOSE $PORT
ENV PORT=$PORT                                                                                                       
RUN pnpm build
CMD pnpm start