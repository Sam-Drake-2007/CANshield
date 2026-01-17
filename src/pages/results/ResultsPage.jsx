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
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center"
            style={{
                backgroundImage: `url(${bg_url})`,  
        }}>
            
            {/* Game Over Title */}
            <div className="mt-10 mb-10 flex items-center justify-center">
                <p className="text-5xl font-semibold tracking-tight text-balancer sm:text-7xl">
                    <span className="text-white">Game </span>
                    <span className="text-red-500">Over</span>
                </p>
            </div>

            {/* Container for both sections */}
            <div className="flex gap-16">
                
                {/* Coverage Section */}
                <div className="bg-gray-900/80 p-10 rounded-3xl gap-16 backdrop-blur-sm border border-white/10">
                    <p className="text-red-500">
                        Coverage
                    </p>
                    <div className="">
                        <dl className="">
                            {coverage_stats.map((stat) => (
                                <div key={stat.id} className="">
                                    <dt className="text-gray-400">{stat.name}</dt>
                                    <dd className="text-white">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>

                {/* Cost Section */}
                <div className="bg-gray-900/80 p-10 rounded-3xl gap-16 backdrop-blur-sm border border-white/10">
                    <p className="text-green-500">
                        Cost
                    </p>
                    <div className="">
                        <dl className="">
                            {cost_stats.map((stat) => (
                                <div key={stat.id} className="">
                                    <dt className="text-gray-400">{stat.name}</dt>
                                    <dd className="text-white">{stat.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
            
            {/* Compare Button */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                    className="rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Compare to Previous Runs
                </button>
            </div>

        </main>
    );
}