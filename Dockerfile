# -------- ОСНОВНОЙ БАЗОВЫЙ СЛОЙ --------
FROM node:20-alpine AS base

WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./

# -------- СБОРКА КОДА --------
FROM base AS build

RUN npm install
COPY . .

# Сборка Next.js
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# -------- ПРОДАКШЕН ЗАВИСИМОСТИ --------
FROM base AS prod-deps

RUN npm install --omit=dev

RUN cp -R node_modules prod_node_modules

# -------- ФИНАЛЬНЫЙ КОНТЕЙНЕР --------
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=prod-deps /app/prod_node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./
COPY --from=build /app/ws_server.js ./ws_server.js

# Указываем переменные окружения
ENV NEXT_PORT=8081
ENV WS_PORT=8082

# Запускаем Next.js и WS параллельно
CMD ["npm", "run", "start:all"]