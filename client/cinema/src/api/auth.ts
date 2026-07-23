import { api } from "./axios";

interface LoginResponse {
  token: string;
}

export async function login(identifier: string, password: string): Promise<string> {
  const response = await api.post<LoginResponse>("/auth/login", {
    identifier,
    password,
  });

  // Retornamos el string del token que envía .NET
  return response.data.token;
}