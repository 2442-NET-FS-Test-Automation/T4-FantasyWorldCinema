// Constantes para las URIs de claims que genera .NET por defecto
const NAME_CLAIM = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name";
const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";


interface RawJwtPayload {
  [claim: string]: string | number | undefined;
}

export interface Identity {
  name: string;
  role: string;
}

/* Decode .NET JWT token using native function atob() */
export function decodeToken(token: string): Identity | null {
  try {
    // JWT has 3 sections splited per dots: Header.Payload.Signature
    const segment = token.split(".")[1];
    if (!segment) return null;

    /* Parse from Base64URL to Base64 standard */
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as RawJwtPayload;

    /* Take claims (suports URI & short keys "name"/"role") */
    const name = payload[NAME_CLAIM] ?? payload["name"];
    const role = payload[ROLE_CLAIM] ?? payload["role"];

    if (typeof name !== "string" || typeof role !== "string") {
      return null;
    }

    return { name, role };
  } catch {
    return null;
  }
}