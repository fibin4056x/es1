import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Weekly Mock Data
const weeklyData = [
  { day: "Mon", rate: 91 },
  { day: "Tue", rate: 93 },
  { day: "Wed", rate: 89 },
  { day: "Thu", rate: 94.2 },
  { day: "Fri", rate: 92 },
  { day: "Sat", rate: 85 },
  { day: "Sun", rate: 88 },
];

// Monthly Mock Data
const monthlyData = [
  { day: "Week 1", rate: 92.5 },
  { day: "Week 2", rate: 93.8 },
  { day: "Week 3", rate: 91.2 },
  { day: "Week 4", rate: 94.2 },
];

function AttendanceChart() {
  const [activeTab, setActiveTab] = useState("week");
  const data = activeTab === "week" ? weeklyData : monthlyData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div 
          style={{
            background: "var(--card-bg)",
            backdropFilter: "blur(24px)",
            border: "1px solid var(--border-main)",
            borderRadius: "var(--radius-xl)",
            padding: "12px",
            boxShadow: "var(--shadow-card)",
            color: "var(--text-main)",
            fontFamily: "var(--font-family)",
            fontSize: "12px",
          }}
        >
          <p style={{ fontWeight: "700" }}>{payload[0].payload.day}</p>
          <p style={{ color: "var(--primary)", marginTop: "4px" }}>
            Attendance: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card" style={{ padding: "32px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "40px" 
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h4 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.01em" }}>
            Attendance Performance
          </h4>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", opacity: 0.7, marginTop: "4px" }}>
            Real-time engagement trends
          </p>
        </div>

        {/* Tab Toggle Buttons */}
        <div 
          style={{ 
            display: "flex", 
            gap: "4px", 
            background: "rgba(0, 0, 0, 0.05)", 
            padding: "4px", 
            borderRadius: "var(--radius-xl)" 
          }}
          className="dark-bg-subtle"
        >
          <style>{`
            .dark-bg-subtle {
              background: rgba(0, 0, 0, 0.05);
            }
            .dark .dark-bg-subtle {
              background: rgba(255, 255, 255, 0.05);
            }
            .chart-tab-btn {
              padding: 6px 16px;
              border-radius: var(--radius-lg);
              font-size: 12px;
              font-weight: 700;
              color: var(--text-muted);
              transition: all 0.3s ease;
            }
            .chart-tab-btn:hover {
              color: var(--text-main);
            }
            .chart-tab-btn.active {
              background: var(--primary);
              color: #000 !important;
            }
          `}</style>
          <button 
            className={`chart-tab-btn ${activeTab === "week" ? "active" : ""}`}
            onClick={() => setActiveTab("week")}
          >
            Week
          </button>
          <button 
            className={`chart-tab-btn ${activeTab === "month" ? "active" : ""}`}
            onClick={() => setActiveTab("month")}
          >
            Month
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: "260px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c0c1ff" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#c0c1ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="day" 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="var(--text-muted)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              domain={[60, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(192, 193, 255, 0.2)", strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="var(--primary)" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#chartGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;