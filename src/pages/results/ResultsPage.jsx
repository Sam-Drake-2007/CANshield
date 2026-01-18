import bgImage from '../../assets/images/main-bg.png';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MOCK_HISTORY } from './mockDB';
import {Link} from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { IoCloseCircle } from "react-icons/io5";

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
        { id: 2, name: 'Max Coverage', value: '98%' },
        { id: 3, name: 'Min Coverage', value: '30%' },
    ];

    const cost_stats = [
        { id: 4, name: 'Total Money Spent', value: '$1,000,000' }, 
        { id: 5, name: 'Ships Purchased', value: '5' },
        { id: 6, name: 'Favorite Ship', value: 'Kingston' },
    ];

    return (
        <main 
            className="bg-gray-700 min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center bg-blend-overlay"
            style={{
            backgroundImage: `url(${bgImage})`
            }}>
            
            {/* Game Over Title */}
            <div className="mb-7 flex items-center justify-center">
                <p className="text-6xl tracking-wide sm:text-8xl uppercase gap-0.5">
                    <span className="text-r font-raider">Game </span>
                    <span className="text-white/95 font-raider">Over</span>
                </p>
            </div>

            {/* Container for both sections */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4">

                {/* --- Coverage --- */}
                <div className="flex-1 bg-black/50 p-10 border-2 border-purple/80
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

                {/* --- Cost --- */}
                <div className="flex-1 bg-black/50 p-10 border-2 border-green/80 
                 hover:border-green hover:text-green hover:shadow-[0_0_20px_green] duration-300 hover:duration-300">
                    <p className="text-green/80 text-2xl font-arame uppercase tracking-wider text-center mb-6">
                        Cost & Resources
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

                {/* Compare Button */}
                <div className="mt-6 flex items-center justify-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="
                            w-60 px-8 py-4 text-[1.2rem] text-white/80 font-arame
                        bg-b1/60
                        ring-2 ring-white/25 
                        duration-500
                        flex items-center text-center justify-center
                        hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r
                        "
                    >
                        <MdHistory className="mr-2"/>History
                    </button>
                </div>

                {/* Modal Popup for Comparing Previous Runs */}
                {isModalOpen && (

                    // Behind the popup
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
                        
                        {/* Popup Window */}
                        <div className="relative bg-black/60 border-2 border-white/80 w-full max-w-4xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)]">
                            
                            {/* Close Button (Top Right) */}
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-white/80 hover:text-g/80 text-3xl transition-colors 
                                hover:cursor-pointer"
                            >
                                <IoCloseCircle />
                            </button>

                            {/* Modal Title */}
                            <h2 className="text-white/80 text-3xl font-arame uppercase mb-8 text-center tracking-widest drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
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
                                            stroke="#A6A6A6" 
                                            tick={{ fill: '#A6A6A6', dy: 10 }}
                                        />
                                        <YAxis
                                            width={100} 
                                            stroke="#A6A6A6" 
                                            tick={{ fill: '#A6A6A6', dx: -10 }}
                                            tickFormatter={(value) => `${((value / max_cost) * 100).toFixed(0)}% | ${value}`}
                                        />
                                        
                                        {/* Tooltip (Hover info) */}
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#262626', border: '1px solid #A6A6A6'}} 
                                            itemStyle={{ color: '#fff', fontFamily: 'arame' }}   
                                            labelStyle={{ color: '#fff', fontFamily: 'arame'}}
                                            formatter={(value, name) => {
                                                if (name === "Cost & Resources") return [`$${(value * 1000).toLocaleString()}`, "Total Cost"];
                                                if (name === "Coverage %") {
                                                    const real_percent = ((value / max_cost) * 100).toFixed(0);
                                                    return [`${real_percent}%`, "Coverage"];
                                                }
                                                
                                                return [value, name];
                                            }}
                                        />
                                        
                                        {/* Legend */}
                                        <Legend wrapperStyle={{ paddingTop: '20px', fontFamily: "arame"}}/>

                                        {/* Lines */}
                                        <Line 
                                            type="monotone" 
                                            dataKey="scaled_coverage"
                                            stroke="#AD8CFF"
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#AD8CFF' }}
                                            activeDot={{ r: 8 }} 
                                            name="Coverage %" 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="total_cost" 
                                            stroke="#7AEA69" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: '#7AEA69' }}
                                            name="Cost & Resources" 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}


                {/* Play Again Button*/}
                <div className="mt-6 flex items-center text-center justify-center">
                    <Link to="/"
                        className="
                            w-60 px-8 py-4 text-[1.2rem] text-white/80 font-arame
                        bg-b1/60
                        ring-2 ring-white/25 
                        duration-500
                        flex items-center justify-center
                        hover:bg-r2/25 hover:ring-r hover:cursor-pointer hover:duration-500 hover:text-r
                        "
                    >
                        <FaPlay className="mr-4"/>Play Again                                    
                    </Link>

                </div>
            </div>

        </main>
    );
}