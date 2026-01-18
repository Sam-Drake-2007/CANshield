import { createContext, useContext, useEffect, useMemo, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import createAnonymousUser from "../services/createAnonymousUser";

const KEY = "canshield_userId"; // yikes, but eh. The entire idea is horrible to begin with.

const UserContext = createContext(null);

export function useUserContext() {
    const ctx = useContext(UserContext);
    if(ctx === null) throw new Error("useUserContext() must be used within UserContextProvider.");

    return ctx;
}

export function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const { getItem, setItem } = useLocalStorage();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
        try {
            let id = getItem(KEY);

            if(!id) {
                id = await createAnonymousUser();
                setItem(KEY, id);
            }

            setUserId(id);
        } finally {
            setReady(true);
        }
    })();
  }, []);

  const value = useMemo(
    () => ({ userId, ready }),
    [userId, ready]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}