FROM node:lts-alpine
RUN npm install -g pnpm
WORKDIR /usr/app

ARG PORT=8080
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY . .
RUN pnpm install

EXPOSE $PORT
ENV PORT=$PORT                                                                                                       
RUN pnpm build --projects=@listening-party/server
CMD pnpm start