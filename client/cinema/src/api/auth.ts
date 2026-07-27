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

export async function getProfile(username: string) {
    const response = await api.get(`/auth/profile/${username}`); 
    return response.data;
}

export async function updateProfile(username: string, data: any): Promise<boolean> {
    await api.put(`/auth/profile/${username}`, {
        FullName: data.fullName,
        Username: data.username,
        Email: data.email
    });
    return true;
}