import bgImage from '../../assets/images/main-bg.png';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_HISTORY } from './mockDB';
import {Link} from 'react-router-dom';

export default function Results() {

    {/* Defining Constants */}

    const [isModalOpen, setIsModalOpen] = useState(false); // Hiding popup modal until triggered
    
    const max_cost = Math.max(...MOCK_HISTORY.map(run => run.totalCost / 1000)); // Max cost in thousands
    const graphData = MOCK_HISTORY.map(run => ({
        date: new Date(run.createdAt).toLocaleDateString(), // Output format: MM/DD/YYYY
        average_coverage_percent: run.avgCoveragePercent,
        total_cost: run.totalCost / 1000, // Converting to thousands for better readability
        scaled_coverage: (run.avgCoveragePercent / 100) * max_cost // Scaling coverage to max cost
    }));

    console.log("[DEBUG] Graph Data:", graphData);

    const coverage_stats = [
        { id: 1, name: 'Average Coverage', value: '73%' },
        { id: 2, name: 'Min Coverage', value: '30%' },
        { id: 3, name: 'Max Coverage', value: '98%' },
    ];

    const cost_stats = [
        { id: 4, name: 'Total Money Spent', value: '$1,000,000' }, 
        { id: 5, name: 'Refuel Counts', value: '15' },
        { id: 6, name: 'Ships Purchased', value: '3' },
    ];

    return (
        <main 
            className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
            style={{
            backgroundImage: `url(${bgImage})`
            }}>
            
            {/* Game Over Title */}
            <div className="mb-7 flex items-center justify-center">
                <p className="text-6xl font-bold tracking-tight sm:text-8xl uppercase">
                    <span className="text-r font-raider">Game </span>
                    <span className="text-white/95 font-raider">Over</span>
                </p>
            </div>

            {/* Container for both sections */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4">

                {/* --- RED BOX (Coverage) --- */}
                <div className="flex-1 bg-black/40 p-10 border-2 border-purple/80
                 hover:border-purple hover:text-purple hover:shadow-[0_0_20px_purple] duration-300 hover:duration-300">
                    <p className="text-purple/80 text-2xl font-arame uppercase tracking-wider text-center mb-6 ">
                        Coverage
                    </p>
                    <dl className="flex flex-col gap-2 text-center">
                        {coverage_stats.map((stat) => (
                            <div key={stat.id} className="">
                                <dt className="text-white/80 font-arame uppercase tracking-widest text-sm mt-2 mb-1">{stat.name}</dt>
                                <dd className="text-white/95 font-arame text-3xl font-bold">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* --- GREEN BOX (Cost) --- */}
                <div className="flex-1 bg-black/40 p-10 border-2 border-blue/80 
                 hover:border-blue hover:text-blue hover:shadow-[0_0_20px_blue] duration-300 hover:duration-300">
                    <p className="text-blue/80 text-2xl font-arame uppercase tracking-wider text-center mb-6 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                        Resources & Cost
                    </p>
                    <dl className="flex flex-col gap-2 text-center">
                        {cost_stats.map((stat) => (
                            <div key={stat.id} className="">
                                <dt className="text-white/80 font-arame uppercase tracking-widest text-sm mt-2 mb-1">{stat.name}</dt>
                                <dd className="text-white/95 font-arame text-3xl font-bold">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            
            {/* Container for both bottom buttons */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4 justify-center items-center mx-auto">

                {/* Compare Button - Cyan glowing style */}
                <div className="mt-6 flex items-center justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="
                            w-96 px-8 py-4 text-lg font-bold uppercase tracking-widest text-white
                            bg-cyan-950/80 border-2 border-cyan-400 rounded-md
                            shadow-[0_0_15px_rgba(34,211,238,0.4)]
                            hover:bg-cyan-900 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:border-cyan-300
                            transition-all duration-300
                            hover:cursor-pointer
                        "
                    >
                        Compare Previous Runs
                    </button>
                </div>

                {/* Modal Popup for Comparing Previous Runs */}
                {isModalOpen && (

                    // Behind the popup
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                        
                        {/* Popup Window */}
                        <div className="relative bg-gray-900 border-2 border-cyan-500 w-full max-w-4xl rounded-2xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                            
                            {/* Close Button (Top Right) */}
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl transition-colors hover:cursor-pointer"
                            >
                                X
                            </button>

                            {/* Modal Title */}
                            <h2 className="text-cyan-400 text-3xl font-bold uppercase mb-8 text-center tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                Mission History Analysis
                            </h2>

                            {/* The Graph */}
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        {/* Grid Lines */}
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                                        
                                        {/* Axes */}
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="#9CA3AF" 
                                            tick={{ fill: '#9CA3AF', dy: 10 }}
                                        />
                                        <YAxis
                                            width={100} 
                                            stroke="#9CA3AF" 
                                            tick={{ fill: '#9CA3AF', dx: -10 }}
                                            tickFormatter={(value) => `${((value / max_cost) * 100).toFixed(0)}% | ${value}`}
                                        />
                                        
                                        {/* Tooltip (Hover info) */}
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #06b6d4', borderRadius: '8px' }} 
                                            itemStyle={{ color: '#fff' }}   
                                            labelStyle={{ color: '#fff' }}
                                            formatter={(value, name) => {
                                                if (name === "Cost") return [`$${(value * 1000).toLocaleString()}`, "Total Cost"];
                                                if (name === "Coverage %") {
                                                    const real_percent = ((value / max_cost) * 100).toFixed(0);
                                                    return [`${real_percent}%`, "Coverage"];
                                                }
                                                
                                                return [value, name];
                                            }}
                                        />
                                        
                                        {/* Legend */}
                                        <Legend wrapperStyle={{ paddingTop: '20px' }}/>

                                        {/* Lines */}
                                        <Line 
                                            type="monotone" 
                                            dataKey="scaled_coverage"
                                            stroke="#ef4444" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#ef4444' }}
                                            activeDot={{ r: 8 }} 
                                            name="Coverage %" 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="total_cost" 
                                            stroke="#22c55e" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#22c55e' }}
                                            name="Cost" 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}


                {/* Play Again Button - Cyan glowing style */}
                <div className="mt-6 flex items-center justify-center">
                    <Link to="/"
                        className="
                            w-96 px-8 py-4 text-lg font-bold uppercase tracking-widest text-white
                            bg-cyan-950/80 border-2 border-cyan-400 rounded-md
                            shadow-[0_0_15px_rgba(34,211,238,0.4)]
                            hover:bg-cyan-900 hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:border-cyan-300
                            transition-all duration-300
                            hover:cursor-pointer
                            text-center
                        "
                    >
                        Play Again
                    </Link>
                </div>
            </div>

        </main>
    );
}