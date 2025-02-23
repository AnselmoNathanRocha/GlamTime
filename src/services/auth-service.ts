import { httpClient } from "./http-client";

export interface AuthResponse {
  token: string;
  expiresAt: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

class AuthService {
  async authenticate(data: AuthRequest): Promise<AuthResponse> {
    const response = await httpClient.post("/auth/login", data);
    return response.data;
  }

  async logout(fcmToken: string): Promise<void> {
    await httpClient.put("/auth/logout", { fcmToken });
  }

  async updateFcmToken(fcmToken: string) {
    const response = await httpClient.put("/auth/fcm-token", {
      fcmToken,
    });
    return response.data;
  }
}

export const authService = new AuthService();