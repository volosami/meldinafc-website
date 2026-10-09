# Guia de Deploy Custo Zero (Free Tier): Meldina FC

Este guia detalha o processo de publicação do ecossistema do **Meldina FC** mantendo **100% de custo zero (R$ 0/mês)** com alta performance, resiliência e segurança.

---

## 1. Banco de Dados PostgreSQL Gratuito (Supabase ou Neon)

1. Crie uma conta gratuita em [Supabase](https://supabase.com) ou [Neon](https://neon.tech).
2. Crie um novo projeto chamado `meldinafc-db`.
3. Copie a string de conexão URI do PostgreSQL:
   ```env
   DATABASE_URL="postgresql://postgres:[SENHA]@[HOST]:5432/postgres?sslmode=require"
   ```
4. No seu terminal local ou CI/CD, execute as migrações e seed:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run prisma:seed
   ```

---

## 2. Deploy do Backend no Render (Web Service)

1. Crie uma conta no [Render](https://render.com).
2. Conecte seu repositório GitHub do Meldina FC.
3. Crie um novo **Web Service**:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Plan:** `Free`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
4. Configure as **Environment Variables** no dashboard do Render:
   - `DATABASE_URL`: *(sua string do Supabase/Neon)*
   - `JWT_SECRET`: *(uma string aleatória segura para tokens da diretoria)*
   - `CORS_ORIGIN`: *(URL do frontend na Vercel, ex: `https://meldinafc.vercel.app`)*
   - `NODE_ENV`: `production`
5. Clique em **Deploy**. Sua API ficará disponível em `https://meldina-backend.onrender.com`.

---

## 3. Deploy do Frontend na Vercel / Cloudflare Pages

1. Crie uma conta na [Vercel](https://vercel.com).
2. Importe o mesmo repositório GitHub.
3. Configure o projeto:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Em **Environment Variables**, adicione:
   - `VITE_API_URL`: `https://meldina-backend.onrender.com/api`
5. Clique em **Deploy**. Seu site estará no ar com CDN global e SSL automático.

---

## 4. Credenciais Padrão do Painel da Diretoria

* **URL:** `https://seu-site.vercel.app/admin/login`
* **E-mail:** `admin@meldinafc.com`
* **Senha inicial:** `meldina2026!` *(Recomenda-se alterar em produção)*
