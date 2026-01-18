import api from "./api";

export default async function getBoats() {
    try {
        const boats = await api("/boats/"); // backend returns [{_id, name, cost, topSpeedKnots, rangeNm, ...}]

        return (boats || []).map((b) => ({
            id: b._id ?? b.id,
            name: b.name,
            cost: b.cost,
            topSpeedKnots: b.topSpeedKnots,
            rangeNm: b.rangeNm,
            coverageRadiusM: b.coverageRadiusM,
        }));

    } catch (err) {
        throw new Error(err.message || "Failed to load boats");
    }
}