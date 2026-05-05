"use client";

import {mockUsers} from "@/lib/mock-auth";
import {useMockAuth} from "@/lib/hooks/useMockAuth";

export function AuthSwitcher() {
    const {user, setUser} = useMockAuth();

    return (
        <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-[#82909d] lg:inline">Role</span>

            <select
                value={user.id}
                onChange={(event) => setUser(event.target.value)}
                className="rounded-md border border-[#27313a] bg-[#1b232b] px-3 py-2 text-sm text-white outline-none"
            >
                {mockUsers.map((mockUser) => (
                    <option key={mockUser.id} value={mockUser.id}>
                        {mockUser.role}
                    </option>
                ))}
            </select>
        </label>
    );
}
