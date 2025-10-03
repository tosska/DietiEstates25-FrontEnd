export interface AuthState {
    authId: number | null,
    userId: number | null,
    role: string | null,
    token: string | null,
    isAuthenticated: boolean
}