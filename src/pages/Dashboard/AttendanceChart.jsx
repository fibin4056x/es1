/* eslint-disable */
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import "./AttendanceChart.css";

function AttendanceChart({
  weekly = [],
  monthly = [],
}) {
  const [activeTab, setActiveTab] = useState("week");

  const rawData = activeTab === "week" ? weekly : monthly;

  // Format data for chart
  const data = rawData.map((item) => ({
    ...item,
    originalDay: item.day,
    day:
      activeTab === "week"
        ? new Date(item.day).toLocaleDateString("en-US", {
            weekday: "short",
          })
        : new Date(item.day).toLocaleDateString("en-US", {
            month: "short",
          }),
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const current = payload[0].payload;
    const date = new Date(current.originalDay);

    return (
      <div className="attendance-tooltip">
        <p className="attendance-tooltip-day">
          {date.toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </p>

        <p className="attendance-tooltip-date">
          {date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <p className="attendance-tooltip-value">
          Attendance: {current.rate}%
        </p>
      </div>
    );
  };

  if (!data.length) {
    return (
      <div className="attendance-chart-card attendance-empty">
        <h4>Attendance Performance</h4>
        <p>No attendance data available.</p>
      </div>
    );
  }

  return (
    <div className="attendance-chart-card">
      <div className="attendance-chart-header">
        <div>
          <h4 className="attendance-chart-title">
            Attendance Performance
          </h4>

          <p className="attendance-chart-subtitle">
            Real-time engagement trends
          </p>
        </div>

        <div className="attendance-tabs">
          <button
            className={`attendance-tab ${
              activeTab === "week" ? "active" : ""
            }`}
            onClick={() => setActiveTab("week")}
          >
            Week
          </button>

          <button
            className={`attendance-tab ${
              activeTab === "month" ? "active" : ""
            }`}
            onClick={() => setActiveTab("month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="attendance-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="attendanceGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#8b5cf6"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#8b5cf6"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              opacity={0.2}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              domain={[60, 100]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="rate"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#attendanceGradient)"
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AttendanceChart;