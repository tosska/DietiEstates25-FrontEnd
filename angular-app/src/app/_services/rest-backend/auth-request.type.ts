// AuthRequest type for the REST backend
export interface AuthRequest {
    usr: string,
    pwd?: string,
    providerToken?: string,
    providerName?: string
}