import bgImage from "../../assets/images/main-bg.png";
import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useLocation, Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";

import getUserOperations from "../../services/getUserOperations";
import { useUserContext } from "../../contexts/UserContextProvider";

export default function Results() {
  const { state } = useLocation();
  const run = state?.run ?? null;

  const { userId, ready } = useUserContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    if (!ready || !userId) return;

    (async () => {
      try {
        setHistoryError("");
        setHistoryLoading(true);
        const ops = await getUserOperations(userId);
        setHistory(ops);
        console.log("ops:", ops);
      } catch (e) {
        setHistoryError(e?.message || "Failed to load history");
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    })();
  }, [ready, userId]);

  const coverage_stats = run
    ? [
        { id: 1, name: "Average Coverage", value: `${run.coverage.avg.toFixed(1)}%` },
        { id: 2, name: "Total Coverage", value: `${run.coverage.total.toFixed(1)}%` },
        { id: 3, name: "Min Coverage", value: `${run.coverage.min.toFixed(1)}%` },
        { id: 4, name: "Max Coverage", value: `${run.coverage.max.toFixed(1)}%` },
      ]
    : [
        { id: 1, name: "Average Coverage", value: "—" },
        { id: 2, name: "Total Coverage", value: "—" },
        { id: 3, name: "Min Coverage", value: "—" },
        { id: 4, name: "Max Coverage", value: "—" },
      ];

  const mostUsedBoatId = run
    ? Object.entries(run.qtyByBoatId).sort((a, b) => b[1] - a[1])[0]?.[0]
    : null;

  const boatNameById = run ? Object.fromEntries(run.boats.map((b) => [b.id, b.name])) : {};

  const cost_stats = run
    ? [
        { id: 4, name: "Total Money Spent", value: `$${run.totalCost.toLocaleString()}` },
        { id: 5, name: "Ships Purchased", value: String(run.totalShips) },
        { id: 6, name: "Most Used Ship", value: mostUsedBoatId ? boatNameById[mostUsedBoatId] : "—" },
        { id: 7, name: "Total Route Points", value: String(run.totalRoutePoints) },
      ]
    : [
        { id: 4, name: "Total Money Spent", value: "—" },
        { id: 5, name: "Ships Purchased", value: "—" },
        { id: 6, name: "Most Used Ship", value: "—" },
        { id: 7, name: "Total Route Points", value: "—" },
      ];

  const graphData = useMemo(() => {
    const runs = history || [];

    // Use a timestamp label so multiple ops on the same day don't stack on the same X value
    return runs
      .filter((r) => r?.createdAt)
      .map((r) => {
        const dt = new Date(r.createdAt);
        return {
          date: dt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }), // includes time
          average_coverage_percent: Number(r.avgCoveragePercent ?? 0),
          total_cost_k: Number(r.totalCost ?? 0) / 1000,
        };
      });
  }, [history]);

  return (
    <main
      className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="mb-7 flex items-center justify-center">
        <p className="text-6xl tracking-wide sm:text-8xl uppercase gap-0.5">
          <span className="text-r font-raider">Game </span>
          <span className="text-white/95 font-raider">Over</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4">
        <div className="flex-1 bg-black/50 p-10 border-2 border-purple/80 hover:border-purple hover:text-purple hover:shadow-[0_0_20px_purple] duration-300 hover:duration-300">
          <p className="text-purple/80 text-2xl font-arame uppercase tracking-wider text-center mb-6 ">
            Coverage
          </p>
          <dl className="flex flex-col gap-2 text-center">
            {coverage_stats.map((stat) => (
              <div key={stat.id}>
                <dt className="text-white/80 font-arame uppercase tracking-widest text-sm mt-2 mb-1">
                  {stat.name}
                </dt>
                <dd className="text-white/95 font-arame text-3xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex-1 bg-black/50 p-10 border-2 border-green/80 hover:border-green hover:text-green hover:shadow-[0_0_20px_green] duration-300 hover:duration-300">
          <p className="text-green/80 text-2xl font-arame uppercase tracking-wider text-center mb-6">
            Cost & Resources
          </p>
          <dl className="flex flex-col gap-2 text-center">
            {cost_stats.map((stat) => (
              <div key={stat.id}>
                <dt className="text-white/80 font-arame uppercase tracking-widest text-sm mt-2 mb-1">
                  {stat.name}
                </dt>
                <dd className="text-white/95 font-arame text-3xl font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4 justify-center items-center mx-auto">
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="
              w-60 px-8 py-4 text-[1.2rem] text-white/80 font-arame
              bg-b1/60 ring-2 ring-white/25 duration-500
              flex items-center text-center justify-center
              hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r
            "
          >
            <MdHistory className="mr-2" />
            History
          </button>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="relative bg-black/60 border-2 border-white/80 w-full max-w-4xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-g/80 text-3xl transition-colors hover:cursor-pointer"
              >
                <IoCloseCircle />
              </button>

              <h2 className="text-white/80 text-3xl font-arame uppercase mb-8 text-center tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                Mission History Analysis
              </h2>

              <div className="mb-3 text-xs font-arame text-white/60 text-center">
                {historyLoading && "Loading history..."}
                {!historyLoading && historyError && historyError}
                {!historyLoading && !historyError && history.length === 0 && "No history yet."}
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />

                    <XAxis dataKey="date" stroke="#A6A6A6" tick={{ fill: "#A6A6A6", dy: 10 }} />

                    {/* Left axis = coverage % */}
                    <YAxis
                      yAxisId="cov"
                      domain={[0, 100]}
                      stroke="#A6A6A6"
                      tick={{ fill: "#A6A6A6", dx: -10 }}
                      tickFormatter={(v) => `${v}%`}
                    />

                    {/* Right axis = cost (K) */}
                    <YAxis
                      yAxisId="cost"
                      orientation="right"
                      stroke="#A6A6A6"
                      tick={{ fill: "#A6A6A6" }}
                      tickFormatter={(v) => `${v}K`}
                    />

                    <Tooltip
                      contentStyle={{ backgroundColor: "#262626", border: "1px solid #A6A6A6" }}
                      itemStyle={{ color: "#fff", fontFamily: "arame" }}
                      labelStyle={{ color: "#fff", fontFamily: "arame" }}
                      formatter={(value, name) => {
                        if (name === "Total Cost") {
                          return [`$${(Number(value) * 1000).toLocaleString()}`, "Total Cost"];
                        }
                        if (name === "Average Coverage") {
                          return [`${Number(value).toFixed(1)}%`, "Average Coverage"];
                        }
                        return [value, name];
                      }}
                    />

                    <Legend wrapperStyle={{ paddingTop: "20px", fontFamily: "arame" }} />

                    <Line
                      yAxisId="cov"
                      type="monotone"
                      dataKey="average_coverage_percent"
                      stroke="#AD8CFF"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#AD8CFF" }}
                    activeDot={{ r: 10 }}
                      name="Average Coverage"
                    />

                    <Line
                      yAxisId="cost"
                      type="monotone"
                      dataKey="total_cost_k"
                      stroke="#7AEA69"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#7AEA69" }}
                      activeDot={{ r: 8 }}
                      name="Total Cost"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center text-center justify-center">
          <Link
            to="/"
            className="
              w-60 px-8 py-4 text-[1.2rem] text-white/80 font-arame
              bg-b1/60 ring-2 ring-white/25 duration-500
              flex items-center justify-center
              hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r
            "
          >
            <FaPlay className="mr-4" />
            Play Again
          </Link>
        </div>
      </div>
    </main>
  );
}
