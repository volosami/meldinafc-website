# Estágio 1: Build da aplicação e geração do Prisma Client
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src/

RUN npm run build

# Estágio 2: Imagem enxuta de execução
FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY docker-entrypoint.sh ./docker-entrypoint.sh

# Garante quebras de linha LF (mesmo em checkout Windows) e permissão de execução
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && \
    chmod +x ./docker-entrypoint.sh && \
    mkdir -p /app/public/uploads

EXPOSE 4000

ENTRYPOINT ["sh", "./docker-entrypoint.sh"]

