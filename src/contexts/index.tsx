import { ReactNode } from "react";
import { AuthProvider } from "./auth";
import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
}
