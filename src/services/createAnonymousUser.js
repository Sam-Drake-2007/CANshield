import api from "./api";

export default async function createAnonymousUser() {
    try {
        const res = await api("/users/", {
            method: "POST",
        });

        return res.userId;
    } catch(err) {
        throw new Error(err.message || "Internal server error.");
    }
}