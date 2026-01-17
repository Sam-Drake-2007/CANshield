export default function Results() {

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
        <main className="bg-gray-900 py-24 sm:py-32 min-h-screen">
            
            {/* 1. Centered Game Over Text */}
            <p className="">
                <span className="text-white">Game </span>
                <span className="text-red-500">Over</span>
            </p>

            {/* Coverage Section */}
            <div className="mt-16">
                {/* 2. Changed text-orange to text-red-500 */}
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
        </main>
    );
}