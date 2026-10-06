import React from "react";
import { Link } from "react-router-dom";
import { MFC_INFO } from "../../data/staticData";

export const Footer: React.FC = () => {
  return (
    <footer className="footer bg-noite border-t border-linha-escura pt-16 pb-12">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Coluna 1: Identidade */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/img/escudo.png" alt="Meldina FC" className="h-14 w-auto" />
              <div>
                <span className="font-display text-2xl uppercase tracking-wider block">Meldina FC</span>
                <span className="font-regal text-xs text-ouro tracking-widest font-bold">Fundado em {MFC_INFO.fundacao}</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              O clube de futebol mais apaixonante do Pro Clubs. Campeão da Série B 2025 e em busca da glória na elite.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h4 className="font-regal text-ouro text-xs tracking-widest uppercase font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/clube" className="hover:text-ouro transition-colors">História & Diretoria</Link></li>
              <li><Link to="/elenco" className="hover:text-ouro transition-colors">Elenco Profissional</Link></li>
              <li><Link to="/jogos" className="hover:text-ouro transition-colors">Calendário & Tabela</Link></li>
              <li><Link to="/noticias" className="hover:text-ouro transition-colors">Notícias do Clube</Link></li>
              <li><Link to="/tv" className="hover:text-ouro transition-colors">Meldina TV</Link></li>
              <li><Link to="/loja" className="hover:text-ouro transition-colors">Loja Oficial</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Sócio & Ingressos */}
          <div>
            <h4 className="font-regal text-ouro text-xs tracking-widest uppercase font-bold mb-4">Torcedor</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/socio" className="hover:text-ouro transition-colors">Clube Meldina (Sócio)</Link></li>
              <li><a href={MFC_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-ouro transition-colors">Instagram Oficial</a></li>
              <li><a href={MFC_INFO.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-ouro transition-colors">Transmissões ao Vivo</a></li>
              <li><Link to="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors">Área da Diretoria</Link></li>
            </ul>
          </div>

          {/* Coluna 4: Patrocínio */}
          <div>
            <h4 className="font-regal text-ouro text-xs tracking-widest uppercase font-bold mb-4">Patrocinador Master</h4>
            <div className="bg-white/5 border border-linha-escura p-4 rounded text-center">
              <span className="font-display text-2xl text-ouro tracking-wider block">NuFut</span>
              <span className="text-xs text-gray-400">Parceiro Oficial de Tecnologia & Finanças</span>
            </div>
            <p className="font-serif italic text-sm text-gray-400 mt-4 text-center">
              "{MFC_INFO.lema}"
            </p>
          </div>
        </div>

        <div className="border-t border-linha-escura pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {MFC_INFO.temporada} Meldina Futebol Clube. Todos os direitos reservados.</p>
          <p>Desenvolvido com excelência para a torcida grená e ouro.</p>
        </div>
      </div>
    </footer>
  );
};
