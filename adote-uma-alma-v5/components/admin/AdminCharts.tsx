"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export function AdminCharts({ data }: { data: { date: string; total: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-brand-500">Ainda não há contribuições confirmadas.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0e6da" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#a97c4f" />
          <YAxis tick={{ fontSize: 12 }} stroke="#a97c4f" />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#8a5f38" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
