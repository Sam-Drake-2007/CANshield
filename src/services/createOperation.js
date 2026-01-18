import api from "./api";

export default async function createOperation(operation) {
    try {
        const res = await api("/operations/", {
            method: "POST",
            body: JSON.stringify(operation),
        });

        return {
            id: res._id ?? res.id,
            userId: res.userId,
            createdAt: res.createdAt,

            fleet: {
                ships: (res.fleet?.ships || []).map((s) => ({
                    boatId: s.boatId,
                    quantity: s.quantity,
                })),
            },

            coverage: {
                avgPercent:
                    res.coverage?.avgPercent ??
                    res.coverage?.avg ??
                    0,
                totalPercent:
                    res.coverage?.totalPercent ??
                    res.coverage?.total ??
                    0,
                minPercent: res.coverage?.minPercent ?? 0,
                maxPercent: res.coverage?.maxPercent ?? 0,
            },

            totalCost: res.totalCost ?? 0,
        };
    } catch (err) {
        throw new Error(err.message || "Failed to store operation");
    }
}