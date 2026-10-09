import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados do Meldina FC...");

  // 1. Admin User
  const passwordHash = await bcrypt.hash("meldina2026!", 10);
  await prisma.user.upsert({
    where: { email: "admin@meldinafc.com" },
    update: {},
    create: {
      email: "admin@meldinafc.com",
      name: "Diretoria Meldina",
      passwordHash,
      role: "ADMIN",
    },
  });

  // 2. Club Info
  await prisma.clubInfo.upsert({
    where: { id: "meldina-main" },
    update: {},
    create: {
      id: "meldina-main",
      stadium: "Lovebomb Arena",
      season: 2026,
      foundationYear: 2024,
      coach: "Celso Roth",
      president: "André Almeida",
      league: "Pro Clubs",
      division: "Série A",
      programName: "Clube Meldina",
      motto: "Muito além do jogo",
    },
  });

  // 3. Teams
  const teamsData = [
    { id: "mfc", name: "Meldina FC", shortName: "Meldina", acronym: "MFC", isUs: true },
    { id: "ipe", name: "Ipê FC", shortName: "Ipê", acronym: "IPÊ", color1: "#e26fa8", color2: "#2b2b2b", shape: "round" },
    { id: "leoes", name: "Leões da Serra", shortName: "Leões", acronym: "LDS", color1: "#d98c0b", color2: "#3a220a", shape: "shield" },
    { id: "castelo", name: "Castelo AC", shortName: "Castelo", acronym: "CAC", color1: "#5a5f6e", color2: "#f2f2f2", shape: "castle" },
    { id: "solaris", name: "Atlético Solaris", shortName: "Solaris", acronym: "ATS", color1: "#f4c20d", color2: "#c21f1f", shape: "round" },
    { id: "setelagos", name: "Sete Lagos EC", shortName: "Sete Lagos", acronym: "7L", color1: "#1c7fc4", color2: "#ffffff", shape: "shield" },
    { id: "ventura", name: "Real Ventura", shortName: "R. Ventura", acronym: "RV", color1: "#6c2bd9", color2: "#ffffff", shape: "shield" },
    { id: "aurora", name: "Aurora EC", shortName: "Aurora", acronym: "AEC", color1: "#ff7a1a", color2: "#1d1d1d", shape: "round" },
    { id: "desola", name: "De Sola FC", shortName: "De Sola", acronym: "DSF", logoUrl: "assets/img/desola.png", isRival: true },
    { id: "tupinamba", name: "Tupinambá EC", shortName: "Tupinambá", acronym: "TEC", color1: "#111111", color2: "#e8e8e8", shape: "castle" },
    { id: "cerrado", name: "Unidos do Cerrado", shortName: "Cerrado", acronym: "UDC", color1: "#9b6b2f", color2: "#f0e3c8", shape: "round" },
    { id: "vilaserena", name: "Vila Serena FC", shortName: "V. Serena", acronym: "VSF", color1: "#0aa3a3", color2: "#ffffff", shape: "shield" },
  ];

  for (const t of teamsData) {
    await prisma.team.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }

  // 4. Players
  const playersData = [
    {
      id: "muralha", name: "Muralha", number: 1, position: "Goleiro", group: "Goleiros", photoUrl: "assets/players/muralha-1.jpg", preferredFoot: "Direito", joinedYear: 2026,
      matches: 8, goals: 0, assists: 0, extraKey: "Jogos sem sofrer gols", extraValue: "1",
      bio: "Única contratação para a temporada 2026, Muralha chegou depois do título da Série B para dar ainda mais segurança ao gol. Reflexo rápido, voz de comando e presença absoluta na pequena área.",
    },
    {
      id: "kiki", name: "Kiki", number: 2, position: "Lateral-direito", group: "Defensores", photoUrl: "assets/players/kiki-2.jpg", preferredFoot: "Direito", joinedYear: 2024,
      matches: 8, goals: 0, assists: 2, extraKey: "Desarmes", extraValue: "19",
      bio: "Forte, incansável e querido por todo mundo — dentro e fora do vestiário. Kiki está no Meldina desde a fundação e é daqueles jogadores que ninguém quer enfrentar.",
    },
    {
      id: "jonga", name: "Jonga", number: 6, position: "Lateral-esquerdo", group: "Defensores", photoUrl: "assets/players/jonga-6.jpg", preferredFoot: "Esquerdo", joinedYear: 2024,
      matches: 7, goals: 0, assists: 1, extraKey: "Cruzamentos certos", extraValue: "15",
      bio: "O técnico da linha defensiva. Jonga resolve com a bola no pé: domínio limpo, passe preciso e leitura de jogo exemplar.",
    },
    {
      id: "gaab", name: "Gaab", number: 12, position: "Zagueiro", group: "Defensores", photoUrl: "assets/players/gaab-12.jpg", preferredFoot: "Direito", joinedYear: 2024,
      matches: 8, goals: 0, assists: 0, extraKey: "Interceptações", extraValue: "22",
      bio: "O showman do Meldina. Carismático, energia lá em cima e coração do time: Gaab puxa o grupo nos momentos difíceis.",
    },
    {
      id: "lacerda", name: "Lacerda", number: 78, position: "Zagueiro", group: "Defensores", photoUrl: "assets/players/lacerda-78.jpg", preferredFoot: "Esquerdo", joinedYear: 2024,
      matches: 8, goals: 1, assists: 0, extraKey: "Duelos aéreos vencidos", extraValue: "27",
      bio: "O criativo do time. Zagueiro canhoto que pensa o jogo de trás, arrisca o passe que ninguém vê e ainda aparece na área adversária.",
    },
    {
      id: "rafael", name: "Rafael", number: 21, position: "Volante", group: "Meio-campistas", photoUrl: "assets/players/rafael-21.jpg", preferredFoot: "Direito", joinedYear: 2024,
      matches: 8, goals: 0, assists: 1, extraKey: "Passes certos (%)", extraValue: "91",
      bio: "O “loose cannon” do Meldina. Imprevisível, corre o campo inteiro e faz muito mais do que a posição pede.",
    },
    {
      id: "guigs", name: "Guigs", number: 18, position: "Volante", group: "Meio-campistas", photoUrl: "assets/players/guigs-18.jpg", preferredFoot: "Direito", joinedYear: 2024,
      matches: 8, goals: 0, assists: 3, extraKey: "Passes decisivos", extraValue: "12",
      bio: "O volante certeiro. Visão de jogo fora do comum e passes que parecem impossíveis.",
    },
    {
      id: "carrijo", name: "Carrijo", number: 10, position: "Meia", group: "Meio-campistas", photoUrl: "assets/players/carrijo-10.jpg", preferredFoot: "Esquerdo", joinedYear: 2024, roleTitle: "Vice-presidente",
      matches: 6, goals: 3, assists: 5, extraKey: "Passes decisivos", extraValue: "18",
      bio: "Vice-presidente do clube e maestro em campo. Carrijo é quem faz o meio-campo do Meldina funcionar: dita o ritmo, organiza e decide.",
    },
    {
      id: "kristhian", name: "Kristhian", number: 87, position: "Meia", group: "Meio-campistas", photoUrl: "assets/players/kristhian-87.jpg", preferredFoot: "Esquerdo", joinedYear: 2024,
      matches: 8, goals: 2, assists: 2, extraKey: "Dribles certos", extraValue: "18",
      bio: "O meia consistente. Sempre aparece no ataque para ajudar os atacantes, mantendo a consistência tática.",
    },
    {
      id: "caio", name: "Caio", number: 7, position: "Atacante", group: "Atacantes", photoUrl: "assets/players/caio-7.jpg", preferredFoot: "Direito", joinedYear: 2024,
      matches: 8, goals: 2, assists: 3, extraKey: "Dribles certos", extraValue: "26",
      bio: "O marrento que todo mundo adora. Drible, provocação e personalidade de sobra.",
    },
    {
      id: "almeida", name: "Almeida", number: 9, position: "Atacante", group: "Atacantes", photoUrl: "assets/players/almeida-9.jpg", preferredFoot: "Direito", joinedYear: 2024, isCaptain: true, roleTitle: "Presidente",
      matches: 8, goals: 11, assists: 1, extraKey: "Finalizações no alvo", extraValue: "29",
      bio: "Presidente, capitão e camisa 9. André Almeida é quem faz o time inteiro funcionar — artilheiro disparado do Meldina.",
    },
  ];

  for (const p of playersData) {
    await prisma.player.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  // 5. Standings
  const standingsData = [
    { teamId: "mfc", matches: 6, wins: 5, draws: 0, losses: 1, goalsFor: 15, goalsAgainst: 6, form: "WWWWW" },
    { teamId: "desola", matches: 6, wins: 4, draws: 1, losses: 1, goalsFor: 13, goalsAgainst: 7, form: "WDWWW" },
    { teamId: "ventura", matches: 6, wins: 4, draws: 0, losses: 2, goalsFor: 11, goalsAgainst: 8, form: "LWWWW" },
    { teamId: "aurora", matches: 6, wins: 3, draws: 1, losses: 2, goalsFor: 10, goalsAgainst: 9, form: "WLDWW" },
    { teamId: "castelo", matches: 6, wins: 3, draws: 0, losses: 3, goalsFor: 9, goalsAgainst: 9, form: "WLWWL" },
    { teamId: "leoes", matches: 6, wins: 2, draws: 2, losses: 2, goalsFor: 8, goalsAgainst: 8, form: "DWLDW" },
    { teamId: "ipe", matches: 6, wins: 2, draws: 1, losses: 3, goalsFor: 7, goalsAgainst: 9, form: "WLLDL" },
    { teamId: "solaris", matches: 6, wins: 2, draws: 0, losses: 4, goalsFor: 8, goalsAgainst: 12, form: "LLWLW" },
    { teamId: "tupinamba", matches: 6, wins: 1, draws: 2, losses: 3, goalsFor: 6, goalsAgainst: 10, form: "DLLDW" },
    { teamId: "setelagos", matches: 6, wins: 1, draws: 1, losses: 4, goalsFor: 5, goalsAgainst: 12, form: "LLDLL" },
    { teamId: "cerrado", matches: 6, wins: 1, draws: 0, losses: 5, goalsFor: 4, goalsAgainst: 13, form: "LLLLL" },
    { teamId: "vilaserena", matches: 6, wins: 0, draws: 2, losses: 4, goalsFor: 3, goalsAgainst: 14, form: "LDLDL" },
  ];

  for (const s of standingsData) {
    await prisma.standing.upsert({
      where: { teamId: s.teamId },
      update: s,
      create: s,
    });
  }

  // 6. News
  const newsData = [
    {
      id: "vitoria-sete-lagos",
      slug: "vitoria-sete-lagos",
      title: "Meldina vence Sete Lagos por 3 a 0 e assume a liderança isolada da Série A",
      summary: "Com hat-trick de Almeida e atuação segura de Muralha, time alcança a quinta vitória consecutiva na elite.",
      content: "Uma noite mágica na Lovebomb Arena. O Meldina FC dominou o Sete Lagos do início ao fim e garantiu mais 3 pontos cruciais...",
      category: "jogos",
      imageUrl: "assets/news/sete-lagos.jpg",
      publishedAt: new Date("2026-09-22T10:00:00Z"),
      isFeatured: true,
    },
    {
      id: "camisa-ii-lider",
      slug: "camisa-ii-lider",
      title: "A coroa pesa: Meldina FC lança nova camisa II oficial para a Série A",
      summary: "Branca com detalhes em grená e dourado, a nova peça homenageia a conquista da Série B e a chegada à elite.",
      content: "O departamento de marketing do Meldina FC apresentou oficialmente o novo uniforme II da temporada 2026...",
      category: "clube",
      imageUrl: "assets/news/camisas.jpg",
      publishedAt: new Date("2026-09-20T14:00:00Z"),
      isFeatured: false,
    },
    {
      id: "vitoria-aurora",
      slug: "vitoria-aurora",
      title: "Meldina bate Aurora por 3 a 1 e embala na competição",
      summary: "Gols de Almeida, Kristhian e Caio selam virada espetacular na Lovebomb Arena.",
      content: "Em jogo disputado lance a lance, a equipe comandada por Celso Roth mostrou maturidade e poder de reação...",
      category: "jogos",
      imageUrl: "assets/news/aurora.jpg",
      publishedAt: new Date("2026-09-19T09:00:00Z"),
      isFeatured: false,
    },
  ];

  for (const n of newsData) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: n,
      create: n,
    });
  }

  console.log("✅ Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
