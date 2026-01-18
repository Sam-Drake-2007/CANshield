import api from "./api";

export default async function getUserOperations(userId) {
  try {
    if (!userId) return [];
    const ops = await api(`/users/${userId}/operations`);

    return (ops || []).map((op) => ({
      id: op._id ?? op.id,
      createdAt: op.createdAt,
      ships: (op.fleet?.ships || []).map((s) => ({
        boatId: s.boatId,
        quantity: s.quantity,
      })),
      totalCost: op.totalCost ?? 0,
      avgCoveragePercent: op.coverage?.avgPercent ?? 0,
      totalCoveragePercent: op.coverage?.totalPercent ?? 0, // optional if you want it later
    }));
  } catch (err) {
    throw new Error(err.message || "Failed to load operations");
  }
}