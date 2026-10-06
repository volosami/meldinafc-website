import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Member } from "../../types";

export const AdminSocios: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [filterPlan, setFilterPlan] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    async function load() {
      const data = await api.getMembers();
      setMembers(data);
    }
    load();
  }, []);

  const filtered = members.filter((m) => {
    const matchPlan = filterPlan === "TODOS" || m.plan === filterPlan;
    const matchSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cpf.includes(searchTerm);
    return matchPlan && matchSearch;
  });

  const exportCSV = () => {
    const headers = ["ID", "Nome", "Email", "CPF", "Telefone", "Plano", "Status", "Data Cadastro"];
    const rows = filtered.map((m) => [
      m.id,
      `"${m.name}"`,
      m.email,
      `"${m.cpf}"`,
      `"${m.phone}"`,
      m.plan,
      m.status,
      new Date(m.createdAt).toLocaleDateString("pt-BR"),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `socios_meldina_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white">Sócios-Torcedores</h1>
          <p className="text-sm text-gray-400 mt-1">Gerencie a base de associados do Clube Meldina.</p>
        </div>
        <button onClick={exportCSV} className="btn btn--sm btn--ghost text-xs">
          📥 Exportar Base CSV
        </button>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-noite p-6 rounded-lg border border-linha-escura flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-linha-escura p-3 rounded text-sm text-white focus:outline-none focus:border-ouro"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          {["TODOS", "OURO", "PRATA", "BRONZE"].map((plan) => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors ${
                filterPlan === plan
                  ? "bg-ouro text-noite"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* TABELA DE SÓCIOS */}
      <div className="bg-noite rounded-lg border border-linha-escura overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-xs text-ouro uppercase font-bold border-b border-linha-escura">
            <tr>
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">CPF / Telefone</th>
              <th className="p-4">Plano</th>
              <th className="p-4">Status</th>
              <th className="p-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linha-escura">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Nenhum sócio encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              filtered.map((m) => (
                <tr key={m.id} className="hover:bg-white/5">
                  <td className="p-4 font-semibold text-white">{m.name}</td>
                  <td className="p-4">{m.email}</td>
                  <td className="p-4 font-mono text-xs">
                    {m.cpf}<br /><span className="text-gray-500">{m.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                      m.plan === "OURO" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" :
                      m.plan === "PRATA" ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                      "bg-amber-800/20 text-amber-500 border border-amber-800/30"
                    }`}>
                      {m.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs bg-green-900/40 text-green-300 px-2 py-1 rounded border border-green-500/30 font-semibold">
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-gray-400">
                    {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
