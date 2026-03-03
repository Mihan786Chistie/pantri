export type LoginRequest = {
    email: string
    password: string
}

export type RegisterRequest = {
    email: string
    password: string
    name: string
    avatarUrl?: string
}

export type User = {
    id: string
    name: string
    email: string
    avatarUrl?: string
    createdAt: string
}

export type AuthResponse = {
    id: string
    accessToken: string
    refreshToken: string
}

export type RefreshRequest = {
    refreshToken: string
}