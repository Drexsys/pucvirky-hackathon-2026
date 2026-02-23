FROM node:22-alpine AS builder
WORKDIR /app_web/
ADD package-lock.json .
ADD package.json .
RUN npm ci
ADD . .
RUN npm run build

FROM devforth/spa-to-http:latest
COPY --from=builder /app_web/dist/ .
