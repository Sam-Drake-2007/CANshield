export default function useLocalStorage() {
    if (!window || !window.localStorage) {
        throw new Error("Could not load local storage.");
    }

    const localStorage = window.localStorage;

    const getItem = (key) => localStorage.getItem(key);
    const setItem = (key, value) => localStorage.setItem(key, value);
    const removeItem = (key) => localStorage.removeItem(key);
    const clear = () => localStorage.clear();

    return { getItem, setItem, removeItem, clear };
}