export interface AuthState {
    id: number | null,
    token: string | null,
    role: string | null,
    isAuthenticated: boolean
}