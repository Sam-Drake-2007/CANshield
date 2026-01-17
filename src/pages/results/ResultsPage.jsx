export default function Results() {

    const bg_url = "https://images.unsplash.com/photo-1651771529172-0d45a1455598?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

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
            /*style={{
                backgroundImage: `url(${bg_url})`,
        }} =========> NOT USING BG FOR NOW, TEMPORARY GRAY COLOR*/
        >
            
            {/* Game Over Title */}
            <div className="mb-7 flex items-center justify-center">
                <p className="text-6xl font-bold tracking-tight sm:text-8xl uppercase">
                    <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Game </span>
                    <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">Over</span>
                </p>
            </div>

            {/* Container for both sections */}
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full px-4">

                {/* --- RED BOX (Coverage) --- */}
                <div className="flex-1 bg-black/40 p-10 rounded-xl backdrop-blur-md border-2 border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <p className="text-red-500 text-2xl font-bold uppercase tracking-wider text-center mb-6 drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
                        Coverage
                    </p>
                    <dl className="flex flex-col gap-2 text-center">
                        {coverage_stats.map((stat) => (
                            <div key={stat.id} className="">
                                <dt className="text-gray-400 uppercase tracking-widest text-sm mb-1">{stat.name}</dt>
                                <dd className="text-white text-3xl font-bold">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* --- GREEN BOX (Cost) --- */}
                <div className="flex-1 bg-black/40 p-10 rounded-xl backdrop-blur-md border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <p className="text-green-400 text-2xl font-bold uppercase tracking-wider text-center mb-6 drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]">
                        Resources & Cost
                    </p>
                    <dl className="flex flex-col gap-2 text-center">
                        {cost_stats.map((stat) => (
                            <div key={stat.id} className="">
                                <dt className="text-gray-400 uppercase tracking-widest text-sm mb-1">{stat.name}</dt>
                                <dd className="text-white text-3xl font-bold">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
            
            {/* Compare Button - Cyan glowing style */}
            <div className="mt-6 flex items-center justify-center">
                <button
                    className="
                        px-8 py-4 text-lg font-bold uppercase tracking-widest text-white
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

        </main>
    );
}