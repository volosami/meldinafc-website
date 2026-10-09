import { Player, Team, Fixture, Standing, NewsArticle, Product } from "../types";

export const MFC_INFO = {
  nome: "Meldina FC",
  instagram: "https://www.instagram.com/meldinafc/",
  youtube: "https://www.youtube.com/@MeldinaTV", // podcasts, bastidores e conteúdos
  twitch: "https://www.twitch.tv/meldinatv", // somente jogos ao vivo
  estadio: "Lovebomb Arena",
  temporada: 2026,
  fundacao: 2017,
  tecnico: "Celso Roth",
  presidente: "André Almeida",
  liga: "Pro Clubs",
  divisao: "Série A",
  programa: "Clube Meldina",
  lema: "Muito além do jogo",
  slogans: ["Muito além do jogo", "Vamo Meldina", "Meldina pra sempre"],
  frases: [
    ["O time está unido, e a intenção é continuar assim.", "Celso Roth"],
    ["Hoje vamos deixar nossos corações em campo.", "Kiki"],
    ["As notas são apenas números. O que o Rafael faz pelo time é indispensável.", "Guigs"],
    ["O Meldina é maior do que a gente.", "Carrijo"],
    ["A coroa pesa.", "Camisas 2026"],
  ],
};

export const STATIC_PLAYERS: Player[] = [
  { id: "muralha", name: "Muralha", number: 1, position: "Goleiro", group: "Goleiros", photoUrl: "/assets/players/muralha-1.jpg", preferredFoot: "Direito", joinedYear: 2026, matches: 8, goals: 0, assists: 0, extraKey: "Jogos sem sofrer gols", extraValue: "1", bio: "Única contratação para a temporada 2026, Muralha chegou depois do título da Série B para dar ainda mais segurança ao gol. Reflexo rápido, voz de comando e presença absoluta na pequena área — o apelido não é por acaso." },
  { id: "kiki", name: "Kiki", number: 2, position: "Lateral-direito", group: "Defensores", photoUrl: "/assets/players/kiki-2.jpg", preferredFoot: "Direito", joinedYear: 2024, matches: 8, goals: 0, assists: 2, extraKey: "Desarmes", extraValue: "19", bio: "Forte, incansável e querido por todo mundo — dentro e fora do vestiário. Kiki faz parte da geração que assumiu o Meldina em 2024 e é daqueles jogadores que ninguém quer enfrentar e todo mundo quer ter ao lado." },
  { id: "jonga", name: "Jonga", number: 6, position: "Lateral-esquerdo", group: "Defensores", photoUrl: "/assets/players/jonga-6.jpg", preferredFoot: "Esquerdo", joinedYear: 2024, matches: 7, goals: 0, assists: 1, extraKey: "Cruzamentos certos", extraValue: "15", bio: "O técnico da linha defensiva. Jonga resolve com a bola no pé: domínio limpo, passe preciso e leitura de jogo que faz a saída de bola do Meldina funcionar desde 2024." },
  { id: "gaab", name: "Gaab", number: 12, position: "Zagueiro", group: "Defensores", photoUrl: "/assets/players/gaab-12.jpg", preferredFoot: "Direito", joinedYear: 2024, matches: 8, goals: 0, assists: 0, extraKey: "Interceptações", extraValue: "22", bio: "O showman do Meldina. Carismático, energia lá em cima e coração do time: Gaab puxa o grupo nos momentos difíceis e transforma cada desarme em festa na arquibancada." },
  { id: "lacerda", name: "Lacerda", number: 78, position: "Zagueiro", group: "Defensores", photoUrl: "/assets/players/lacerda-78.jpg", preferredFoot: "Esquerdo", joinedYear: 2024, matches: 8, goals: 1, assists: 0, extraKey: "Duelos aéreos vencidos", extraValue: "27", bio: "O criativo do time. Zagueiro canhoto que pensa o jogo de trás, Lacerda arrisca o passe que ninguém vê e ainda aparece na área adversária — marcou contra o Castelo AC, fora de casa." },
  { id: "rafael", name: "Rafael", number: 21, position: "Volante", group: "Meio-campistas", photoUrl: "/assets/players/rafael-21.jpg", preferredFoot: "Direito", joinedYear: 2024, matches: 8, goals: 0, assists: 1, extraKey: "Passes certos (%)", extraValue: "91", bio: "O “loose cannon” do Meldina. Imprevisível, corre o campo inteiro e faz muito mais do que a posição pede — e, no meio de tudo isso, sempre dá um jeito de se destacar." },
  { id: "guigs", name: "Guigs", number: 18, position: "Volante", group: "Meio-campistas", photoUrl: "/assets/players/guigs-18.jpg", preferredFoot: "Direito", joinedYear: 2024, matches: 8, goals: 0, assists: 3, extraKey: "Passes decisivos", extraValue: "12", bio: "O volante certeiro. Visão de jogo fora do comum e passes que parecem impossíveis — Guigs enxerga espaços que ninguém mais vê." },
  { id: "carrijo", name: "Carrijo", number: 10, position: "Meia", group: "Meio-campistas", photoUrl: "/assets/players/carrijo-10.jpg", preferredFoot: "Esquerdo", joinedYear: 2024, matches: 6, goals: 3, assists: 5, extraKey: "Passes decisivos", extraValue: "18", bio: "Vice-presidente do clube e maestro em campo. Carrijo é quem faz o meio-campo do Meldina funcionar: dita o ritmo, organiza e decide.", roleTitle: "Vice-presidente" },
  { id: "kristhian", name: "Kristhian", number: 87, position: "Meia", group: "Meio-campistas", photoUrl: "/assets/players/kristhian-87.jpg", preferredFoot: "Esquerdo", joinedYear: 2024, matches: 8, goals: 2, assists: 2, extraKey: "Dribles certos", extraValue: "18", bio: "O meia consistente. Sempre aparece no ataque para ajudar os atacantes, mas sabe exatamente o seu lugar. Decisivo na virada por 2 a 1 sobre o Real Ventura." },
  { id: "caio", name: "Caio", number: 7, position: "Atacante", group: "Atacantes", photoUrl: "/assets/players/caio-7.jpg", preferredFoot: "Direito", joinedYear: 2024, matches: 8, goals: 2, assists: 3, extraKey: "Dribles certos", extraValue: "26", bio: "O marrento que todo mundo adora. Drible, provocação e personalidade de sobra — e faz questão de que todos saibam que é um leitor ávido." },
  { id: "almeida", name: "Almeida", number: 9, position: "Atacante", group: "Atacantes", photoUrl: "/assets/players/almeida-9.jpg", preferredFoot: "Direito", joinedYear: 2024, isCaptain: true, matches: 8, goals: 11, assists: 1, extraKey: "Finalizações no alvo", extraValue: "29", bio: "Presidente, capitão e camisa 9. André Almeida é quem faz o time inteiro funcionar — matador, faro de gol absurdo e artilheiro disparado.", roleTitle: "Presidente" },
];

export const STATIC_TEAMS: Record<string, Team> = {
  mfc: { id: "mfc", name: "Meldina FC", shortName: "Meldina", acronym: "MFC", isUs: true },
  ipe: { id: "ipe", name: "Ipê FC", shortName: "Ipê", acronym: "IPÊ", color1: "#e26fa8", color2: "#2b2b2b", shape: "round" },
  leoes: { id: "leoes", name: "Leões da Serra", shortName: "Leões", acronym: "LDS", color1: "#d98c0b", color2: "#3a220a", shape: "shield" },
  castelo: { id: "castelo", name: "Castelo AC", shortName: "Castelo", acronym: "CAC", color1: "#5a5f6e", color2: "#f2f2f2", shape: "castle" },
  solaris: { id: "solaris", name: "Atlético Solaris", shortName: "Solaris", acronym: "ATS", color1: "#f4c20d", color2: "#c21f1f", shape: "round" },
  setelagos: { id: "setelagos", name: "Sete Lagos EC", shortName: "Sete Lagos", acronym: "7L", color1: "#1c7fc4", color2: "#ffffff", shape: "shield" },
  ventura: { id: "ventura", name: "Real Ventura", shortName: "R. Ventura", acronym: "RV", color1: "#6c2bd9", color2: "#ffffff", shape: "shield" },
  aurora: { id: "aurora", name: "Aurora EC", shortName: "Aurora", acronym: "AEC", color1: "#ff7a1a", color2: "#1d1d1d", shape: "round" },
  desola: { id: "desola", name: "De Sola FC", shortName: "De Sola", acronym: "DSF", logoUrl: "/assets/img/desola.png", isRival: true },
  tupinamba: { id: "tupinamba", name: "Tupinambá EC", shortName: "Tupinambá", acronym: "TEC", color1: "#111111", color2: "#e8e8e8", shape: "castle" },
  cerrado: { id: "cerrado", name: "Unidos do Cerrado", shortName: "Cerrado", acronym: "UDC", color1: "#9b6b2f", color2: "#f0e3c8", shape: "round" },
  vilaserena: { id: "vilaserena", name: "Vila Serena FC", shortName: "V. Serena", acronym: "VSF", color1: "#0aa3a3", color2: "#ffffff", shape: "shield" },
};

export const STATIC_FIXTURES: Fixture[] = [
  { id: "1", matchDate: "2026-09-01T21:00:00", competition: "Pro Clubs · Série A", round: "1ª rodada · Estreia", isHome: true, opponentId: "ipe", opponent: STATIC_TEAMS.ipe, homeScore: 1, awayScore: 2, venue: "Lovebomb Arena", isNext: false },
  { id: "2", matchDate: "2026-09-03T22:00:00", competition: "Playoffs de Elite", round: "Jogo decisivo", isHome: false, opponentId: "vilaserena", opponent: STATIC_TEAMS.vilaserena, homeScore: 3, awayScore: 2, venue: "Arena Vila Serena", isNext: false },
  { id: "3", matchDate: "2026-09-06T20:30:00", competition: "Pro Clubs · Série A", round: "2ª rodada", isHome: true, opponentId: "leoes", opponent: STATIC_TEAMS.leoes, homeScore: 3, awayScore: 1, venue: "Lovebomb Arena", isNext: false },
  { id: "4", matchDate: "2026-09-08T22:00:00", competition: "Pro Clubs · Série A", round: "3ª rodada", isHome: false, opponentId: "castelo", opponent: STATIC_TEAMS.castelo, homeScore: 1, awayScore: 3, venue: "Estádio do Castelo", isNext: false },
  { id: "5", matchDate: "2026-09-11T22:00:00", competition: "Playoffs de Elite", round: "Último playoff do ano", isHome: true, opponentId: "cerrado", opponent: STATIC_TEAMS.cerrado, homeScore: 2, awayScore: 1, venue: "Lovebomb Arena", isNext: false },
  { id: "6", matchDate: "2026-09-13T20:30:00", competition: "Pro Clubs · Série A", round: "4ª rodada", isHome: false, opponentId: "ventura", opponent: STATIC_TEAMS.ventura, homeScore: 1, awayScore: 2, venue: "Estádio Ventura", isNext: false },
  { id: "7", matchDate: "2026-09-18T20:00:00", competition: "Pro Clubs · Série A", round: "5ª rodada", isHome: true, opponentId: "aurora", opponent: STATIC_TEAMS.aurora, homeScore: 3, awayScore: 1, venue: "Lovebomb Arena", isNext: false },
  { id: "8", matchDate: "2026-09-21T22:00:00", competition: "Pro Clubs · Série A", round: "6ª rodada", isHome: true, opponentId: "setelagos", opponent: STATIC_TEAMS.setelagos, homeScore: 3, awayScore: 0, venue: "Lovebomb Arena", isNext: false },
  { id: "9", matchDate: "2026-10-04T20:30:00", competition: "Pro Clubs · Série A", round: "7ª rodada · Clássico (adiado)", isHome: true, opponentId: "desola", opponent: STATIC_TEAMS.desola, homeScore: null, awayScore: null, venue: "Lovebomb Arena", isNext: true },
  { id: "10", matchDate: "2026-10-09T22:00:00", competition: "Pro Clubs · Série A", round: "8ª rodada", isHome: false, opponentId: "tupinamba", opponent: STATIC_TEAMS.tupinamba, homeScore: null, awayScore: null, venue: "Arena Tupinambá", isNext: false },
  { id: "11", matchDate: "2026-10-11T20:30:00", competition: "Pro Clubs · Série A", round: "9ª rodada", isHome: false, opponentId: "solaris", opponent: STATIC_TEAMS.solaris, homeScore: null, awayScore: null, venue: "Arena Solaris", isNext: false },
  { id: "12", matchDate: "2026-10-16T22:00:00", competition: "Pro Clubs · Série A", round: "10ª rodada", isHome: true, opponentId: "ventura", opponent: STATIC_TEAMS.ventura, homeScore: null, awayScore: null, venue: "Lovebomb Arena", isNext: false },
];

export const STATIC_STANDINGS: Standing[] = [
  { teamId: "mfc", team: STATIC_TEAMS.mfc, matches: 6, wins: 5, draws: 0, losses: 1, goalsFor: 15, goalsAgainst: 6, form: "WWWWW", points: 15, goalDiff: 9, position: 1 },
  { teamId: "desola", team: STATIC_TEAMS.desola, matches: 6, wins: 4, draws: 1, losses: 1, goalsFor: 13, goalsAgainst: 7, form: "WDWWW", points: 13, goalDiff: 6, position: 2 },
  { teamId: "ventura", team: STATIC_TEAMS.ventura, matches: 6, wins: 4, draws: 0, losses: 2, goalsFor: 11, goalsAgainst: 8, form: "LWWWW", points: 12, goalDiff: 3, position: 3 },
  { teamId: "aurora", team: STATIC_TEAMS.aurora, matches: 6, wins: 3, draws: 1, losses: 2, goalsFor: 10, goalsAgainst: 9, form: "WLDWW", points: 10, goalDiff: 1, position: 4 },
  { teamId: "castelo", team: STATIC_TEAMS.castelo, matches: 6, wins: 3, draws: 0, losses: 3, goalsFor: 9, goalsAgainst: 9, form: "WLWWL", points: 9, goalDiff: 0, position: 5 },
  { teamId: "leoes", team: STATIC_TEAMS.leoes, matches: 6, wins: 2, draws: 2, losses: 2, goalsFor: 8, goalsAgainst: 8, form: "DWLDW", points: 8, goalDiff: 0, position: 6 },
  { teamId: "ipe", team: STATIC_TEAMS.ipe, matches: 6, wins: 2, draws: 1, losses: 3, goalsFor: 7, goalsAgainst: 9, form: "WLLDL", points: 7, goalDiff: -2, position: 7 },
  { teamId: "solaris", team: STATIC_TEAMS.solaris, matches: 6, wins: 2, draws: 0, losses: 4, goalsFor: 8, goalsAgainst: 12, form: "LLWLW", points: 6, goalDiff: -4, position: 8 },
  { teamId: "tupinamba", team: STATIC_TEAMS.tupinamba, matches: 6, wins: 1, draws: 2, losses: 3, goalsFor: 6, goalsAgainst: 10, form: "DLLDW", points: 5, goalDiff: -4, position: 9 },
  { teamId: "setelagos", team: STATIC_TEAMS.setelagos, matches: 6, wins: 1, draws: 1, losses: 4, goalsFor: 5, goalsAgainst: 12, form: "LLDLL", points: 4, goalDiff: -7, position: 10 },
  { teamId: "cerrado", team: STATIC_TEAMS.cerrado, matches: 6, wins: 1, draws: 0, losses: 5, goalsFor: 4, goalsAgainst: 13, form: "LLLLL", points: 3, goalDiff: -9, position: 11 },
  { teamId: "vilaserena", team: STATIC_TEAMS.vilaserena, matches: 6, wins: 0, draws: 2, losses: 4, goalsFor: 3, goalsAgainst: 14, form: "LDLDL", points: 2, goalDiff: -11, position: 12 },
];

export const STATIC_NEWS: NewsArticle[] = [
  {
    id: "vitoria-sete-lagos",
    slug: "vitoria-sete-lagos",
    title: "Meldina vence Sete Lagos por 3 a 0 e assume a liderança isolada da Série A",
    summary: "Com hat-trick de Almeida e atuação segura de Muralha, time alcança a quinta vitória consecutiva na elite.",
    content: "Uma noite mágica na Lovebomb Arena. O Meldina FC dominou o Sete Lagos do início ao fim e garantiu mais 3 pontos cruciais com gols magistrais de Almeida. A equipe agora se prepara para o clássico contra o De Sola.",
    category: "jogos",
    imageUrl: "/assets/news/sete-lagos.jpg",
    publishedAt: "2026-09-22T10:00:00Z",
    author: "Redação Meldina",
    isFeatured: true,
  },
  {
    id: "camisa-ii-lider",
    slug: "camisa-ii-lider",
    title: "A coroa pesa: Meldina FC lança nova camisa II oficial para a Série A",
    summary: "Branca com detalhes em grená e dourado, a nova peça homenageia a conquista da Série B e a chegada à elite.",
    content: "O departamento de marketing do Meldina FC apresentou oficialmente o novo uniforme II da temporada 2026. A peça já está disponível para compra na loja oficial e os sócios do plano Ouro possuem 20% de desconto.",
    category: "clube",
    imageUrl: "/assets/news/camisas.jpg",
    publishedAt: "2026-09-20T14:00:00Z",
    author: "Marketing Meldina",
    isFeatured: false,
  },
  {
    id: "vitoria-aurora",
    slug: "vitoria-aurora",
    title: "Meldina bate Aurora por 3 a 1 e embala na competição",
    summary: "Gols de Almeida, Kristhian e Caio selam virada espetacular na Lovebomb Arena.",
    content: "Em jogo disputado lance a lance, a equipe comandada por Celso Roth mostrou maturidade e poder de reação para virar a partida e somar mais três pontos importantes na tabela.",
    category: "jogos",
    imageUrl: "/assets/news/aurora.jpg",
    publishedAt: "2026-09-19T09:00:00Z",
    author: "Redação Meldina",
    isFeatured: false,
  },
  {
    id: "vitoria-ventura",
    slug: "vitoria-ventura",
    title: "Com gol no final, Meldina supera Real Ventura fora de casa",
    summary: "Atuação inspirada de Carrijo e Kristhian garante vitória heróica por 2 a 1.",
    content: "Mesmo com a pressão da torcida adversária, o Meldina manteve a postura tática e buscou o resultado nos acréscimos.",
    category: "jogos",
    imageUrl: "/assets/news/pelo-acesso.jpg",
    publishedAt: "2026-09-14T08:00:00Z",
    author: "Redação Meldina",
    isFeatured: false,
  },
];

export const STATIC_PRODUCTS: Product[] = [
  { id: "camisa-1", name: "Camisa I Oficial 2026", category: "Uniformes", price: 199.9, image: "/assets/img/camisa-1-produto.jpg", badge: "Oficial", sizes: ["P", "M", "G", "GG"], desc: "Grená tradicional com detalhes em ouro e marinho." },
  { id: "camisa-2", name: "Camisa II Oficial 2026", category: "Uniformes", price: 199.9, image: "/assets/img/camisa-2-produto.jpg", badge: "Lançamento", sizes: ["P", "M", "G", "GG"], desc: "Branca com escudo bordado e acabamento premium." },
  { id: "bone-oficial", name: "Boné Meldina Snapback", category: "Acessórios", price: 79.9, image: "/assets/img/produto-bone.jpg", badge: "Exclusivo", desc: "Aba reta com bordado em relevo de alta definição." },
  { id: "caneca-clube", name: "Caneca de Cerâmica Oficial", category: "Colecionáveis", price: 44.9, image: "/assets/img/produto-caneca.jpg", desc: "Caneca cerâmica 350ml com escudo e lema." },
  { id: "cachecol-estadio", name: "Cachecol de Arquibancada", category: "Acessórios", price: 69.9, image: "/assets/img/produto-cachecol.jpg", desc: "Tecido duplo com franjas e frase 'Muito além do jogo'." },
  { id: "chaveiro-metal", name: "Chaveiro Brasão de Metal", category: "Colecionáveis", price: 29.9, image: "/assets/img/produto-chaveiro.jpg", desc: "Em metal polido com banho de ouro envelhecido." },
];

/* Sala de troféus. count = número de títulos; seasons = edição do jogo e temporada de cada conquista */
export const TROPHIES = [
  {
    id: "primeira-divisao", title: "Primeira Divisão", competition: "Pro Clubs", mark: "1ª", count: 10,
    seasons: ["FIFA 21 · 2020/21 — 3×", "FIFA 23 · 2022/23 — 7×"],
    desc: "A maior marca da história do clube. Tricampeão da primeira divisão no FIFA 21 e, duas temporadas depois, uma sequência histórica de sete títulos no FIFA 23.",
  },
  {
    id: "copa-ea", title: "Copa EA", competition: "EA Sports", mark: "EA", count: 1,
    seasons: ["FIFA 19 · 2018/19"],
    desc: "A primeira taça da história do Meldina, conquistada na segunda temporada do clube.",
  },
  {
    id: "serie-b", title: "Série B", competition: "Pro Clubs", mark: "B", count: 1,
    seasons: ["FC 25 · 2025"],
    desc: "O título da reconstrução. Com a nova geração formada em 2024, o Meldina venceu a Série B e garantiu o retorno à elite em 2026.",
  },
];

/* Linha do tempo do clube, por edição do jogo */
export const HISTORY = [
  { year: "2017", game: "FIFA 18", title: "A fundação", text: "Na temporada 2017/18 nasce o Meldina Futebol Clube: um grupo de amigos, um escudo com coroa e monograma e as cores grená, ouro e marinho." },
  { year: "2019", game: "FIFA 19", title: "Campeão da Copa EA", text: "Na segunda temporada, a primeira taça: o Meldina conquista a Copa EA e passa a ser respeitado no cenário do Pro Clubs." },
  { year: "2021", game: "FIFA 21", title: "Tricampeão da primeira divisão", text: "Três títulos da primeira divisão em uma única edição. O Meldina se firma entre os grandes." },
  { year: "2023", game: "FIFA 23", title: "Sete vezes campeão", text: "A era de ouro: sete títulos da primeira divisão no FIFA 23, a maior sequência da história do clube. São 10 títulos da elite no total." },
  { year: "2024", game: "FC 24", title: "Novo sistema, nova geração", text: "A EA troca as temporadas com troféus por um campeonato contínuo, sem início nem fim. O Meldina se reinventa: uma nova geração assume o elenco e o clube recomeça na Série B." },
  { year: "2025", game: "FC 25", title: "Campeão da Série B", text: "Pelo acesso, o Meldina supera os playoffs e conquista a Série B — o título que marca o retorno do clube à elite." },
  { year: "2026", game: "FC 26", title: "De volta à primeira divisão", text: "O Meldina volta à Série A. Depois da derrota na estreia, cinco vitórias seguidas e a liderança. Em setembro, a presidência apresenta o lema oficial: Muito além do jogo." },
];
