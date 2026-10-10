/* Meldina FC — dados do site (conteúdo estático, sem back-end) */

const MFC = {
  instagram: "https://www.instagram.com/meldinafc/",
  youtube: "https://www.youtube.com/@MeldinaTV",
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

/* ---------------- Elenco ---------------- */
const PLAYERS = [
  { id: "muralha", nome: "Muralha", num: 1, pos: "Goleiro", grupo: "Goleiros", img: "muralha-1.jpg", pe: "Direito", desde: 2026,
    j: 8, g: 0, a: 0, extra: ["Jogos sem sofrer gols", 1],
    bio: "Única contratação para a temporada 2026, Muralha chegou depois do título da Segunda Divisão para dar ainda mais segurança ao gol. Reflexo rápido, voz de comando e presença absoluta na pequena área — o apelido não é por acaso." },
  { id: "kiki", nome: "Kiki", num: 2, pos: "Lateral-direito", grupo: "Defensores", img: "kiki-2.jpg", pe: "Direito", desde: 2024,
    j: 8, g: 0, a: 2, extra: ["Desarmes", 19],
    bio: "Forte, incansável e querido por todo mundo — dentro e fora do vestiário. Kiki faz parte da geração que assumiu o Meldina em 2024 e é daqueles jogadores que ninguém quer enfrentar e todo mundo quer ter ao lado." },
  { id: "jonga", nome: "Jonga", num: 6, pos: "Lateral-esquerdo", grupo: "Defensores", img: "jonga-6.jpg", pe: "Esquerdo", desde: 2024,
    j: 7, g: 0, a: 1, extra: ["Cruzamentos certos", 15],
    bio: "O técnico da linha defensiva. Jonga resolve com a bola no pé: domínio limpo, passe preciso e leitura de jogo que faz a saída de bola do Meldina funcionar desde 2024." },
  { id: "gaab", nome: "Gaab", num: 12, pos: "Zagueiro", grupo: "Defensores", img: "gaab-12.jpg", pe: "Direito", desde: 2024,
    j: 8, g: 0, a: 0, extra: ["Interceptações", 22],
    bio: "O showman do Meldina. Carismático, energia lá em cima e coração do time: Gaab puxa o grupo nos momentos difíceis e transforma cada desarme em festa na arquibancada." },
  { id: "lacerda", nome: "Lacerda", num: 78, pos: "Zagueiro", grupo: "Defensores", img: "lacerda-78.jpg", pe: "Esquerdo", desde: 2024,
    j: 8, g: 1, a: 0, extra: ["Duelos aéreos vencidos", 27],
    bio: "O criativo do time. Zagueiro canhoto que pensa o jogo de trás, Lacerda arrisca o passe que ninguém vê e ainda aparece na área adversária — marcou contra o Castelo AC, fora de casa." },
  { id: "rafael", nome: "Rafael", num: 21, pos: "Volante", grupo: "Meio-campistas", img: "rafael-21.jpg", pe: "Direito", desde: 2024,
    j: 8, g: 0, a: 1, extra: ["Passes certos (%)", 91],
    bio: "O “loose cannon” do Meldina. Imprevisível, corre o campo inteiro e faz muito mais do que a posição pede — e, no meio de tudo isso, sempre dá um jeito de se destacar. Nas palavras de Guigs: “O que o Rafael faz pelo time é indispensável”." },
  { id: "guigs", nome: "Guigs", num: 18, pos: "Volante", grupo: "Meio-campistas", img: "guigs-18.jpg", pe: "Direito", desde: 2024,
    j: 8, g: 0, a: 3, extra: ["Passes decisivos", 12],
    bio: "O volante certeiro. Visão de jogo fora do comum e passes que parecem impossíveis — Guigs enxerga espaços que ninguém mais vê. Em setembro, renovou contrato com o clube: ele fica!" },
  { id: "carrijo", nome: "Carrijo", num: 10, pos: "Meia", grupo: "Meio-campistas", img: "carrijo-10.jpg", pe: "Esquerdo", desde: 2024, cargo: "Vice-presidente",
    j: 6, g: 3, a: 5, extra: ["Passes decisivos", 18],
    bio: "Vice-presidente do clube e maestro em campo. Carrijo é quem faz o meio-campo do Meldina funcionar: dita o ritmo, organiza e decide. Depois de um início de temporada turbulento, respondeu com gols e um pedido de desculpas: “O Meldina é maior do que a gente”." },
  { id: "kristhian", nome: "Kristhian", num: 87, pos: "Meia", grupo: "Meio-campistas", img: "kristhian-87.jpg", pe: "Esquerdo", desde: 2024,
    j: 8, g: 2, a: 2, extra: ["Dribles certos", 18],
    bio: "O meia consistente. Sempre aparece no ataque para ajudar os atacantes, mas sabe exatamente o seu lugar. Foi decisivo na virada por 2 a 1 sobre o Real Ventura, fora de casa." },
  { id: "caio", nome: "Caio", num: 7, pos: "Atacante", grupo: "Atacantes", img: "caio-7.jpg", pe: "Direito", desde: 2024,
    j: 8, g: 2, a: 3, extra: ["Dribles certos", 26],
    bio: "O marrento que todo mundo adora. Drible, provocação e personalidade de sobra — e faz questão de que todos saibam que é um leitor ávido. Caio lê muito mesmo, e jura que isso aparece no jogo." },
  { id: "almeida", nome: "Almeida", num: 9, capitao: true, pos: "Atacante", grupo: "Atacantes", img: "almeida-9.jpg", pe: "Direito", desde: 2024, cargo: "Presidente",
    j: 8, g: 11, a: 1, extra: ["Finalizações no alvo", 29],
    bio: "Presidente, capitão e camisa 9. André Almeida é quem faz o time inteiro funcionar — sem ele, nada dá certo. Matador, faro de gol absurdo e artilheiro disparado do Meldina: a bola procura ele." },
];

/* ---------------- Clubes ---------------- */
const TEAMS = {
  mfc:       { nome: "Meldina FC", curto: "Meldina", sigla: "MFC", us: true },
  ipe:       { nome: "Ipê FC", curto: "Ipê", sigla: "IPÊ", c1: "#e26fa8", c2: "#2b2b2b", shape: "round" },
  leoes:     { nome: "Leões da Serra", curto: "Leões", sigla: "LDS", c1: "#d98c0b", c2: "#3a220a", shape: "shield" },
  castelo:   { nome: "Castelo AC", curto: "Castelo", sigla: "CAC", c1: "#5a5f6e", c2: "#f2f2f2", shape: "castle" },
  solaris:   { nome: "Atlético Solaris", curto: "Solaris", sigla: "ATS", c1: "#f4c20d", c2: "#c21f1f", shape: "round" },
  setelagos: { nome: "Sete Lagos EC", curto: "Sete Lagos", sigla: "7L", c1: "#1c7fc4", c2: "#ffffff", shape: "shield" },
  ventura:   { nome: "Real Ventura", curto: "R. Ventura", sigla: "RV", c1: "#6c2bd9", c2: "#ffffff", shape: "shield" },
  aurora:    { nome: "Aurora EC", curto: "Aurora", sigla: "AEC", c1: "#ff7a1a", c2: "#1d1d1d", shape: "round" },
  desola:    { nome: "De Sola FC", curto: "De Sola", sigla: "DSF", img: "img/desola.png", rival: true },
  tupinamba: { nome: "Tupinambá EC", curto: "Tupinambá", sigla: "TEC", c1: "#111111", c2: "#e8e8e8", shape: "castle" },
  cerrado:   { nome: "Unidos do Cerrado", curto: "Cerrado", sigla: "UDC", c1: "#9b6b2f", c2: "#f0e3c8", shape: "round" },
  vilaserena:{ nome: "Vila Serena FC", curto: "V. Serena", sigla: "VSF", c1: "#0aa3a3", c2: "#ffffff", shape: "shield" },
};

/* ---------------- Jogos ----------------
   casa: true = Meldina mandante. placar: [gols mandante, gols visitante]. relato: id da notícia */
const FIXTURES = [
  { d: "2026-09-01T21:00", comp: "Pro Clubs · Série A", fase: "1ª rodada · Estreia", casa: true, adv: "ipe", placar: [1, 2], relato: "celso-estreia" },
  { d: "2026-09-03T22:00", comp: "Playoffs de Elite", fase: "Jogo decisivo", casa: false, adv: "vilaserena", placar: [3, 2], local: "Arena Vila Serena", relato: "nota-ea" },
  { d: "2026-09-06T20:30", comp: "Pro Clubs · Série A", fase: "2ª rodada", casa: true, adv: "leoes", placar: [3, 1] },
  { d: "2026-09-08T22:00", comp: "Pro Clubs · Série A", fase: "3ª rodada", casa: false, adv: "castelo", placar: [1, 3], local: "Estádio do Castelo", relato: "carrijo-desculpas" },
  { d: "2026-09-11T22:00", comp: "Playoffs de Elite", fase: "Último playoff do ano", casa: true, adv: "cerrado", placar: [2, 1], relato: "ultimo-playoff" },
  { d: "2026-09-13T20:30", comp: "Pro Clubs · Série A", fase: "4ª rodada", casa: false, adv: "ventura", placar: [1, 2], local: "Estádio Ventura", relato: "vitoria-ventura" },
  { d: "2026-09-18T20:00", comp: "Pro Clubs · Série A", fase: "5ª rodada", casa: true, adv: "aurora", placar: [3, 1], relato: "vitoria-aurora" },
  { d: "2026-09-21T22:00", comp: "Pro Clubs · Série A", fase: "6ª rodada", casa: true, adv: "setelagos", placar: [3, 0], relato: "vitoria-sete-lagos" },
  { d: "2026-10-06T22:00", comp: "Pro Clubs · Série A", fase: "7ª rodada", casa: true, adv: "tupinamba", relato: "hoje-tem-meldina-tupinamba" },
  { d: "2026-10-11T20:30", comp: "Pro Clubs · Série A", fase: "8ª rodada", casa: false, adv: "solaris", local: "Arena Solaris" },
  { d: "2026-10-16T22:00", comp: "Pro Clubs · Série A", fase: "9ª rodada", casa: true, adv: "ventura" },
  { d: "2026-10-18T20:30", comp: "Pro Clubs · Série A", fase: "10ª rodada", casa: false, adv: "leoes", local: "Estádio da Serra" },
  { d: "2026-10-23T22:00", comp: "Pro Clubs · Série A", fase: "11ª rodada", casa: true, adv: "castelo" },
];

/* ---------------- Classificação (Série A, após 6 rodadas) ---------------- */
const STANDINGS = [
  { t: "mfc",       j: 6, v: 5, e: 0, d: 1, gp: 15, gc: 6,  f: "WWWWW" },
  { t: "desola",    j: 6, v: 4, e: 1, d: 1, gp: 13, gc: 7,  f: "WDWWW" },
  { t: "leoes",     j: 6, v: 3, e: 2, d: 1, gp: 11, gc: 8,  f: "LWDWW" },
  { t: "ventura",   j: 6, v: 3, e: 1, d: 2, gp: 10, gc: 8,  f: "WLWDW" },
  { t: "aurora",    j: 6, v: 3, e: 0, d: 3, gp: 9,  gc: 10, f: "WWLLW" },
  { t: "solaris",   j: 6, v: 2, e: 2, d: 2, gp: 8,  gc: 8,  f: "DWLDL" },
  { t: "ipe",       j: 6, v: 2, e: 1, d: 3, gp: 7,  gc: 9,  f: "LDLWL" },
  { t: "castelo",   j: 6, v: 1, e: 2, d: 3, gp: 8,  gc: 11, f: "DLLWD" },
  { t: "tupinamba", j: 6, v: 1, e: 2, d: 3, gp: 5,  gc: 9,  f: "LDWLD" },
  { t: "setelagos", j: 6, v: 0, e: 1, d: 5, gp: 3,  gc: 13, f: "LLDLL" },
];

/* ---------------- Instagram (sem back-end) ----------------
   Cole aqui links de publicações do @meldinafc para exibi-las com o embed
   oficial do Instagram quando o feed automático (/api/instagram) não estiver
   configurado. Ex.: "https://www.instagram.com/p/XXXXXXXXXXX/" */
const INSTAGRAM_POSTS = [];

/* ---------------- Sala de troféus ---------------- */
/* n = número de títulos; temporadas = edição do jogo e temporada de cada conquista */
const TROPHIES = [
  { titulo: "Primeira Divisão", comp: "Pro Clubs", sigla: "1ª", n: 10,
    temporadas: ["FIFA 21 · 2020/21 — 3×", "FIFA 23 · 2022/23 — 7×"],
    desc: "A maior marca da história do clube. Tricampeão da primeira divisão no FIFA 21 e, duas temporadas depois, uma sequência histórica de sete títulos no FIFA 23." },
  { titulo: "Copa EA", comp: "Pro Clubs", sigla: "EA", n: 1,
    temporadas: ["FIFA 19 · 2018/19"],
    desc: "A primeira taça da história do Meldina, conquistada na segunda temporada do clube." },
  { titulo: "Segunda Divisão", comp: "Pro Clubs", sigla: "2ª", n: 1, link: "campeao-serie-b",
    temporadas: ["FC 25 · 2025"],
    desc: "O título da reconstrução. Com a nova geração formada em 2024, o Meldina venceu a Segunda Divisão e garantiu o retorno à elite em 2026." },
];

/* Linha do tempo do clube, por edição do jogo */
const HISTORY = [
  { ano: "2017", jogo: "FIFA 18", titulo: "A fundação", texto: "Na temporada 2017/18 nasce o Meldina Futebol Clube: um grupo de amigos, um escudo com coroa e monograma e as cores grená, ouro e marinho." },
  { ano: "2019", jogo: "FIFA 19", titulo: "Campeão da Copa EA", texto: "Na segunda temporada, a primeira taça: o Meldina conquista a Copa EA e passa a ser respeitado no cenário do Pro Clubs." },
  { ano: "2021", jogo: "FIFA 21", titulo: "Tricampeão da primeira divisão", texto: "Três títulos da primeira divisão em uma única edição. O Meldina se firma entre os grandes." },
  { ano: "2023", jogo: "FIFA 23", titulo: "Sete vezes campeão", texto: "A era de ouro: sete títulos da primeira divisão no FIFA 23, a maior sequência da história do clube. São 10 títulos da elite no total." },
  { ano: "2024", jogo: "FC 24", titulo: "Novo sistema, nova geração", texto: "A EA troca as temporadas com troféus por um campeonato contínuo, sem início nem fim. O Meldina se reinventa: uma nova geração assume o elenco e o clube recomeça na Segunda Divisão." },
  { ano: "2025", jogo: "FC 25", titulo: "Campeão da Segunda Divisão", texto: "Pelo acesso, o Meldina supera os playoffs e conquista a Segunda Divisão — o título que marca o retorno do clube à elite." },
  { ano: "2026", jogo: "FC 26", titulo: "De volta à primeira divisão", texto: "O Meldina volta à Série A. Depois da derrota na estreia, cinco vitórias seguidas e a liderança. Em setembro, a presidência apresenta o lema oficial: Muito além do jogo." },
];

/* ---------------- Notícias ----------------
   poster: true = arte do Instagram (4:5) exibida inteira na página da notícia */
const NEWS = [
  {
    id: "hoje-tem-meldina-tupinamba", tag: "Futebol", data: "2026-10-06", img: "news/kiki-tunel.jpg", pos: "center 15%", poster: true,
    titulo: "Hoje tem Meldina: líder recebe o Tupinambá na Lovebomb Arena, com a nuFUT no peito",
    resumo: "Terça-feira, 22h, pela 7ª rodada da Série A. Pela primeira vez, a camisa I entra em campo com a marca da nova patrocinadora.",
    corpo: [
      "É dia de jogo na Lovebomb Arena. Nesta terça-feira, 6 de outubro, às 22h, o Meldina FC recebe o Tupinambá EC pela 7ª rodada da Série A do Pro Clubs.",
      "O líder chega embalado por cinco vitórias seguidas e com a defesa como uma das armas da campanha. Do outro lado, o Tupinambá tenta se afastar da parte de baixo da tabela.",
      "A noite também marca um momento especial fora das quatro linhas: pela primeira vez, a camisa I entra em campo com a marca da nuFUT, nova patrocinadora do clube, estampada no peito. Coube a Kiki puxar a fila no túnel em direção ao gramado.",
      "QUOTE:Toda vez que a gente sai desse túnel é a mesma coisa: a torcida, a camisa, o peso da coroa. Hoje não vai ser diferente.|Kiki, lateral-direito do Meldina FC",
      "A comissão técnica de Celso Roth deve manter a base da equipe que vem vencendo. Os portões da Lovebomb Arena abrem às 20h, e membros do Clube Meldina têm prioridade e desconto nos ingressos. Muito além do jogo. Vamo Meldina!",
    ],
  },

  {
    id: "celso-classico", tag: "Futebol", data: "2026-09-25", img: "news/quotes-celso-2.jpg", pos: "center top", poster: true,
    titulo: "Celso Roth sobre a liderança: “O time está unido, e a intenção é continuar assim”",
    resumo: "Técnico falou sobre a sequência de cinco vitórias, o peso da liderança na Série A e a importância de manter o elenco que conquistou a Segunda Divisão.",
    corpo: [
      "Com cinco vitórias seguidas e a liderança da Série A do Pro Clubs, o Meldina viveu uma semana de trabalho tranquilo na Lovebomb Arena. Em entrevista coletiva, o técnico Celso Roth falou sobre o momento da equipe.",
      "Depois da derrota na estreia, o time reagiu rápido e chegou à ponta da tabela. Para o treinador, a virada de chave foi coletiva. “Não precisamos reinventar nada. Precisamos ser quem somos”, disse.",
      "QUOTE:O time está unido, e a intenção é continuar assim.|Celso Roth, técnico do Meldina FC",
      "Celso lembrou que o grupo atual é praticamente o mesmo que conquistou a Segunda Divisão em 2025 e pediu pés no chão. “A tabela só vale no fim. Estamos felizes, mas a Série A não perdoa. Cada jogo é uma final.”",
      "Membros do Clube Meldina têm prioridade e desconto na compra de ingressos para os próximos jogos em casa. Vamo Meldina!",
    ],
  },

  {
    id: "nota-presidencia", tag: "Nota oficial", data: "2026-09-24", img: "news/story-meldina-alem-do-jogo.jpg", pos: "center 30%", poster: true,
    titulo: "Nota oficial da Presidência: Meldina FC adota o lema “Muito além do jogo”",
    resumo: "O presidente André Almeida se manifestou sobre a polêmica envolvendo o lema anterior e apresentou o novo lema oficial do clube.",
    corpo: [
      "NOTA OFICIAL DA PRESIDÊNCIA",
      "A presidência do Meldina FC vem a público se manifestar sobre a recente polêmica envolvendo o lema “Ninguém é maior que o Meldina”.",
      "A frase foi criada com a intenção de representar a força, a união e o orgulho de vestir a camisa do Meldina. No entanto, reconhecemos que sua interpretação poderia colocar o clube em uma posição que não representa os valores que queremos defender.",
      "O Meldina é um clube cristão. Nossa fé faz parte da nossa identidade e, acima de qualquer resultado, competição ou instituição, reconhecemos a soberania de Deus.",
      "Por isso, reconhecemos o erro na escolha do lema e respeitamos os questionamentos feitos por nossos torcedores.",
      "O futebol é o que nos coloca em campo. Mas o Meldina representa algo maior.",
      "Representa as amizades construídas, a união do elenco, a torcida, as histórias que vivemos juntos e os valores que carregamos dentro e fora das partidas.",
      "QUOTE:Por isso, a partir de hoje, o Meldina FC passa a ter um novo lema: MUITO ALÉM DO JOGO.|André Almeida, presidente do Meldina FC",
      "Porque o Meldina não se resume ao resultado de uma partida. Não somos apenas 90 minutos, uma vitória, uma derrota ou uma tabela. Somos muito além do jogo.",
      "Agradecemos aos torcedores que questionaram, cobraram e nos fizeram refletir sobre aquilo que queremos que o Meldina represente.",
      "O clube reconhece seu erro, aprende com ele e segue em frente. Mais unidos. Mais conscientes. E sempre muito além do jogo.",
      "SIGN:Atenciosamente,|André Almeida|Presidente do Meldina FC",
    ],
  },
  {
    id: "nufut", tag: "Clube", data: "2026-09-22", img: "news/patrocinador.jpg", pos: "center 40%", poster: true,
    titulo: "Novo patrocinador: nuFUT é a nova parceira oficial do Meldina FC",
    resumo: "O game de futebol chega ao clube para a sequência da Série A, com ações para a torcida e conteúdos especiais na Meldina TV.",
    corpo: [
      "O Meldina FC tem um novo patrocinador: a nuFUT, game de futebol que passa a estampar sua marca nos canais oficiais do clube a partir da 7ª rodada da Série A.",
      "A parceria prevê ações exclusivas para membros do Clube Meldina, conteúdos especiais na Meldina TV e ativações em dias de jogo na Lovebomb Arena.",
      "QUOTE:A nuFUT nasceu para quem vive o futebol muito além do jogo. Não existe parceiro mais natural do que o Meldina.|nuFUT",
      "O acordo se soma à parceria com a Lider, fornecedora oficial de material esportivo, e reforça o crescimento do clube dentro e fora de campo. Vamo Meldina!",
    ],
  },

  {
    id: "vitoria-sete-lagos", tag: "Futebol", data: "2026-09-21", img: "news/escalacao-carrijo.jpg", pos: "center top", poster: true,
    titulo: "Adiado para segunda, jogo contra o Sete Lagos termina em 3 a 0 e Meldina segue líder",
    resumo: "Transferida de domingo para segunda-feira, a partida da 6ª rodada teve casa cheia, a camisa II em campo e a quinta vitória seguida.",
    corpo: [
      "Depois de uma semana de expectativa — e de um fim de semana de interrogações, com a partida transferida de domingo para segunda-feira —, o Meldina recebeu o Sete Lagos EC na Lovebomb Arena e venceu por 3 a 0.",
      "Com a nova camisa II, o time controlou o jogo do início ao fim. Almeida abriu o placar no primeiro tempo, Caio ampliou após jogada de Carrijo e Kristhian fechou a conta em chute de fora da área.",
      "Foi a primeira partida sem sofrer gols de Muralha na Série A e a quinta vitória seguida do Meldina, que mantém a liderança isolada com 15 pontos.",
      "QUOTE:Cinco vitórias seguidas não caem do céu. É trabalho, é grupo. Agora é seguir.|Almeida, capitão do Meldina FC",
    ],
  },
  {
    id: "meldcast-12", tag: "Meldina TV", data: "2026-09-21", img: "players/caio-7.jpg",
    titulo: "Meldcast #12: Caio abre o jogo sobre a boa fase e os bastidores do vestiário",
    resumo: "No novo episódio do podcast oficial, o camisa 7 fala sobre a sequência de vitórias, a relação com a torcida e as metas para a temporada.",
    corpo: [
      "O Meldcast, podcast oficial do Meldina FC, está de volta com o episódio 12. O convidado da vez é Caio, o marrento mais querido do elenco, que vive grande fase com dois gols e três assistências na temporada — e ainda conta qual livro está lendo agora.",
      "Na conversa, o camisa 7 relembra os primeiros treinos no clube, comenta a jogada do segundo gol contra o Aurora e revela quem é o jogador mais engraçado do elenco — spoiler: a disputa é acirrada.",
      "O episódio completo está disponível no canal Meldina TV, no YouTube. Inscreva-se e ative as notificações para não perder os próximos episódios do Meldcast e do MFC News.",
    ],
  },
  {
    id: "socio-marca", tag: "Clube", data: "2026-09-19", img: "players/gaab-12.jpg",
    titulo: "Clube Meldina bate recorde e ultrapassa a marca de mil membros",
    resumo: "Programa oficial de sócios cresce a cada rodada. Planos Coroa, Realeza e Majestade garantem prioridade em ingressos e descontos na loja.",
    corpo: [
      "O Clube Meldina, programa oficial de sócios, atingiu uma marca histórica: mais de mil torcedores associados. O crescimento acompanha a campanha do time, líder da Série A.",
      "Os membros têm prioridade na compra de ingressos, descontos exclusivos na Loja Oficial, acesso a conteúdos da Meldina TV antes de todo mundo e experiências como visitas ao vestiário em dias de jogo.",
      "Para fazer parte, basta escolher um dos planos — Coroa, Realeza ou Majestade — na página do Clube Meldina.",
    ],
  },
  {
    id: "vitoria-aurora", tag: "Futebol", data: "2026-09-18", img: "players/almeida-9.jpg",
    titulo: "Almeida marca duas vezes e Meldina vence o Aurora para seguir na liderança",
    resumo: "Diante da torcida na Lovebomb Arena, o Meldina venceu por 3 a 1 e chegou à quarta vitória seguida na Série A.",
    corpo: [
      "A Lovebomb Arena viu mais uma atuação segura do líder da Série A do Pro Clubs. Nesta sexta-feira, o Meldina FC venceu o Aurora EC por 3 a 1, pela 5ª rodada, e chegou a 12 pontos.",
      "O primeiro gol saiu aos 12 minutos: Carrijo cobrou escanteio fechado e Almeida, antecipando-se à zaga, desviou de cabeça. O Aurora empatou ainda na primeira etapa, mas o time grená voltou do intervalo com outra postura.",
      "Aos 9 do segundo tempo, Caio arrancou pela direita, deixou dois marcadores para trás e serviu Almeida, que apenas empurrou para as redes. Já nos acréscimos, Carrijo fechou a conta em cobrança de falta no ângulo.",
      "QUOTE:Jogar em casa, com essa torcida cantando o tempo todo, muda tudo. O grupo está fechado e sabe o que quer.|Almeida, capitão do Meldina FC",
      "O Meldina volta a campo contra o Sete Lagos EC, novamente na Lovebomb Arena.",
    ],
  },
  {
    id: "vitoria-ventura", tag: "Futebol", data: "2026-09-13", img: "players/kristhian-87.jpg",
    titulo: "Kristhian decide e Meldina vira sobre o Real Ventura fora de casa",
    resumo: "Em jogo tenso no Estádio Ventura, o camisa 87 marcou o gol da virada aos 38 do segundo tempo.",
    corpo: [
      "Fora de casa e atrás no placar, o Meldina mostrou força para buscar a virada sobre o Real Ventura por 2 a 1, pela 4ª rodada da Série A.",
      "Almeida empatou no início do segundo tempo e, aos 38 minutos, Kristhian recebeu pela esquerda, cortou para dentro e bateu colocado no canto — um gol que já está entre os mais bonitos da temporada.",
      "Com o resultado, o time grená chegou à terceira vitória seguida e assumiu a liderança da competição.",
    ],
  },
  {
    id: "ele-fica", tag: "Clube", data: "2026-09-12", img: "news/ele-fica.jpg", pos: "center top", poster: true,
    titulo: "Ele fica! Guigs renova contrato com o Meldina FC",
    resumo: "Dúvida durante a semana do último playoff, o volante camisa 18 apareceu para a decisão, jogou e acertou a renovação logo após a partida.",
    corpo: [
      "Foi uma semana de incerteza na Lovebomb Arena. Com o contrato perto do fim e sem uma resposta definitiva sobre o futuro, Guigs era um ponto de interrogação para o último playoff do ano — e para a sequência da temporada.",
      "Na sexta-feira, 11 de setembro, a dúvida começou a ser respondida da melhor forma: o volante apareceu, foi relacionado e entrou em campo ao lado de Rafael, formando a dupla que dá equilíbrio ao meio-campo do Meldina.",
      "Logo após a partida, o clube e o jogador selaram o acordo. Guigs renovou seu vínculo e segue vestindo a camisa 18.",
      "QUOTE:Nunca foi sobre sair. Era sobre ter certeza. E eu tenho: meu lugar é aqui.|Guigs, volante do Meldina FC",
      "Ele fica! Muito além do jogo.",
    ],
  },
  {
    id: "ultimo-playoff", tag: "Futebol", data: "2026-09-11", img: "news/ultimo-playoff.jpg", pos: "center top", poster: true,
    titulo: "Hoje tem Meldina: é dia do último playoff do ano na Lovebomb Arena",
    resumo: "Sexta-feira, 22h. Depois de tudo o que aconteceu no playoff anterior, o Meldina entra em campo para a última decisão do ano.",
    corpo: [
      "Chegou o dia. Nesta sexta-feira, 11 de setembro, às 22h, o Meldina FC entra em campo na Lovebomb Arena para o último playoff do ano — o jogo mais esperado da temporada pela torcida grená.",
      "A partida carrega um peso especial. No playoff anterior, o time teve três de seus cinco jogadores retirados no meio do jogo por uma verificação de idade da EA, perdeu a vantagem que tinha construído e saiu derrotado. O clube se manifestou em nota oficial, e o elenco prometeu dar a resposta dentro de campo.",
      "A semana também foi de expectativa fora das quatro linhas: Guigs, dúvida até os últimos dias, confirmou presença. O clube ainda apresentou o editorial Meldina Magazine, com as camisas I e II da temporada.",
      "QUOTE:Hoje vamos deixar nossos corações em campo.|Kiki, lateral-direito do Meldina FC",
      "Os portões abrem às 20h. A orientação é chegar cedo, vestir grená — ou branco — e empurrar o time do primeiro ao último minuto. Hoje tem Meldina!",
    ],
  },
  {
    id: "kiki-coracoes", tag: "Futebol", data: "2026-09-11", img: "news/quotes-kiki.jpg", pos: "center top", poster: true,
    titulo: "Kiki convoca a torcida para o último playoff: “Hoje vamos deixar nossos corações em campo”",
    resumo: "Lateral-direito falou horas antes da decisão sobre a resposta que o elenco quer dar depois da derrota no playoff anterior.",
    corpo: [
      "Horas antes do último playoff do ano, o lateral-direito Kiki resumiu o sentimento do vestiário. Depois da derrota polêmica no jogo anterior, o elenco quer transformar a revolta em entrega.",
      "QUOTE:Hoje vamos deixar nossos corações em campo.|Kiki, lateral-direito do Meldina FC",
      "No Meldina desde 2024, Kiki é um dos jogadores mais queridos do elenco e uma das vozes do grupo nos jogos grandes. “A gente sabe o que aconteceu no último jogo. Não dá para mudar. O que dá é fazer diferente hoje”, completou.",
      "A bola rola às 22h, na Lovebomb Arena.",
    ],
  },
  {
    id: "meldina-magazine", tag: "Clube", data: "2026-09-11", img: "news/meldina-magazine.jpg", pos: "center top", poster: true,
    titulo: "Meldina Magazine: editorial apresenta as camisas I e II da temporada",
    resumo: "Em clima de revista de moda, o clube apresentou os uniformes 2026 da Lider com os próprios jogadores como modelos. A coroa pesa.",
    corpo: [
      "No dia do último playoff do ano, o Meldina FC lançou o Meldina Magazine, editorial que apresenta os uniformes da temporada 2026 com os próprios atletas como modelos.",
      "A capa grená traz a camisa I, com gola em ouro, textura exclusiva e punhos em marinho. A segunda edição apresenta a camisa II, branca, com gola transpassada e acabamentos em grená e dourado — a novidade da temporada.",
      "IMG:news/meldina-magazine-2.jpg|Meldina Magazine — camisa II 2026",
      "As duas camisas estão à venda na Loja Oficial, com 15% de desconto para membros do Clube Meldina.",
    ],
  },
  {
    id: "carrijo-desculpas", tag: "Futebol", data: "2026-09-09", img: "news/quotes-carrijo.jpg", pos: "center top", poster: true,
    titulo: "Carrijo responde em campo e pede desculpas à torcida: “O Meldina é maior do que a gente”",
    resumo: "Depois de uma declaração ofensiva à torcida, o camisa 10 marcou em dois jogos seguidos, foi decisivo e se retratou publicamente.",
    corpo: [
      "Foram dias difíceis para Carrijo. No dia 4 de setembro, questionado sobre sua ausência nos jogos anteriores, o camisa 10 respondeu aos torcedores com uma declaração ofensiva, que gerou revolta nas arquibancadas e também dentro do elenco.",
      "O jogador baixou a cabeça e deixou o futebol falar. Contra os Leões da Serra, marcou e ajudou na vitória por 3 a 1. Fora de casa, contra o Castelo AC, voltou a balançar as redes e distribuiu passes decisivos no triunfo por 3 a 1.",
      "Depois da partida, Carrijo fez questão de se dirigir à torcida e pedir desculpas publicamente.",
      "QUOTE:O Meldina é maior do que a gente.|Carrijo, camisa 10 do Meldina FC",
      "O clube considera o episódio encerrado. Muito além do jogo, o Meldina é feito de pessoas — e pessoas erram, reconhecem e seguem em frente juntas.",
    ],
  },
  {
    id: "nota-ea", tag: "Nota oficial", data: "2026-09-04", img: "news/nota-oficial.jpg", pos: "center 30%", poster: true,
    titulo: "Nota oficial: Meldina FC envia ofício à EA Sports após interrupção de playoff",
    resumo: "Três dos cinco atletas do Meldina foram retirados no meio da partida para uma “verificação de idade”. O clube cobra providências e propõe medidas.",
    corpo: [
      "O Meldina FC enviou, nesta sexta-feira (4), um ofício ao Presidente do Comitê Disciplinar da EA Sports, e ao Diretor de Integridade e Fair Play Digital, solicitando que sejam tomadas providências imediatas com base em relatórios independentes emitidos por uma respeitada empresa de auditoria de servidores e detecção de manipulação algorítmica que prepara rotineiramente avaliações de código-fonte e interferência em partidas de EA FC, relatórios para órgãos desportivos e como testemunha especializada em questões perante os tribunais. O ofício é apoiado por uma análise completa da conduta do sistema e da engine da partida no impactante playoff de acesso à divisão de Elite.",
      "O Meldina também sugeriu a intervenção da desenvolvedora para a elaboração de propostas e a adoção de medidas efetivas voltadas à melhoria e ao desenvolvimento do esporte e do cenário competitivo:",
      "LIST:Regulamentação e auditoria transparente do sistema de “verificação de idade” e expulsões arbitrárias de atletas virtuais em partidas oficiais;|Obrigatoriedade de que qualquer procedimento de verificação de idade ou checagem de cadastro seja realizado exclusivamente após o término da partida, sendo terminantemente proibida a interrupção ou retirada de atletas durante o tempo regulamentar e acréscimos;|O acompanhamento técnico-científico dos lances, bugs de conexão e indicadores estatísticos das partidas de futebol, com a contratação de empresas de auditoria independente, especializadas na análise de dados de servidores;|Transparência nos algoritmos de acréscimo e balanceamento de gameplay para partidas profissionais; além de outras medidas que venham a ser indicadas.",
      "O Meldina reforça que envidará os maiores esforços no sentido de apurar os fatos narrados e contribuir para a evolução do cenário competitivo, inclusive acionando a Justiça Comum, após esgotadas as instâncias da Justiça Desportiva.",
      "SIGN:Assessoria de Comunicação|Meldina Futebol Clube",
    ],
  },
  {
    id: "celso-estreia", tag: "Futebol", data: "2026-09-02", img: "news/quotes-celso.jpg", pos: "center top", poster: true,
    titulo: "Celso Roth após derrota na estreia da Série A: “Não foi a melhor estreia”",
    resumo: "O Meldina perdeu para o Ipê FC por 2 a 1 na Lovebomb Arena. O técnico reconheceu a atuação abaixo, mas garantiu que o grupo vai reagir.",
    corpo: [
      "A estreia do Meldina FC na elite não saiu como a torcida sonhava. Na noite de terça-feira, 1º de setembro, o time foi superado pelo Ipê FC por 2 a 1, na Lovebomb Arena, pela 1ª rodada da Série A do Pro Clubs.",
      "Na entrevista coletiva, o técnico Celso Roth não fugiu da responsabilidade.",
      "QUOTE:Não foi a melhor estreia.|Celso Roth, técnico do Meldina FC",
      "O treinador lembrou que o grupo é o mesmo que conquistou a Segunda Divisão em 2025 e pediu paciência. “A Série A tem outro ritmo. Vamos corrigir, vamos trabalhar. Esse time já mostrou do que é capaz e vai mostrar de novo.”",
      "A resposta veio rápido: depois da derrota, o Meldina não perdeu mais na Série A e emendou cinco vitórias seguidas até a liderança.",
    ],
  },
  {
    id: "rafael-passes", tag: "Futebol", data: "2026-09-02", img: "news/quotes-guigs.jpg", pos: "center top", poster: true,
    titulo: "91% de acerto: os números que explicam a importância de Rafael no meio-campo",
    resumo: "Após críticas às notas do volante na estreia, Guigs saiu em defesa do companheiro: “O que o Rafael faz pelo time é indispensável”.",
    corpo: [
      "Nem sempre o protagonista aparece nos melhores momentos da rodada. No Meldina, boa parte do controle das partidas passa pelos pés de Rafael, volante camisa 21.",
      "Depois da estreia na Série A, a nota de Rafael na partida virou assunto entre os torcedores. Quem saiu em defesa do volante foi o companheiro de setor, Guigs.",
      "QUOTE:As notas são apenas números. O que o Rafael faz pelo time é indispensável.|Guigs, volante do Meldina FC",
      "Os números, aliás, também estão do lado de Rafael: na campanha do título da Segunda Divisão, ele acertou 91% dos passes tentados — o maior índice do elenco — e foi o segundo jogador com mais recuperações de bola, atrás apenas do zagueiro Gaab.",
      "A comissão técnica destaca a leitura de jogo do volante, capaz de antecipar as jogadas adversárias e iniciar os contra-ataques com um único toque. Ao lado de Guigs, forma a dupla que dá equilíbrio ao Meldina.",
    ],
  },
  {
    id: "camisa-2026", tag: "Clube", data: "2026-08-30", img: "img/camisa-2.jpg", pos: "center 30%", poster: true,
    titulo: "A coroa pesa: Meldina e Lider lançam a nova camisa II",
    resumo: "Branca, com gola e punhos em grená e ouro, a nova camisa II chega para a estreia do Meldina na Série A do Pro Clubs.",
    corpo: [
      "A coroa pesa — e agora ela também veste branco. O Meldina FC e a Lider, fornecedora oficial de material esportivo do clube, apresentaram a nova camisa II, que o time usará na temporada 2026 da Série A do Pro Clubs.",
      "A peça é branca, com gola transpassada em grená e dourado, faixas grená nos ombros e punhos com o mesmo acabamento. O escudo aparece em versão monocromática grená, bordado do lado do coração, reforçando a elegância que o clube quer levar para a elite.",
      "A nova camisa se junta à camisa I grená, que segue como o uniforme principal da equipe.",
      "QUOTE:Queríamos uma camisa à altura do momento do clube. Somos campeões da Segunda Divisão e chegamos à elite: a coroa pesa.|Departamento de Marketing do Meldina FC",
      "A camisa II já está à venda na Loja Oficial, em versões torcedor e jogador, com personalização de nome e número. Membros do Clube Meldina têm 15% de desconto.",
    ],
  },
  {
    id: "campeao-serie-b", tag: "Clube", data: "2025-12-14", img: "news/pelo-acesso.jpg", pos: "center 25%", poster: true,
    titulo: "Campeão! Meldina conquista a Segunda Divisão e garante a volta à elite do Pro Clubs",
    resumo: "Título da reconstrução coroa a nova geração do clube. Em 2026, o Meldina volta a jogar a primeira divisão.",
    corpo: [
      "Está escrito na história: o Meldina FC é campeão da Segunda Divisão do Pro Clubs. Com a nova geração que assumiu o elenco em 2024, o clube conquistou o título e garantiu a volta à primeira divisão — onde já foi campeão dez vezes.",
      "A campanha foi construída com uma defesa sólida, um ataque decisivo e, principalmente, um grupo fechado. Pelo acesso, o time superou os playoffs e confirmou a taça diante da torcida.",
      "A taça da Segunda Divisão se junta à Copa EA e aos dez títulos da primeira divisão na sala de troféus. Em 2026, o desafio é reencontrar a glória na elite. Muito além do jogo. Meldina pra sempre.",
    ],
  },
];

/* ---------------- Meldina TV ---------------- */
const VIDEOS = [
  { show: "Meldcast", ep: "Episódio 12", img: "players/caio-7.jpg", titulo: "Meldcast #12 — Caio: “O grupo sabe o que quer”", dur: "48:21", meta: "Meldina TV · há 4 dias" },
  { show: "MFC News", ep: "Melhores momentos", img: "players/almeida-9.jpg", titulo: "Meldina 3 x 0 Sete Lagos EC | Melhores momentos | Pro Clubs Série A", dur: "06:12", meta: "Meldina TV · há 4 dias" },
  { show: "MFC News", ep: "Bastidores", img: "players/kiki-2.jpg", titulo: "Bastidores da sessão de fotos da temporada 2026", dur: "09:47", meta: "Meldina TV · há 1 semana" },
  { show: "Meldcast", ep: "Episódio 11", img: "players/muralha-1.jpg", titulo: "Meldcast #11 — Muralha e a arte de defender pênaltis", dur: "52:05", meta: "Meldina TV · há 2 semanas" },
  { show: "MFC News", ep: "Gols da rodada", img: "players/kristhian-87.jpg", titulo: "O golaço de Kristhian contra o Real Ventura em todos os ângulos", dur: "03:28", meta: "Meldina TV · há 2 semanas" },
  { show: "MFC News", ep: "Uniformes 2026", img: "players/lacerda-78.jpg", titulo: "Lançamento oficial | Camisa II 2026 “A coroa pesa” | Meldina x Lider", dur: "04:55", meta: "Meldina TV · há 3 semanas" },
];

/* ---------------- Loja ---------------- */
const PRODUCTS = [
  { id: "camisa2", cat: "Camisas 2026", nome: "Camisa II Meldina 2026 Torcedor", preco: 249.9, img: "img/camisa-2-loja.jpg", badge: "Lançamento", tam: true },
  { id: "camisa2j", cat: "Camisas 2026", nome: "Camisa II Meldina 2026 Jogador", preco: 349.9, img: "img/camisa-2-loja.jpg", badge: "Lançamento", tam: true },
  { id: "camisa1", cat: "Camisas 2026", nome: "Camisa I Meldina 2026 Torcedor", preco: 249.9, img: "img/camisa-1.jpg", tam: true },
  { id: "camisa1j", cat: "Camisas 2026", nome: "Camisa I Meldina 2026 Jogador", preco: 349.9, img: "img/camisa-1.jpg", tam: true },
  { id: "bone", cat: "Acessórios", nome: "Boné Aba Curva Monograma", preco: 119.9, img: "img/produto-bone.jpg", badge: "Novo" },
  { id: "cachecol", cat: "Acessórios", nome: "Cachecol Oficial Meldina FC", preco: 89.9, img: "img/produto-cachecol.jpg", badge: "Novo" },
  { id: "caneca", cat: "Casa", nome: "Caneca Escudo Oficial 350ml", preco: 59.9, img: "img/produto-caneca.jpg", badge: "Novo" },
  { id: "flamula", cat: "Casa", nome: "Flâmula Oficial Meldina FC 2024", preco: 69.9, img: "img/produto-flamula.png", badge: "Novo" },
  { id: "chaveiro", cat: "Acessórios", nome: "Chaveiro Metal Escudo", preco: 34.9, img: "img/produto-chaveiro.jpg", badge: "Novo" },
  { id: "necessaire", cat: "Acessórios", nome: "Necessaire Oficial Meldina FC", preco: 134.9, img: "img/produto-necessaire.jpg", badge: "Novo" },
];
