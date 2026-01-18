import { UserContextProvider } from "./UserContextProvider";

export default function ContextProvider({ children }) {
    return (
        <UserContextProvider>
            {children}
        </UserContextProvider>
    );
}