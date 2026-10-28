#!/bin/sh
set -e

echo "🔍 Verificando conexão com o banco de dados principal..."
if node -e '
  const { PrismaClient } = require("@prisma/client");
  const p = new PrismaClient();
  p.$queryRaw`SELECT 1`
    .then(() => p.$disconnect().then(() => process.exit(0)))
    .catch((err) => {
      const lines = (err && err.message ? err.message : String(err)).split("\n").map(s => s.trim()).filter(Boolean);
      console.error(lines[lines.length - 1] || "Connection error");
      p.$disconnect().finally(() => process.exit(1));
    });
' 2>/tmp/db_err.txt; then
  echo "✅ Conexão com o banco principal estabelecida com sucesso!"
else
  DB_ERR=$(cat /tmp/db_err.txt 2>/dev/null | tr '\n' ' ')
  echo "❌ Falha ao conectar no banco principal (Supabase): ${DB_ERR}"
  if [ -n "${LOCAL_DATABASE_URL}" ] && [ "${LOCAL_DATABASE_URL}" != "${DATABASE_URL}" ]; then
    echo "🔄 Alternando automaticamente para o banco PostgreSQL local do Docker..."
    export SUPABASE_FALLBACK_REASON="${DB_ERR}"
    export DATABASE_URL="${LOCAL_DATABASE_URL}"
  fi
fi

echo "⏳ Sincronizando schema do banco de dados (Prisma)..."
npx prisma migrate deploy || npx prisma db push

if [ "${RUN_SEED:-true}" = "true" ]; then
  echo "🌱 Populando dados iniciais (Prisma Seed)..."
  npx prisma db seed
fi

echo "🚀 Iniciando servidor Meldina FC API..."
exec node dist/server.js
