"use client";

import { getAdminAnalyticsAction } from "@/actions/admin/analytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  FileCode,
  LayoutGrid,
  Mail,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// Colors for the charts
const chartConfig = {
  users: { label: "Users", color: "#f59e0b" }, // Amber
  pages: { label: "Pages", color: "#ec4899" }, // Pink
  contacts: { label: "Contacts", color: "#0ea5e9" }, // Sky
};

const ranges = [
  { label: "Today", value: "today", icon: Clock },
  { label: "7 Days", value: "7", icon: Activity },
  { label: "15 Days", value: "15", icon: LayoutGrid },
  { label: "30 Days", value: "30", icon: Calendar },
  { label: "90 Days", value: "90", icon: BarChart3 },
  { label: "180 Days", value: "180", icon: TrendingUp },
  { label: "365 Days", value: "365", icon: Zap },
];

export default function AnalyticsClient() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [range, setRange] = useState("30");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAdminAnalyticsAction(range);
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [range]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-32">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-100 border-t-emerald-500 dark:border-zinc-900" />
          <Activity className="absolute top-3.5 left-3.5 h-5 w-5 animate-pulse text-emerald-500" />
        </div>
        <p className="font-mono text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
          Synthesizing Data Vectors...
        </p>
      </div>
    );
  }

  if (!data) return null;

  const stats = [
    {
      label: "Users",
      value: data.stats.totalUsers,
      icon: Users,
      sub: "Verified Network",
      color: "#f59e0b",
    },
    {
      label: "Static Pages",
      value: data.stats.totalPages,
      icon: FileCode,
      sub: "Base Resources",
      color: "#ec4899",
    },
    {
      label: "Contacts",
      value: data.stats.totalContacts,
      icon: Mail,
      sub: "External Leads",
      color: "#0ea5e9",
    },
  ];

  return (
    <div className="animate-in space-y-6 duration-700 fade-in">
      {/* Premium Time Range Selector */}
      <div className="pb-0">
        <Tabs
          value={range}
          onValueChange={setRange}
          className="w-full overflow-x-auto overflow-y-hidden"
        >
          <TabsList variant="line">
            {ranges.map((r) => (
              <TabsTrigger key={r.value} value={r.value}>
                {r.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Multi-Metric Analysis */}
      <div className="rounded-xl border border-zinc-100 bg-zinc-50/10 py-6 dark:border-zinc-900 dark:bg-zinc-900/10">
        <ChartContainer
          config={chartConfig}
          className="-ml-6 aspect-auto h-[400px] w-full"
        >
          <AreaChart data={data.chartData} margin={{ left: 0, right: 0 }}>
            <defs>
              {Object.keys(chartConfig).map((key) => (
                <linearGradient
                  key={key}
                  id={`fill${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig[key].color}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.02)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{
                fontSize: 9,
                fontFamily: "monospace",
                fontWeight: "bold",
                fill: "#999",
              }}
              tickFormatter={(value) => {
                if (range === "today") return value.split(" ")[1];
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{
                fontSize: 9,
                fontFamily: "monospace",
                fontWeight: "bold",
                fill: "#999",
              }}
            />
            <ChartTooltip
              cursor={{
                stroke: "#555",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (range === "today") return `TIMELINE: ${value}`;
                    return `DATELINE: ${new Date(value).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}`;
                  }}
                  indicator="dot"
                  className="rounded-xl border-zinc-200 bg-white font-mono shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
                />
              }
            />
            {Object.keys(chartConfig).map(
              (key) =>
                (activeTab === "all" || activeTab === key) && (
                  <Area
                    key={key}
                    dataKey={key}
                    type="monotone"
                    fill={`url(#fill${key})`}
                    stroke={chartConfig[key].color}
                    strokeWidth={3}
                    animationDuration={1500}
                  />
                ),
            )}
          </AreaChart>
        </ChartContainer>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-zinc-100 px-2 pt-6 md:px-4 lg:px-6 dark:border-zinc-900">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-full px-4 py-2 font-mono text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === "all" ? "bg-zinc-900 text-white shadow-lg shadow-zinc-500/10 dark:bg-white dark:text-black" : "bg-transparent text-zinc-400 hover:text-zinc-600"}`}
          >
            All Metrics
          </button>
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-black tracking-widest uppercase transition-all ${activeTab === key ? "shadow-lg shadow-zinc-500/5" : "bg-transparent text-zinc-400 opacity-60 hover:text-zinc-600 hover:opacity-100"}`}
              style={
                activeTab === key
                  ? {
                      backgroundColor: chartConfig[key].color,
                      color: "white",
                    }
                  : {}
              }
            >
              <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
              {chartConfig[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid Overhaul */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="group relative cursor-pointer overflow-hidden rounded-md border border-zinc-100 bg-white p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-500/5 dark:border-zinc-900 dark:bg-zinc-950"
            onClick={() => setActiveTab(stat.label.toLowerCase().split(" ")[0])}
          >
            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] font-black tracking-widest text-zinc-400 uppercase transition-colors group-hover:text-zinc-600">
                    {stat.label}
                  </span>
                  <p className="font-mono text-[8px] font-bold tracking-tighter text-zinc-300 uppercase">
                    {stat.sub}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-3 transition-transform duration-500 group-hover:scale-110 dark:border-zinc-800 dark:bg-zinc-900">
                  <stat.icon
                    className="h-5 w-5"
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter text-zinc-900 italic dark:text-white">
                  {stat.value.toLocaleString()}
                </div>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-50 dark:bg-zinc-900">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                  className="h-full opacity-60"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </div>
            {/* Background Aesthetic */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] transition-opacity duration-1000 group-hover:opacity-[0.07]">
              <stat.icon size={120} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
