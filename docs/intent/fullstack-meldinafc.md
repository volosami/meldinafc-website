# Declaração de Intenção: Evolução Full-Stack Meldina FC (React + Node/Next.js)

**Data:** 2026-10-06  
**Status:** Atualizado para Stack React (Vite) + Backend TypeScript (MVC)

---

## 1. Contexto & Diagnóstico de Stack
O projeto do **Meldina FC** será estruturado em duas camadas independentes e profissionais:
1. **Frontend SPA:** React 18+ com Vite, TypeScript e Tailwind CSS.
2. **Backend API:** Node.js com TypeScript e arquitetura em camadas (Controller -> Service -> Repository / MVC), com validação de schemas (Zod) e logs estruturados em JSON.
3. **Database:** PostgreSQL (Supabase / Neon no Free Tier para evitar expiração de 30 dias do Render).
4. **Hospedagem:** Frontend no Vercel/Cloudflare Pages e Backend no Render (ou Vercel Serverless).

---

## 2. Análise da Arquitetura MVC & Hospedagem no Render

### Cabe MVC no Backend?
**Sim, perfeitamente.** Para uma API REST limpa e manutenível, o padrão em 3 camadas (adaptado do MVC para APIs) é a melhor escolha:
- **Controllers:** Tratam requisições HTTP, headers, status codes e validação de entrada (Zod).
- **Services (Business Layer):** Regras de negócio do clube (cálculo de classificação, regras de sócio-torcedor, publicação de notícias).
- **Repositories / Models (Data Layer):** Consultas ao banco de dados com Prisma ou Drizzle ORM.

### Análise: Next.js vs Express/Fastify como Backend Standalone no Render
- **Next.js como Backend Isolado:** O Next.js foi desenhado prioritariamente como meta-framework full-stack (SSR + API). Se for usado *exclusivamente* como API no Render, ele carrega o runtime de compilação do React sem necessidade, consumindo mais memória RAM (~150-250MB).
- **Express / Fastify com TypeScript:** Se o frontend é um Vite SPA separado, um backend em **Express ou Fastify + TypeScript** com MVC é mais leve (~40-60MB), inicia mais rápido no Render e é o padrão de mercado para APIs Node.js desacopladas.
- **Alternativa Next.js Fullstack Unificado:** Se optar por Next.js, a maior vantagem seria unificar frontend e backend no mesmo projeto Next.js hospedado na Vercel (eliminando o cold start do Render e tendo SSR para SEO de notícias e jogos).

---

## 3. Declaração de Intenção Consolidada

* **Resultado (Outcome):** Aplicação web do Meldina FC com frontend moderno em React (Vite + TS + Tailwind), backend modular em TypeScript (MVC) com endpoints REST documentados, autenticação para diretoria e portal do sócio.
* **Critério de Sucesso (Success):** 
  - Frontend responsivo e performático com componentes Tailwind e tipagem estrita TS.
  - Backend com arquitetura Controller-Service-Repository, validação Zod e testes de integração.
  - Painel administrativo com login seguro para gerenciar notícias, jogos, elenco e sócios.
  - Custo zero mantido (Free Tier de hospedagem e banco).
* **Restrição Principal (Constraint):** R$ 0/mês de custo, código limpo sem over-engineering de microserviços.
