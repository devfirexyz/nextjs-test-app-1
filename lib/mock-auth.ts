export type MockRole = 'guest' | 'trader' | 'admin'

export type MockUser = {
    id: string;
    name: string;
    role: MockRole;
}

export type Permission =
    | 'market:view'
    | 'trade:create'
    | 'market:manage'


export const mockUsers: MockUser[] = [
    {
        id: "guest-1",
        name: "Guest Viewer",
        role: "guest",
    },
    {
        id: "trader-1",
        name: "Demo Trader",
        role: "trader",
    },
    {
        id: "admin-1",
        name: "Market Admin",
        role: "admin",
    },
];

const rolePermissions: Record<MockRole, Permission[]> = {
    guest: ["market:view"],
    trader: ["market:view", "trade:create"],
    admin: ["market:view", "trade:create", "market:manage"],
};

export function hasPermission(user: MockUser, permission: Permission) {
    return rolePermissions[user.role].includes(permission);
}

export function createMockToken(user: MockUser) {
    return `mock:${user.role}:${user.id}`
}

export function parseMockToken(token: string) {
    const [scheme, role, userId] = token.split(":")
    if (scheme !== 'mock') return null;
    if (role !== "guest" && role !== "trader" && role !== "admin") return null;
    if (!userId) return null;

    const user = mockUsers.find((item) => item.id === userId && item.role === role)

    return user ?? null
}

export const defaultMockerUser = mockUsers[1]