# Declaração de Intenção: Autenticação Admin, Gestão de Conteúdo e Logs

- **Objetivo (Outcome):** Implementar o fluxo de registro e login de administradores (`/admin/register` e `POST /api/auth/register`) protegido por chave de segurança (`ADMIN_REGISTRATION_KEY`), prover serviço de upload de imagens híbrido (armazenamento local servido via Express em desenvolvimento e upload para Supabase Storage Bucket quando as variáveis do Supabase estiverem configuradas), permitir a gestão e alteração de imagens e dados para Notícias, Elenco e Informações do Clube (`ClubInfo`), e reformular os logs do backend para um formato conciso, colorido e em 1 linha (ex: `[12:26:18] GET /api/news 304 - 468ms`), silenciando as queries do Prisma no terminal.
- **Público (User):** Diretoria e equipe administrativa do Meldina FC que precisam atualizar o site com facilidade e monitorar os logs do servidor sem sobrecarga visual.
- **Momento atual (Why now):** O backend já se conecta ao banco PostgreSQL do Supabase, o frontend funciona localmente, mas não há tela/endpoint para criação de novos administradores, nem upload de imagens ou logs amigáveis.
- **Critério de Sucesso (Success):**
  1. Novo admin consegue se registrar com nome, e-mail, senha e `ADMIN_REGISTRATION_KEY`, com dados salvos no Supabase via Prisma e login funcionando via JWT.
  2. Endpoint de upload de imagem (`POST /api/upload`) que aceita arquivos locais (`/uploads`) com fallback/suporte automático a Bucket do Supabase Storage quando configurado.
  3. No painel administrativo, gerenciamento completo de:
     - Notícias: criação e edição com upload de imagem de capa ou URL.
     - Elenco: edição de jogadores com upload de foto de perfil e estatísticas.
     - Clube: edição de informações institucionais (estádio, técnico, presidente, lema).
  4. Terminal do backend exibe apenas logs concisos de requisições HTTP em uma linha, sem poluir com queries SQL do Prisma ou headers/cookies gigantes.
- **Restrições (Constraint):** Modo local funcional sem dependências obrigatórias externas para arquivos (salvando em pasta estática do backend), mas com suporte automático a Supabase Storage quando configurado via variáveis de ambiente.
- **Fora de escopo (Out of scope):** Alterações nas regras de negócio de sócios-torcedores ou loja física/virtual.
