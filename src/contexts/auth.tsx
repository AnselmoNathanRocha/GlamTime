import { authService } from "../services/auth-service";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  logged: boolean | undefined;
  token: string | null | undefined;
  fcmToken: string | null;
  login: (token: string, expirationDate: string) => void;
  logout: () => void;
  updateFcmToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const expiresIn = localStorage.getItem("expiresIn");

    if (storedToken && expiresIn) {
      const expirationDate = new Date(expiresIn);
      if (expirationDate > new Date()) {
        setToken(storedToken);
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("expiresIn");
        setToken(null);
      }
    } else {
      setToken(null);
    }
  }, []);

  const login = (token: string, expirationDate: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("expiresIn", expirationDate);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiresIn");
    setToken(null);
  };

  async function updateFcmToken(fcmToken: string) {
    localStorage.setItem("fcmToken", fcmToken);

    await authService.updateFcmToken(fcmToken);

    setFcmToken(fcmToken);
  }

  return (
    <AuthContext.Provider
      value={{
        logged: token === undefined ? undefined : !!token,
        token,
        fcmToken,
        login,
        logout,
        updateFcmToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
