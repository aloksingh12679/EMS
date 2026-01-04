import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, } from "recharts";

const data = [
    { week: "Week 1", attendance: 60 },
    { week: "Week 2", attendance: 75 },
    { week: "Week 3", attendance: 55 },
    { week: "Week 4", attendance: 69 },
];


// const [data, setData] = useState([]);

// useEffect(() => {
//   setData([
//     { week: "Week 1", attendance: 92 },
//     { week: "Week 2", attendance: 95 },
//     { week: "Week 3", attendance: 89 },
//     { week: "Week 4", attendance: 98 },
//   ]);
// }, []);

const AttendanceChart = () => {
    return (
        <div className="bg-white rounded-[24px] px-8 py-6 shadow-sm border border-slate-100">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-[16px] font-semibold text-slate-900">
                        Monthly Attendance Trend
                    </h3>
                    <p className="text-[13px] text-slate-500 mt-1">
                        Average daily presence over the last 30 days
                    </p>
                </div>

                {/* Filter pill */}
                <span className="text-[13px] font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-full">
                    Last 30 Days
                </span>
            </div>

            {/* Chart */}
            <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>

                        {/* Grid */}
                        <CartesianGrid
                            stroke="#E5E7EB"
                            strokeDasharray="3 3"
                            vertical={false}
                        />

                        {/* Axes */}
                        <XAxis
                            dataKey="week"
                            stroke="#94A3B8"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                        />

                        <YAxis
                            stroke="#94A3B8"
                            tickLine={false}
                            axisLine={false}
                            fontSize={12}
                            unit="%"
                        />

                        {/* Tooltip */}
                        <Tooltip
                            cursor={{ stroke: "#E5E7EB", strokeWidth: 1 }}
                            contentStyle={{
                                backgroundColor: "#0B1220",
                                borderRadius: "999px",
                                border: "none",
                                color: "#fff",
                                fontSize: "12px",
                                padding: "6px 10px",
                            }}
                            labelFormatter={(label) => `98% ${label}`}
                        />

                        {/* Line */}
                        <Line
                            type="monotone"
                            dataKey="attendance"
                            stroke="#2563EB"
                            strokeWidth={2.5}
                            dot={false}
                            activeDot={{
                                r: 5,
                                fill: "#2563EB",
                                stroke: "#fff",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AttendanceChart;
