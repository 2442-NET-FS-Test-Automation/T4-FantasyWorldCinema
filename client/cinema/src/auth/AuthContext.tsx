import { createContext, useReducer } from "react";
import type { ReactNode } from "react";
import { login as loginRequest } from "../api/auth";
import { decodeToken } from "./jwt";
import { getToken, setToken, clearToken } from "./storage";
import { authReducer, initialAuthState } from "./authReducer";
import type { AuthState } from "./authReducer";

// Context distributes our AuthState to any components rendered within it 
// (children of those components included). Any component can call useAuth (our hook)
// to read the user or trigger login/logout
interface AuthContextValue extends AuthState {
    login: (identifier: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function initAuthState(): AuthState {
    const token = getToken();
    const user = token ? decodeToken(token) : null;

    if (!user) return initialAuthState;

    return { status: "authenticated", user, error: null };
}

// Finally our provider - the "component" that wraps other components 
// and lets them see the state inside of AuthContext
export function AuthProvider({ children }: { children: ReactNode }) {

    // Lets call our reducer via the useReducer hook
    const [state, dispatch] = useReducer(authReducer, undefined, initAuthState);

    /* Our login method */
    async function login(identifier: string, password: string): Promise<boolean> {

        dispatch({ type: "login_start" });

        try {
            const token = await loginRequest(identifier, password);
            const user = decodeToken(token);

            if (!user) throw new Error("token missing expected claims");
            
            /* If our token is present with the correct claims - we can now store it */
            setToken(token);
            dispatch({ type: "login_success", user });
            return true; 

        } catch {
            dispatch({ type: "login_failure", error: "invalid credentials or server error" });
            return false;
        }
    }

    function logout() {
        clearToken();
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children} {/* Children represents any components rendering inside of the AuthContext.Provider */}
        </AuthContext.Provider>
    );
}