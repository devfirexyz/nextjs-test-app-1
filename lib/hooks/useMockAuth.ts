"use client";

import {useSyncExternalStore} from "react";
import {
    createMockToken,
    defaultMockUser,
    mockUsers,
    type MockUser,
} from "@/lib/mock-auth";

const USER_STORAGE_KEY = "prediction_market_mock_user";
const TOKEN_STORAGE_KEY = "prediction_market_mock_token";
const AUTH_CHANGED_EVENT = "prediction-market-auth-changed";

function readStoredUser(): MockUser {
    if (typeof window === "undefined") {
        return defaultMockUser;
    }

    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (!storedUser) {
        return defaultMockUser;
    }

    try {
        const parsedUser = JSON.parse(storedUser) as MockUser;

        return (
            mockUsers.find(
                (mockUser) =>
                    mockUser.id === parsedUser.id && mockUser.role === parsedUser.role
            ) ?? defaultMockUser
        );
    } catch {
        return defaultMockUser;
    }
}

function subscribeToAuthChanges(callback: () => void) {
    window.addEventListener("storage", callback);
    window.addEventListener(AUTH_CHANGED_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(AUTH_CHANGED_EVENT, callback);
    };
}

function getServerSnapshot() {
    return defaultMockUser;
}

export function useMockAuth() {
    const user = useSyncExternalStore(
        subscribeToAuthChanges,
        readStoredUser,
        getServerSnapshot
    );

    function setUser(userId: string) {
        const nextUser = mockUsers.find((mockUser) => mockUser.id === userId);

        if (!nextUser) return;

        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
        window.localStorage.setItem(TOKEN_STORAGE_KEY, createMockToken(nextUser));
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }

    return {
        user,
        setUser,
    };
}
