"use client";

import {useMemo, useSyncExternalStore} from "react";
import {
    createMockToken,
    defaultMockUser,
    mockUsers,
    type MockUser,
} from "@/lib/mock-auth";

const USER_ID_STORAGE_KEY = "prediction_market_mock_user_id";
const TOKEN_STORAGE_KEY = "prediction_market_mock_token";
const AUTH_CHANGED_EVENT = "prediction-market-auth-changed";

function readStoredUserId() {
    if (typeof window === "undefined") {
        return defaultMockUser.id;
    }

    return window.localStorage.getItem(USER_ID_STORAGE_KEY) ?? defaultMockUser.id;
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
    return defaultMockUser.id;
}

function findUserById(userId: string): MockUser {
    return mockUsers.find((mockUser) => mockUser.id === userId) ?? defaultMockUser;
}

export function useMockAuth() {
    const userId = useSyncExternalStore(
        subscribeToAuthChanges,
        readStoredUserId,
        getServerSnapshot
    );

    const user = useMemo(() => findUserById(userId), [userId]);

    function setUser(nextUserId: string) {
        const nextUser = findUserById(nextUserId);

        window.localStorage.setItem(USER_ID_STORAGE_KEY, nextUser.id);
        window.localStorage.setItem(TOKEN_STORAGE_KEY, createMockToken(nextUser));
        window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    }

    function getToken() {
        return createMockToken(user);
    }

    return {
        user,
        setUser,
        getToken,
    };
}
