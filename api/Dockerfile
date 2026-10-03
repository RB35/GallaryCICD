# Stage 1: Build
FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build


# Stage 2: Production
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

RUN addgroup -S appgroup \
    && adduser -S appuser -G appgroup

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/drizzle ./drizzle

USER appuser

EXPOSE 8000

CMD ["node", "dist/index.js"]
