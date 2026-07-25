import { api } from "./axios";

interface LoginResponse {
  token: string;
}

export async function login(identifier: string, password: string): Promise<string> {
  const response = await api.post<LoginResponse>("/auth/login", {
    identifier,
    password,
  });

  return response.data.token;
}


export async function register(fullName: string, username: string, email: string, password: string): Promise<boolean> {
  await api.post("/auth/register", {
    FullName: fullName,
    Username: username,
    Email: email,
    Password: password
  });

  return true;
}