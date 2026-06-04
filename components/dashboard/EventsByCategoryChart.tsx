"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategoryChartDatum } from "@/lib/dashboard-stats";
import { useTheme } from "@/providers/ThemeProvider";

type EventsByCategoryChartProps = {
  data: CategoryChartDatum[];
};

export function EventsByCategoryChart({ data }: EventsByCategoryChartProps) {
  const { theme } = useTheme();

  const colors = useMemo(
    () =>
      theme === "dark"
        ? {
            bar: "#3b82f6",
            grid: "#334155",
            tick: "#94a3b8",
            tooltipBg: "#1e293b",
            tooltipBorder: "#6b1e3a",
            tooltipText: "#f1f5f9",
          }
        : {
            bar: "#1d4ed8",
            grid: "#93c5fd",
            tick: "#2563eb",
            tooltipBg: "#eff6ff",
            tooltipBorder: "#93c5fd",
            tooltipText: "#1e3a8a",
          },
    [theme],
  );

  return (
    <div className="h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis
            dataKey="category"
            tick={{ fill: colors.tick, fontSize: 12 }}
            interval={0}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: colors.tick, fontSize: 12 }}
            width={32}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "0.5rem",
              color: colors.tooltipText,
            }}
            labelStyle={{ color: colors.tooltipText }}
            formatter={(value) => [`${value ?? 0}`, "Renginių"]}
            labelFormatter={(label) => `Kategorija: ${label}`}
          />
          <Bar
            dataKey="count"
            name="Renginiai"
            fill={colors.bar}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
