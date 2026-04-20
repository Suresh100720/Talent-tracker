import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area, ReferenceLine,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { Tag } from "antd";

const PALETTE = ["#6366f1", "#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#a78bfa"];

/* ── Shared Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(15,23,42,0.92)", borderRadius: 10, padding: "8px 14px",
      color: "#f1f5f9", fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
      zIndex: 1000
    }}>
      {label && <p style={{ margin: 0, fontWeight: 700, color: "#a5b4fc" }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0 }}>
          <span style={{ color: p.color || "#6366f1" }}>●</span>{" "}
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

/* ── Stat badge ── */
const StatBadge = ({ label, value, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{label}</span>
    <Tag color={color} style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>{value}</Tag>
  </div>
);

/* ─────────────────────────────────────────────────────── *
 * 1. PIE CHART WITH CUSTOMIZED LABEL                      *
 * ─────────────────────────────────────────────────────── */
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '10px', fontWeight: 700 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomizedPie = ({ data }) => {
  const pieData = data && data.length > 0 ? data : [{ name: "No Data", value: 1 }];
  return (
    <PieChart>
      <Pie
        data={pieData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ fontSize: 11, paddingTop: '10px' }}
        formatter={(v) => <span style={{ color: "#475569", fontWeight: 500 }}>{v}</span>}
      />
    </PieChart>
  );
};

/* ─────────────────────────────────────────────────────── *
 * 2. AREA CHART FILL BY VALUE                             *
 * ─────────────────────────────────────────────────────── */
const getGradientOffset = (data) => {
  if (!data || data.length === 0) return { max: 1, min: 0 };
  const values = data.map((d) => d.value);
  const max = Math.max(...values);
  const min = Math.min(...values);
  if (max === min) return { max: 1, min: 0 };
  return { max: max / (max - min), min: 0 };
};

const FillByValueAreaChart = ({ data }) => {
  const off = getGradientOffset(data);
  return (
    <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
      <defs>
        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset={off.max}  stopColor="#6366f1" stopOpacity={0.75} />
          <stop offset={off.max}  stopColor="#10b981" stopOpacity={0.5} />
          <stop offset={off.min}  stopColor="#10b981" stopOpacity={0.2} />
        </linearGradient>
        <linearGradient id="strokeColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset={off.max}  stopColor="#6366f1" stopOpacity={1} />
          <stop offset={off.max}  stopColor="#10b981" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
      <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
      <Tooltip content={<CustomTooltip />} />
      <ReferenceLine y={0} stroke="#e2e8f0" />
      <Area
        type="monotone"
        dataKey="value"
        stroke="url(#strokeColor)"
        strokeWidth={2.5}
        fill="url(#splitColor)"
        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
        activeDot={{ r: 6, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }}
      />
    </AreaChart>
  );
};

/* ─────────────────────────────────────────────────────── *
 * 3. SPECIFIED DOMAIN RADAR CHART                         *
 * ─────────────────────────────────────────────────────── */
const SpecifiedDomainRadar = ({ data }) => {
  const maxVal = data.length > 0 ? Math.max(...(data.map((d) => d.value)), 5) : 5;
  const domain = [0, Math.ceil(maxVal * 1.3)];

  return (
    <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.15} />
        </radialGradient>
      </defs>
      <PolarGrid stroke="#e2e8f0" gridType="polygon" />
      <PolarAngleAxis
        dataKey="name"
        tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
      />
      <PolarRadiusAxis
        angle={90}
        domain={domain}
        tick={{ fontSize: 9, fill: "#94a3b8" }}
        axisLine={false}
        tickCount={4}
      />
      <Radar
        dataKey="value"
        stroke="#6366f1"
        strokeWidth={2}
        fill="url(#radarFill)"
        fillOpacity={1}
        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
        activeDot={{ r: 6, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend
        iconType="circle"
        iconSize={8}
        wrapperStyle={{ paddingTop: '10px' }}
        formatter={(v) => <span style={{ fontSize: 11, color: "#475569" }}>{v}</span>}
      />
    </RadarChart>
  );
};

/* ─────────────────────────────────────────────────────── *
 * MAIN COMPONENT                                          *
 * ─────────────────────────────────────────────────────── */
const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  padding: "16px 18px 12px",
  boxShadow: "0 2px 12px rgba(99,102,241,0.08)",
  border: "1px solid #f1f5f9",
  transition: "box-shadow .25s, transform .25s",
};

const hoverOn  = (e) => { e.currentTarget.style.boxShadow = "0 10px 32px rgba(99,102,241,0.18)"; e.currentTarget.style.transform = "translateY(-3px)"; };
const hoverOff = (e) => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(99,102,241,0.08)"; e.currentTarget.style.transform = "translateY(0)"; };

const ChartLabel = ({ title, badge }) => (
  <div style={{ marginBottom: 8 }}>
    <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: 0.8 }}>
      {title}
    </p>
    <StatBadge label={badge.label} value={badge.value} color={badge.color} />
  </div>
);

const DashboardCharts = ({ chartData = [], total = 0, active = 0, roles = 0 }) => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

      {/* ── Card 1: Pie Chart With Customized Label ── */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Distribution" badge={{ label: "Total", value: total, color: "purple" }} />
        <ResponsiveContainer width="100%" height={220}>
          <CustomizedPie data={chartData} />
        </ResponsiveContainer>
      </div>

      {/* ── Card 2: Bar Chart ── */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Count by Group" badge={{ label: "Total", value: total, color: "purple" }} />
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} barSize={18} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Card 3: Area Chart Fill By Value ── */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Trend" badge={{ label: "Hired", value: active, color: "cyan" }} />
        <ResponsiveContainer width="100%" height={220}>
          <FillByValueAreaChart data={chartData} />
        </ResponsiveContainer>
      </div>

      {/* ── Card 4: Specified Domain Radar ── */}
      <div style={cardStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}>
        <ChartLabel title="Radar View" badge={{ label: "Groups", value: chartData.length, color: "orange" }} />
        <ResponsiveContainer width="100%" height={220}>
          <SpecifiedDomainRadar data={chartData} />
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default DashboardCharts;
