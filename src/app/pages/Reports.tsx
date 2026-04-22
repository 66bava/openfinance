import { useState } from "react";
import { toast } from "sonner";
import {
  FileText,
  Download,
  FileSpreadsheet,
  Calendar,
  CheckCircle,
  BarChart2,
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  PiggyBank,
} from "lucide-react";
import {
  mockSummary,
  mockCategoryData,
  mockTransactions,
  formatCurrency,
} from "../data/mockData";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro",
];

const years = ["2025", "2024", "2023"];

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("Abril");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [format, setFormat] = useState<"PDF" | "XLSX">("PDF");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsGenerating(false);
    toast.success(`Relatório ${format} gerado!`, {
      description: `${selectedMonth} ${selectedYear} baixado com sucesso.`,
      duration: 3500,
    });
  };

  const recentExpenses = mockTransactions.filter((t) => t.type === "expense").slice(0, 8);

  return (
    <div className="p-4 lg:p-6 max-w-[1000px] mx-auto">
      {/* Controls */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] p-5 mb-5" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <h3 className="text-black mb-4 flex items-center gap-2" style={{ fontSize: 14, fontWeight: 600 }}>
          <Calendar size={16} />
          Configurar Relatório
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Month */}
          <div>
            <label className="text-[#777777] uppercase tracking-wider block mb-2" style={{ fontSize: 11, fontWeight: 500 }}>
              Mês
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-md px-3 py-2.5 outline-none focus:border-black transition-colors text-black bg-white"
              style={{ fontSize: 13 }}
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="text-[#777777] uppercase tracking-wider block mb-2" style={{ fontSize: 11, fontWeight: 500 }}>
              Ano
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-md px-3 py-2.5 outline-none focus:border-black transition-colors text-black bg-white"
              style={{ fontSize: 13 }}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="text-[#777777] uppercase tracking-wider block mb-2" style={{ fontSize: 11, fontWeight: 500 }}>
              Formato
            </label>
            <div className="flex border border-[#E0E0E0] rounded-md overflow-hidden">
              {(["PDF", "XLSX"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 transition-colors ${
                    format === f ? "bg-black text-white" : "text-[#555555] hover:bg-[#F5F5F5]"
                  }`}
                  style={{ fontSize: 13, fontWeight: 500 }}
                >
                  {f === "PDF" ? <FileText size={14} /> : <FileSpreadsheet size={14} />}
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="mt-5 w-full sm:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-[#333333] transition-colors disabled:bg-[#E0E0E0] disabled:text-[#999999] flex items-center gap-2"
          style={{ fontSize: 14, fontWeight: 600 }}
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <Download size={16} />
              Baixar Relatório
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        {/* Report Header */}
        <div className="bg-black text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black" style={{ fontSize: 9, fontWeight: 700 }}>OF</span>
              </div>
              <span className="text-[#E0E0E0] uppercase tracking-wider" style={{ fontSize: 12, fontWeight: 600 }}>
                Open Finance
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>
              Relatório Mensal — {selectedMonth} {selectedYear}
            </h2>
            <p className="text-[#BBBBBB] mt-0.5" style={{ fontSize: 12 }}>
              Pedro Alves · pedro@email.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-[#BBBBBB]" style={{ fontSize: 11 }}>Gerado em</p>
            <p style={{ fontSize: 12, fontWeight: 500 }}>
              {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h3 className="text-[#777777] uppercase tracking-wider mb-4" style={{ fontSize: 13, fontWeight: 600 }}>
            Resumo Executivo
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: "Total de Gastos", value: formatCurrency(mockSummary.totalExpenses), icon: ArrowDownRight, color: "#D32F2F" },
              { label: "Total de Renda", value: formatCurrency(mockSummary.totalIncome), icon: ArrowUpRight, color: "#388E3C" },
              { label: "Saldo", value: formatCurrency(mockSummary.balance), icon: Wallet, color: "#333333" },
              { label: "Economia", value: `${mockSummary.savingsPercent}%`, icon: PiggyBank, color: "#333333" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="border border-[#E0E0E0] rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} style={{ color }} />
                  <p className="text-[#777777]" style={{ fontSize: 11, fontWeight: 500 }}>{label}</p>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h3 className="text-[#777777] uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontSize: 13, fontWeight: 600 }}>
            <BarChart2 size={14} />
            Gastos por Categoria
          </h3>
          <div className="space-y-3">
            {mockCategoryData.map((item) => (
              <div key={item.name} className="flex items-center gap-4">
                <div className="w-28 flex-shrink-0">
                  <p className="text-[#333333]" style={{ fontSize: 12, fontWeight: 500 }}>{item.name}</p>
                </div>
                <div className="flex-1 h-6 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full flex items-center pl-3"
                    style={{ width: `${item.percent}%`, minWidth: "2rem" }}
                  >
                    <span className="text-white" style={{ fontSize: 10, fontWeight: 600 }}>
                      {item.percent}%
                    </span>
                  </div>
                </div>
                <div className="w-24 text-right flex-shrink-0">
                  <p className="text-black" style={{ fontSize: 13, fontWeight: 600 }}>
                    {formatCurrency(item.value)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h3 className="text-[#777777] uppercase tracking-wider mb-4" style={{ fontSize: 13, fontWeight: 600 }}>
            Transações Detalhadas
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E0E0E0]">
                {["Data", "Descrição", "Categoria", "Valor"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-2 text-[#777777]"
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentExpenses.map((tx, i) => (
                <tr key={tx.id} className={i % 2 === 0 ? "" : "bg-[#FAFAFA]"}>
                  <td className="py-2.5 text-[#777777]" style={{ fontSize: 12 }}>
                    {new Date(tx.date + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                  </td>
                  <td className="py-2.5 text-black" style={{ fontSize: 12, fontWeight: 500 }}>
                    {tx.description}
                  </td>
                  <td className="py-2.5">
                    <span
                      className="px-2 py-0.5 rounded"
                      style={{ fontSize: 10, fontWeight: 500, backgroundColor: "#F5F5F5", color: "#555555" }}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[#D32F2F]" style={{ fontSize: 12, fontWeight: 600 }}>
                    -{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recommendations */}
        <div className="px-6 py-5 border-b border-[#F0F0F0]">
          <h3 className="text-[#777777] uppercase tracking-wider mb-3" style={{ fontSize: 13, fontWeight: 600 }}>
            Recomendações de Investimento
          </h3>
          <div className="space-y-2">
            {[
              "BRFS3 — Alimentação: retorno esperado de 8% a.a.",
              "HAPV3 — Saúde: retorno esperado de 10% a.a.",
              "EMBR3 — Transporte: retorno esperado de 12% a.a.",
            ].map((rec) => (
              <div key={rec} className="flex items-center gap-2">
                <CheckCircle size={14} className="text-[#388E3C] flex-shrink-0" />
                <p className="text-[#333333]" style={{ fontSize: 12 }}>{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F5F5F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
              <span className="text-white" style={{ fontSize: 8, fontWeight: 700 }}>OF</span>
            </div>
            <span className="text-[#777777]" style={{ fontSize: 11 }}>Open Finance — Gestão Financeira</span>
          </div>
          <span className="text-[#999999]" style={{ fontSize: 11 }}>
            Documento confidencial · {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </div>
  );
}
