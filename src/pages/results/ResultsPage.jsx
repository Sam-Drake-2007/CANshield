export default function Results() {

    const stats = {
        average_coverage: 73,
        min_coverage: 30,
        max_coverage: 98,
    };
    return (
        <main>
            <h1>Ths is the results page.</h1>
            <p>Aveage Coverage: {stats.average_coverage}%</p>
            <p>Minimum Coverage: {stats.min_coverage}%</p>
            <p>Maximum Coverage: {stats.max_coverage}%</p>
        </main>
    );
}