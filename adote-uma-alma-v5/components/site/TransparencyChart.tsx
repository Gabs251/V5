"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export function TransparencyChart({
  data,
}: {
  data: { nome: string; Arrecadado: number; Meta: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-sm text-brand-500">Sem dados para apresentar.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e6da" />
          <XAxis dataKey="nome" tick={{ fontSize: 12 }} stroke="#a97c4f" />
          <YAxis tick={{ fontSize: 12 }} stroke="#a97c4f" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Arrecadado" fill="#8a5f38" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Meta" fill="#dcc4a8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
