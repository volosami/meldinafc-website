export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  group: string;
  photoUrl: string;
  preferredFoot: string;
  joinedYear: number;
  matches: number;
  goals: number;
  assists: number;
  extraKey?: string | null;
  extraValue?: string | null;
  bio: string;
  isCaptain?: boolean;
  roleTitle?: string | null;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  logoUrl?: string | null;
  color1?: string | null;
  color2?: string | null;
  shape?: string | null;
  isUs?: boolean;
  isRival?: boolean;
}

export interface Fixture {
  id: string;
  matchDate: string;
  competition: string;
  round: string;
  isHome: boolean;
  opponentId: string;
  opponent?: Team;
  homeScore?: number | null;
  awayScore?: number | null;
  venue?: string | null;
  newsId?: string | null;
  isNext?: boolean;
}

export interface Standing {
  teamId: string;
  team?: Team;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  form: string;
  points?: number;
  goalDiff?: number;
  position?: number;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  imageUrl?: string | null;
  publishedAt: string;
  author: string;
  isFeatured: boolean;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  plan: "BRONZE" | "PRATA" | "OURO";
  status: "PENDING" | "ACTIVE" | "CANCELLED";
  paymentMethod: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  isArt?: boolean;
  badge?: string;
  sizes?: string[];
  desc?: string;
}

export interface CartItem {
  product: Product;
  size?: string;
  quantity: number;
}
