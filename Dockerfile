FROM node:20-alpine AS deps
WORKDIR /app

# Устанавливаем все зависимости (prod + dev)
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# --- Build-time env vars (передаются через --build-arg) ---
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
# секретный ключ сервис-роли Supabase (не должен быть публичным)
ARG SUPABASE_SERVICE_ROLE_KEY
# секрет подписи JWT Supabase
ARG SUPABASE_JWT_SECRET
# секрет NextAuth (используется для шифрования куки и JWT)
ARG NEXTAUTH_SECRET
# Steam API Key для провайдера авторизации
ARG STEAM_API_KEY
ARG NEXTAUTH_URL
ARG SUPABASE_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV STEAM_API_KEY=${STEAM_API_KEY}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV SUPABASE_API_KEY=${SUPABASE_API_KEY}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Финальный образ для запуска
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV PORT 3000

# Тот же набор env-ов доступен и во время рантайма
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG SUPABASE_JWT_SECRET
ARG NEXTAUTH_SECRET
ARG STEAM_API_KEY
ARG NEXTAUTH_URL
ARG SUPABASE_API_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV STEAM_API_KEY=${STEAM_API_KEY}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV SUPABASE_API_KEY=${SUPABASE_API_KEY}

# Копируем только необходимые файлы
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Очищаем devDependencies для меньшего размера образа
RUN npm prune --omit=dev

EXPOSE 3000
CMD ["npm", "start"] 