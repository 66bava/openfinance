import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import {
  mockTransactions,
  mockCategoryData,
  mockMonthlyData,
  formatCurrency,
  formatDate,
} from "../data/mockData";

type Period = "semana" | "mês" | "ano";

const CATEGORY_COLORS = ["#111111", "#333333", "#555555", "#777777", "#999999", "#BBBBBB"];

const categoryPrevMonth = [
  { name: "Alimentação", prev: 280, change: 10.5 },
  { name: "Transporte", prev: 180, change: -15.6 },
  { name: "Saúde", prev: 375, change: 0 },
  { name: "Educação", prev: 120, change: -25.1 },
  { name: "Entretenimento", prev: 55, change: 12.4 },
  { name: "Outros", prev: 95, change: 15.8 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#E0E0E0] rounded-lg p-3 shadow-md" style={{ fontSize: 12 }}>
        <p className="font-semibold text-black mb-1">{label || payload[0]?.name}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color ?? "#333" }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Analysis() {
  const [period, setPeriod] = useState<Period>("mês");
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const expenseTransactions = mockTransactions.filter((t) => t.type === "expense");

  return (
    <div className="p-4 lg:p-6 max-w-[1100px] mx-auto">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          {(["semana", "mês", "ano"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 capitalize transition-colors ${
                period === p ? "bg-black text-white" : "text-[#555555] hover:bg-[#F5F5F5]"
              }`}
              style={{ fontSize: 13, fontWeight: 500 }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex bg-white border border-[#E0E0E0] rounded-lg overflow-hidden">
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 transition-colors ${chartType === "bar" ? "bg-black text-white" : "text-[#555555] hover:bg-[#F5F5F5]"}`}
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Barras
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`px-4 py-2 transition-colors ${chartType === "pie" ? "bg-black text-white" : "text-[#555555] hover:bg-[#F5F5F5]"}`}
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Pizza
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg p-5 border border-[#E0E0E0]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 className="text-black mb-4" style={{ fontSize: 14, fontWeight: 600 }}>
            {chartType === "bar" ? "Gastos por Mês" : "Distribuição por Categoria"}
          </h3>
          {chartType === "bar" ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#777" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#777" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="expenses" name="Gastos" fill="#111111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {mockCategoryData.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Averages */}
        <div className="bg-white rounded-lg p-5 border border-[#E0E0E0]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 className="text-black mb-4" style={{ fontSize: 14, fontWeight: 600 }}>
            Médias por Categoria
          </h3>
          <div className="space-y-3">
            {mockCategoryData.map((item, i) => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[#555555]" style={{ fontSize: 12 }}>
                    {item.name}
                  </span>
                  <span className="text-black" style={{ fontSize: 12, fontWeight: 600 }}>
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: CATEGORY_COLORS[i],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-lg border border-[#E0E0E0] mb-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b border-[#F0F0F0]">
          <h3 className="text-black" style={{ fontSize: 14, fontWeight: 600 }}>
            Comparativo por Categoria
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F5F5]">
                {["Categoria", "Este Mês", "Mês Anterior", "Variação", "% Total"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-3 px-5 ${i === 0 ? "text-left" : "text-right"}`}
                    style={{ fontSize: 11, fontWeight: 600, color: "#777777", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockCategoryData.map((item, i) => {
                const prev = categoryPrevMonth[i];
                const isUp = prev.change > 0;
                const isDown = prev.change < 0;
                return (
                  <tr key={item.name} className={i % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: CATEGORY_COLORS[i] }}
                        />
                        <span className="text-black" style={{ fontSize: 13, fontWeight: 500 }}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right text-black" style={{ fontSize: 13, fontWeight: 600 }}>
                      {formatCurrency(item.value)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[#777777]" style={{ fontSize: 13 }}>
                      {formatCurrency(prev.prev)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          backgroundColor: isUp ? "#FFEBEE" : isDown ? "#E8F5E9" : "#F5F5F5",
                          color: isUp ? "#D32F2F" : isDown ? "#388E3C" : "#777777",
                        }}
                      >
                        {isUp ? <ArrowUp size={10} /> : isDown ? <ArrowDown size={10} /> : <Minus size={10} />}
                        {Math.abs(prev.change).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right text-[#777777]" style={{ fontSize: 13 }}>
                      {item.percent}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E0E0E0] bg-[#F5F5F5]">
                <td className="px-5 py-3 text-black" style={{ fontSize: 13, fontWeight: 700 }}>
                  Total
                </td>
                <td className="px-5 py-3 text-right text-black" style={{ fontSize: 13, fontWeight: 700 }}>
                  {formatCurrency(mockCategoryData.reduce((a, b) => a + b.value, 0))}
                </td>
                <td className="px-5 py-3 text-right text-[#777777]" style={{ fontSize: 13 }}>
                  {formatCurrency(categoryPrevMonth.reduce((a, b) => a + b.prev, 0))}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-lg border border-[#E0E0E0]" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <div className="px-5 py-4 border-b border-[#F0F0F0]">
          <h3 className="text-black" style={{ fontSize: 14, fontWeight: 600 }}>
            Todas as Transações
          </h3>
        </div>
        <div className="divide-y divide-[#F5F5F5]">
          {expenseTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#FAFAFA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center text-base">
                  {tx.category === "Alimentação" ? "🍽️" :
                    tx.category === "Transporte" ? "🚌" :
                    tx.category === "Saúde" ? "🏥" :
                    tx.category === "Educação" ? "📚" :
                    tx.category === "Entretenimento" ? "🎬" : "📦"}
                </div>
                <div>
                  <p className="text-black" style={{ fontSize: 13, fontWeight: 500 }}>
                    {tx.description}
                  </p>
                  <p className="text-[#999999]" style={{ fontSize: 11 }}>
                    {formatDate(tx.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#D32F2F]" style={{ fontSize: 13, fontWeight: 600 }}>
                  -{formatCurrency(tx.amount)}
                </p>
                <span
                  className="inline-block px-2 py-0.5 rounded"
                  style={{ fontSize: 10, fontWeight: 500, backgroundColor: "#F5F5F5", color: "#555555" }}
                >
                  {tx.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
